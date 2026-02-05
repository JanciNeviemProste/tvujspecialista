import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Deal, DealStatus } from '../database/entities/deal.entity';
import { LeadEvent, LeadEventType } from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { EmailService } from '../email/email.service';
import { CommissionsService } from '../commissions/services/commissions.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(LeadEvent)
    private leadEventRepository: Repository<LeadEvent>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    private emailService: EmailService,
    @Inject(forwardRef(() => CommissionsService))
    private commissionsService: CommissionsService,
  ) {}

  async create(createDealDto: CreateDealDto) {
    if (!createDealDto.gdprConsent) {
      throw new BadRequestException('GDPR consent is required');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { id: createDealDto.specialistId },
    });

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const deal = this.dealRepository.create(createDealDto);
    const savedDeal = await this.dealRepository.save(deal);

    await this.leadEventRepository.save({
      leadId: savedDeal.id,
      type: LeadEventType.CREATED,
      data: { customerName: createDealDto.customerName },
    });

    await this.specialistRepository.update(specialist.id, {
      leadsThisMonth: specialist.leadsThisMonth + 1,
    });

    await this.emailService.sendNewLeadNotification(
      specialist.email,
      specialist.name,
      createDealDto,
    );

    await this.emailService.sendLeadConfirmation(
      createDealDto.customerEmail,
      createDealDto.customerName,
      specialist.name,
    );

    return savedDeal;
  }

  async findBySpecialist(specialistId: string) {
    return this.dealRepository.find({
      where: { specialistId },
      relations: ['commission'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(dealId: string, specialistId: string): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: ['specialist', 'commission'],
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.specialistId !== specialistId) {
      throw new BadRequestException('Unauthorized');
    }

    return deal;
  }

  async updateStatus(dealId: string, userId: string, updateDto: UpdateDealStatusDto) {
    const deal = await this.dealRepository.findOne({ where: { id: dealId } });
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist || deal.specialistId !== specialist.id) {
      throw new BadRequestException('Unauthorized');
    }

    const oldStatus = deal.status;
    deal.status = updateDto.status;
    await this.dealRepository.save(deal);

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.STATUS_CHANGED,
      data: { oldStatus, newStatus: updateDto.status },
    });

    return deal;
  }

  async addNote(dealId: string, userId: string, addNoteDto: AddNoteDto) {
    const deal = await this.dealRepository.findOne({ where: { id: dealId } });
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist || deal.specialistId !== specialist.id) {
      throw new BadRequestException('Unauthorized');
    }

    deal.notes = [...deal.notes, addNoteDto.note];
    await this.dealRepository.save(deal);

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.NOTE_ADDED,
      data: { note: addNoteDto.note },
    });

    return deal;
  }

  async updateDealValue(
    dealId: string,
    specialistId: string,
    dealValue: number,
    estimatedCloseDate: Date,
  ): Promise<Deal> {
    const deal = await this.findOne(dealId, specialistId);

    deal.dealValue = dealValue;
    deal.estimatedCloseDate = estimatedCloseDate;

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.STATUS_CHANGED,
      data: {
        action: 'value_updated',
        dealValue,
        estimatedCloseDate,
      },
    });

    return this.dealRepository.save(deal);
  }

  async closeDeal(
    dealId: string,
    specialistId: string,
    status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST,
    actualDealValue?: number,
  ): Promise<Deal> {
    const deal = await this.findOne(dealId, specialistId);

    if (status === DealStatus.CLOSED_WON && !actualDealValue) {
      throw new BadRequestException('Deal value required for closed won deals');
    }

    const oldStatus = deal.status;
    deal.status = status;
    deal.actualCloseDate = new Date();

    if (status === DealStatus.CLOSED_WON && actualDealValue) {
      deal.dealValue = actualDealValue;

      // Create commission
      const commission = await this.commissionsService.createCommission(
        dealId,
        specialistId,
        actualDealValue,
      );

      deal.commissionId = commission.id;
    }

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.STATUS_CHANGED,
      data: {
        oldStatus,
        newStatus: status,
        actualDealValue,
      },
    });

    return this.dealRepository.save(deal);
  }

  async reopenDeal(dealId: string, specialistId: string): Promise<Deal> {
    const deal = await this.findOne(dealId, specialistId);

    if (deal.status !== DealStatus.CLOSED_LOST) {
      throw new BadRequestException('Can only reopen closed lost deals');
    }

    deal.status = DealStatus.IN_PROGRESS;
    deal.actualCloseDate = null;

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.STATUS_CHANGED,
      data: {
        oldStatus: DealStatus.CLOSED_LOST,
        newStatus: DealStatus.IN_PROGRESS,
        action: 'reopened',
      },
    });

    return this.dealRepository.save(deal);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetMonthlyLeadCounts() {
    await this.specialistRepository.update({}, { leadsThisMonth: 0 });
    console.log('Monthly lead counts reset');
  }
}

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Lead } from '../database/entities/lead.entity';
import {
  LeadEvent,
  LeadEventType,
} from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(LeadEvent)
    private leadEventRepository: Repository<LeadEvent>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    private emailService: EmailService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    if (!createLeadDto.gdprConsent) {
      throw new Error('GDPR consent is required');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { id: createLeadDto.specialistId },
    });

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const lead = this.leadRepository.create(createLeadDto);
    const savedLead = await this.leadRepository.save(lead);

    await this.leadEventRepository.save({
      leadId: savedLead.id,
      type: LeadEventType.CREATED,
      data: { customerName: createLeadDto.customerName },
    });

    await this.specialistRepository.update(specialist.id, {
      leadsThisMonth: specialist.leadsThisMonth + 1,
    });

    await this.emailService.sendNewLeadNotification(
      specialist.email,
      specialist.name,
      createLeadDto,
    );

    await this.emailService.sendLeadConfirmation(
      createLeadDto.customerEmail,
      createLeadDto.customerName,
      specialist.name,
    );

    return savedLead;
  }

  async findBySpecialist(specialistId: string) {
    return this.leadRepository.find({
      where: { specialistId },
      order: { createdAt: 'DESC' },
    });
  }

  async findSpecialistByUserId(userId: string): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist) throw new NotFoundException('Specialist not found');
    return specialist;
  }


  async updateStatus(
    leadId: string,
    userId: string,
    updateDto: UpdateLeadStatusDto,
  ) {
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist || lead.specialistId !== specialist.id) {
      throw new NotFoundException('Unauthorized');
    }

    const oldStatus = lead.status;
    lead.status = updateDto.status;
    await this.leadRepository.save(lead);

    await this.leadEventRepository.save({
      leadId,
      type: LeadEventType.STATUS_CHANGED,
      data: { oldStatus, newStatus: updateDto.status },
    });

    return lead;
  }

  async addNote(leadId: string, userId: string, addNoteDto: AddNoteDto) {
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist || lead.specialistId !== specialist.id) {
      throw new NotFoundException('Unauthorized');
    }

    lead.notes = [...lead.notes, addNoteDto.note];
    await this.leadRepository.save(lead);

    await this.leadEventRepository.save({
      leadId,
      type: LeadEventType.NOTE_ADDED,
      data: { note: addNoteDto.note },
    });

    return lead;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetMonthlyLeadCounts() {
    try {
      await this.specialistRepository.update({}, { leadsThisMonth: 0 });
      this.logger.log('Monthly lead counts reset');
    } catch (error) {
      this.logger.error('Failed to reset monthly lead counts:', error);
    }
  }
}

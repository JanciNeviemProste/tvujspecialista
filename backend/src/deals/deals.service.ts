import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: ['specialist', 'specialist.user'],
    });
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

    // Send email notification
    try {
      if (deal.specialist?.user?.email) {
        await this.emailService.sendDealStatusChange(
          deal.specialist.user.email,
          deal.specialist.user.name || 'Špecialista',
          {
            customerName: deal.customerName,
          },
          oldStatus,
          updateDto.status,
        );
      } else if (deal.specialist?.email) {
        // Fallback to specialist email if user email is not available
        await this.emailService.sendDealStatusChange(
          deal.specialist.email,
          deal.specialist.name || 'Špecialista',
          {
            customerName: deal.customerName,
          },
          oldStatus,
          updateDto.status,
        );
      }
    } catch (error) {
      console.error('Failed to send status change email:', error);
      // Don't block the update if email fails
    }

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
    const deal = await this.dealRepository.findOne({
      where: { id: dealId, specialistId },
      relations: ['specialist', 'specialist.user'],
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

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

    const savedDeal = await this.dealRepository.save(deal);

    // Send email notification
    try {
      if (deal.specialist?.user?.email) {
        await this.emailService.sendDealValueSet(
          deal.specialist.user.email,
          deal.specialist.user.name || 'Špecialista',
          {
            customerName: deal.customerName,
            dealValue,
            estimatedCloseDate: new Date(estimatedCloseDate).toLocaleDateString('sk-SK'),
          },
        );
      } else if (deal.specialist?.email) {
        // Fallback to specialist email if user email is not available
        await this.emailService.sendDealValueSet(
          deal.specialist.email,
          deal.specialist.name || 'Špecialista',
          {
            customerName: deal.customerName,
            dealValue,
            estimatedCloseDate: new Date(estimatedCloseDate).toLocaleDateString('sk-SK'),
          },
        );
      }
    } catch (error) {
      console.error('Failed to send value set email:', error);
      // Don't block the update if email fails
    }

    return savedDeal;
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
    deal.actualCloseDate = null as any;

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

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDeadlineReminders() {
    console.log('Running deadline reminder cron job...');

    try {
      // Find deals with estimated close date in 3 days
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      threeDaysFromNow.setHours(0, 0, 0, 0);

      const threeDaysEnd = new Date(threeDaysFromNow);
      threeDaysEnd.setHours(23, 59, 59, 999);

      const deals = await this.dealRepository.find({
        where: {
          status: In([
            DealStatus.NEW,
            DealStatus.CONTACTED,
            DealStatus.QUALIFIED,
            DealStatus.IN_PROGRESS,
          ]),
        },
        relations: ['specialist', 'specialist.user'],
      });

      // Filter deals with estimated close date in 3 days
      const dealsToRemind = deals.filter((deal) => {
        if (!deal.estimatedCloseDate) return false;
        const closeDate = new Date(deal.estimatedCloseDate);
        return closeDate >= threeDaysFromNow && closeDate <= threeDaysEnd;
      });

      console.log(`Found ${dealsToRemind.length} deals with deadline in 3 days`);

      // Send reminders
      for (const deal of dealsToRemind) {
        try {
          let email: string | null = null;
          let name: string = 'Špecialista';

          if (deal.specialist?.user?.email) {
            email = deal.specialist.user.email;
            name = deal.specialist.user.name || name;
          } else if (deal.specialist?.email) {
            email = deal.specialist.email;
            name = deal.specialist.name || name;
          }

          if (email) {
            await this.emailService.sendDealDeadlineReminder(
              email,
              name,
              {
                customerName: deal.customerName,
                dealValue: deal.dealValue,
                estimatedCloseDate: new Date(deal.estimatedCloseDate).toLocaleDateString('sk-SK'),
              },
            );
            console.log(`Sent deadline reminder for deal ${deal.id}`);
          }
        } catch (error) {
          console.error(`Failed to send reminder for deal ${deal.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in deadline reminder cron job:', error);
    }
  }

  async getEventsByDeal(dealId: string, specialistId: string): Promise<LeadEvent[]> {
    // First verify the deal belongs to this specialist
    const deal = await this.dealRepository.findOne({
      where: { id: dealId, specialistId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    // Fetch events ordered by createdAt DESC
    const events = await this.leadEventRepository.find({
      where: { leadId: dealId },
      order: { createdAt: 'DESC' },
    });

    return events;
  }

  async getAnalytics(specialistId: string) {
    const deals = await this.dealRepository.find({
      where: { specialistId },
    });

    const closedDeals = deals.filter(
      (d) => d.status === DealStatus.CLOSED_WON || d.status === DealStatus.CLOSED_LOST
    );
    const wonDeals = deals.filter((d) => d.status === DealStatus.CLOSED_WON);
    const lostDeals = deals.filter((d) => d.status === DealStatus.CLOSED_LOST);

    // Conversion rate
    const conversionRate = closedDeals.length > 0
      ? (wonDeals.length / closedDeals.length) * 100
      : 0;

    // Average deal value
    const dealsWithValue = deals.filter((d) => d.dealValue && d.dealValue > 0);
    const averageDealValue = dealsWithValue.length > 0
      ? dealsWithValue.reduce((sum, d) => sum + d.dealValue, 0) / dealsWithValue.length
      : 0;

    // Average time to close (in days)
    const dealsWithCloseDates = wonDeals.filter((d) => d.actualCloseDate);
    const averageTimeToClose = dealsWithCloseDates.length > 0
      ? dealsWithCloseDates.reduce((sum, d) => {
          const created = new Date(d.createdAt);
          const closed = new Date(d.actualCloseDate);
          const days = Math.floor((closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / dealsWithCloseDates.length
      : 0;

    // Win rate
    const winRate = closedDeals.length > 0
      ? (wonDeals.length / closedDeals.length) * 100
      : 0;

    // Status distribution
    const statusDistribution = Object.values(DealStatus).map((status) => ({
      status,
      count: deals.filter((d) => d.status === status).length,
    }));

    // Monthly trend (last 6 months)
    const now = new Date();
    const monthlyTrend: Array<{ month: string; won: number; lost: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthName = monthDate.toLocaleDateString('sk-SK', { month: 'short', year: 'numeric' });

      const won = wonDeals.filter((d) => {
        const closeDate = new Date(d.actualCloseDate);
        return closeDate >= monthDate && closeDate <= monthEnd;
      }).length;

      const lost = lostDeals.filter((d) => {
        const closeDate = new Date(d.actualCloseDate);
        return closeDate >= monthDate && closeDate <= monthEnd;
      }).length;

      monthlyTrend.push({ month: monthName, won, lost });
    }

    return {
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageDealValue: Math.round(averageDealValue * 100) / 100,
      averageTimeToClose: Math.round(averageTimeToClose),
      winRate: Math.round(winRate * 10) / 10,
      statusDistribution,
      monthlyTrend,
    };
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Deal, DealStatus } from '../database/entities/deal.entity';
import {
  LeadEvent,
  LeadEventType,
} from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { EmailService } from '../email/email.service';
import { CommissionsService } from '../commissions/services/commissions.service';

@Injectable()
export class DealsService {
  private readonly logger = new Logger(DealsService.name);

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

  async findSpecialistByUserId(userId: string): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    return specialist;
  }

  async updateStatus(
    dealId: string,
    userId: string,
    updateDto: UpdateDealStatusDto,
  ) {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: ['specialist', 'specialist.user'],
    });
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
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
            dealValue: deal.dealValue || 0,
            estimatedCloseDate: deal.estimatedCloseDate || new Date(),
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
            dealValue: deal.dealValue || 0,
            estimatedCloseDate: deal.estimatedCloseDate || new Date(),
          },
          oldStatus,
          updateDto.status,
        );
      }
    } catch (error) {
      this.logger.error('Failed to send status change email:', error);
      // Don't block the update if email fails
    }

    return deal;
  }

  async addNote(dealId: string, userId: string, addNoteDto: AddNoteDto) {
    const deal = await this.dealRepository.findOne({ where: { id: dealId } });
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
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
            estimatedCloseDate: new Date(estimatedCloseDate).toLocaleDateString(
              'sk-SK',
            ),
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
            estimatedCloseDate: new Date(estimatedCloseDate).toLocaleDateString(
              'sk-SK',
            ),
          },
        );
      }
    } catch (error) {
      this.logger.error('Failed to send value set email:', error);
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
    deal.actualCloseDate = null!;

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

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDeadlineReminders() {
    this.logger.log('Running deadline reminder cron job...');

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

      this.logger.log(
        `Found ${dealsToRemind.length} deals with deadline in 3 days`,
      );

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
            await this.emailService.sendDealDeadlineReminder(email, name, {
              customerName: deal.customerName,
              dealValue: deal.dealValue,
              estimatedCloseDate: new Date(
                deal.estimatedCloseDate,
              ).toLocaleDateString('sk-SK'),
            });
            this.logger.log(`Sent deadline reminder for deal ${deal.id}`);
          }
        } catch (error) {
          this.logger.error(
            `Failed to send reminder for deal ${deal.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in deadline reminder cron job:', error);
    }
  }

  async getEventsByDeal(
    dealId: string,
    specialistId: string,
  ): Promise<LeadEvent[]> {
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
    // 1. Status distribution via SQL aggregation
    const statusCounts: Array<{ status: string; count: string }> =
      await this.dealRepository
        .createQueryBuilder('deal')
        .select('deal.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('deal.specialistId = :specialistId', { specialistId })
        .groupBy('deal.status')
        .getRawMany();

    const statusMap = new Map<string, number>();
    let totalDeals = 0;
    for (const row of statusCounts) {
      const c = Number(row.count);
      statusMap.set(row.status, c);
      totalDeals += c;
    }

    const closedWon = statusMap.get(DealStatus.CLOSED_WON) || 0;
    const closedLost = statusMap.get(DealStatus.CLOSED_LOST) || 0;
    const closedDeals = closedWon + closedLost;

    const statusDistribution = Object.values(DealStatus).map((status) => ({
      status,
      count: statusMap.get(status) || 0,
    }));

    // 2. Aggregate values via SQL
    const aggregates = await this.dealRepository
      .createQueryBuilder('deal')
      .select(
        'AVG(CASE WHEN deal.dealValue > 0 THEN deal.dealValue ELSE NULL END)',
        'avgValue',
      )
      .addSelect(
        `AVG(CASE WHEN deal.status = :wonStatus AND deal."actualCloseDate" IS NOT NULL THEN EXTRACT(EPOCH FROM (deal."actualCloseDate" - deal."createdAt")) / 86400 ELSE NULL END)`,
        'avgDaysToClose',
      )
      .where('deal.specialistId = :specialistId', { specialistId })
      .setParameter('wonStatus', DealStatus.CLOSED_WON)
      .getRawOne();

    const averageDealValue = aggregates?.avgValue
      ? Math.round(Number(aggregates.avgValue) * 100) / 100
      : 0;
    const averageTimeToClose = aggregates?.avgDaysToClose
      ? Math.round(Number(aggregates.avgDaysToClose))
      : 0;

    // 3. Conversion / win rate
    const conversionRate =
      closedDeals > 0
        ? Math.round((closedWon / closedDeals) * 1000) / 10
        : 0;
    const winRate = conversionRate;

    // 4. Monthly trend (last 6 months) via SQL
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyRaw: Array<{
      m: string;
      y: string;
      status: string;
      cnt: string;
    }> = await this.dealRepository
      .createQueryBuilder('deal')
      .select(`EXTRACT(MONTH FROM deal."actualCloseDate")::int`, 'm')
      .addSelect(`EXTRACT(YEAR FROM deal."actualCloseDate")::int`, 'y')
      .addSelect('deal.status', 'status')
      .addSelect('COUNT(*)', 'cnt')
      .where('deal.specialistId = :specialistId', { specialistId })
      .andWhere(`deal."actualCloseDate" >= :since`, { since: sixMonthsAgo })
      .andWhere('deal.status IN (:...statuses)', {
        statuses: [DealStatus.CLOSED_WON, DealStatus.CLOSED_LOST],
      })
      .groupBy('y')
      .addGroupBy('m')
      .addGroupBy('deal.status')
      .getRawMany();

    const monthlyTrend: Array<{ month: string; won: number; lost: number }> =
      [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthNum = monthDate.getMonth() + 1;
      const yearNum = monthDate.getFullYear();
      const monthName = monthDate.toLocaleDateString('sk-SK', {
        month: 'short',
        year: 'numeric',
      });

      const won = Number(
        monthlyRaw.find(
          (r) =>
            Number(r.m) === monthNum &&
            Number(r.y) === yearNum &&
            r.status === DealStatus.CLOSED_WON,
        )?.cnt || 0,
      );
      const lost = Number(
        monthlyRaw.find(
          (r) =>
            Number(r.m) === monthNum &&
            Number(r.y) === yearNum &&
            r.status === DealStatus.CLOSED_LOST,
        )?.cnt || 0,
      );

      monthlyTrend.push({ month: monthName, won, lost });
    }

    return {
      conversionRate,
      averageDealValue,
      averageTimeToClose,
      winRate,
      statusDistribution,
      monthlyTrend,
    };
  }
}

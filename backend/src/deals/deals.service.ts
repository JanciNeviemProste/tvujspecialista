import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as Sentry from '@sentry/nestjs';
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
import { CrmService } from '../crm/crm.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

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
    private crmService: CrmService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createDealDto: CreateDealDto) {
    // Honeypot check — bots fill this hidden field, humans leave it empty
    if (createDealDto.website) {
      this.logger.warn('Honeypot triggered — likely bot submission');
      // Return fake success to not alert the bot
      return { id: crypto.randomUUID(), status: 'new' };
    }

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

    await this.specialistRepository
      .createQueryBuilder()
      .update()
      .set({ leadsThisMonth: () => '"leadsThisMonth" + 1' })
      .where('id = :id', { id: specialist.id })
      .execute();

    try {
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
    } catch (error) {
      this.logger.error(
        `Failed to send deal creation emails for deal ${savedDeal.id}, specialist ${specialist.id}:`,
        error,
      );
      Sentry.captureException(error, {
        tags: { module: 'deals', operation: 'create-email' },
        extra: {
          dealId: savedDeal.id,
          specialistId: specialist.id,
          customerEmail: createDealDto.customerEmail,
        },
      });
      // Don't block deal creation if email fails
    }

    // Real-time notification
    const specialistWithUser = await this.specialistRepository.findOne({
      where: { id: savedDeal.specialistId },
      relations: ['user'],
    });
    if (specialistWithUser?.user) {
      this.notificationsGateway.notifyUser(specialistWithUser.user.id, 'new_lead', {
        id: savedDeal.id,
        customerName: savedDeal.customerName,
        message: savedDeal.message?.substring(0, 100),
        createdAt: savedDeal.createdAt,
      });
    }

    return savedDeal;
  }

  async findBySpecialist(specialistId: string) {
    const deals = await this.dealRepository.find({
      where: { specialistId },
      order: { createdAt: 'DESC' },
    });
    return deals
      .map((deal) => this.normalizeDealNotes(deal))
      .map((deal) => this.maskContactIfNew(deal));
  }

  async findOne(dealId: string, specialistId: string): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: ['specialist'],
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.specialistId !== specialistId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.maskContactIfNew(this.normalizeDealNotes(deal));
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

    const queryRunner = this.dealRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let committed = false;
    try {
      // CRM gate: if NEW -> CONTACTED, push to CRM first
      if (
        oldStatus === DealStatus.NEW &&
        updateDto.status === DealStatus.CONTACTED
      ) {
        const crmResult = await this.crmService.pushLeadToCrm(deal, specialist);

        if (!crmResult.success) {
          await queryRunner.manager.save(LeadEvent, {
            leadId: dealId,
            type: LeadEventType.CRM_PUSH_FAILED,
            data: { error: crmResult.error, provider: crmResult.provider },
          });

          deal.crmPushError = crmResult.error || 'CRM push failed';
          await queryRunner.manager.save(Deal, deal);

          await queryRunner.commitTransaction();
          committed = true;
          throw new BadRequestException(
            `CRM push failed: ${crmResult.error || 'Unknown error'}`,
          );
        }

        deal.crmExternalId = crmResult.externalId ?? null;
        deal.crmPushedAt = new Date();
        deal.crmPushError = null;

        await queryRunner.manager.save(LeadEvent, {
          leadId: dealId,
          type: LeadEventType.CRM_PUSHED,
          data: {
            provider: crmResult.provider,
            externalId: crmResult.externalId,
          },
        });
      }

      deal.status = updateDto.status;
      await queryRunner.manager.save(Deal, deal);

      await queryRunner.manager.save(LeadEvent, {
        leadId: dealId,
        type: LeadEventType.STATUS_CHANGED,
        data: { oldStatus, newStatus: updateDto.status },
      });

      await queryRunner.commitTransaction();
      committed = true;
    } catch (error) {
      if (!committed) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }

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
      this.logger.error(
        `Failed to send status change email for deal ${dealId}, specialist ${specialist.id}:`,
        error,
      );
      Sentry.captureException(error, {
        tags: { module: 'deals', operation: 'status-change-email' },
        extra: { dealId, specialistId: specialist.id, oldStatus, newStatus: updateDto.status },
      });
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

    const noteObj = {
      id: crypto.randomUUID(),
      content: addNoteDto.note,
      createdAt: new Date().toISOString(),
      author: { name: specialist.name },
    };
    deal.notes = [...(Array.isArray(deal.notes) ? deal.notes : []), noteObj];
    await this.dealRepository.save(deal);

    await this.leadEventRepository.save({
      leadId: dealId,
      type: LeadEventType.NOTE_ADDED,
      data: { note: addNoteDto.note },
    });

    return this.normalizeDealNotes(deal);
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

  /**
   * Mask email and phone for NEW status deals so the specialist
   * can only see them after moving the deal to CONTACTED ("Akceptovaný").
   */
  private maskContactIfNew(deal: Deal): Deal {
    if (deal.status !== DealStatus.NEW) return deal;

    if (deal.customerEmail) {
      const [local, domain] = deal.customerEmail.split('@');
      deal.customerEmail =
        local[0] + '***@' + (domain ? domain[0] + '***.' + domain.split('.').pop() : '***');
    }

    if (deal.customerPhone) {
      const digits = deal.customerPhone.replace(/\D/g, '');
      deal.customerPhone =
        deal.customerPhone.slice(0, 4) +
        ' ' +
        '*'.repeat(Math.max(digits.length - 5, 3)) +
        ' ' +
        deal.customerPhone.slice(-2);
    }

    if (deal.customerName) {
      const name = deal.customerName.trim();
      let parts = name.split(/\s+/);
      if (parts.length === 1 && name.length > 1) {
        const camelSplit = name.split(/(?<=[a-záčďéěíňóřšťúůýž])(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/);
        if (camelSplit.length > 1) parts = camelSplit;
      }
      if (parts.length > 1) {
        deal.customerName =
          parts[0] +
          ' ' +
          parts
            .slice(1)
            .map((p) => (p.length > 0 ? p[0] + '***' : ''))
            .join(' ');
      } else {
        deal.customerName = name.slice(0, 2) + '***';
      }
    }

    return deal;
  }

  /**
   * Normalize deal notes: convert old string[] format to DealNote[] objects.
   * Handles backward compatibility for deals created before the jsonb migration.
   */
  private normalizeDealNotes(deal: Deal): Deal {
    if (!deal.notes || !Array.isArray(deal.notes)) {
      deal.notes = [];
      return deal;
    }

    deal.notes = deal.notes.map((note: unknown) => {
      if (typeof note === 'string') {
        return {
          id: `legacy-${crypto.randomUUID()}`,
          content: note,
          createdAt: deal.createdAt
            ? deal.createdAt.toISOString()
            : new Date().toISOString(),
          author: { name: 'System' },
        };
      }
      return note as {
        id: string;
        content: string;
        createdAt: string;
        author: { name: string };
      };
    });

    return deal;
  }
}

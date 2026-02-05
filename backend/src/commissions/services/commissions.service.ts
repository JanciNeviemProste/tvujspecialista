import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission, CommissionStatus } from '../../database/entities/commission.entity';
import { Deal, DealStatus } from '../../database/entities/deal.entity';
import { Specialist } from '../../database/entities/specialist.entity';
import { StripeService } from '../../stripe/stripe.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    private stripeService: StripeService,
    private emailService: EmailService,
  ) {}

  async createCommission(
    dealId: string,
    specialistId: string,
    dealValue: number,
  ): Promise<Commission> {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const commissionRate = specialist.commissionRate || 0.15;
    const commissionAmount = dealValue * commissionRate;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days

    const commission = this.commissionRepository.create({
      dealId,
      specialistId,
      dealValue,
      commissionRate,
      commissionAmount,
      status: CommissionStatus.PENDING,
      calculatedAt: new Date(),
      dueDate,
    });

    const savedCommission = await this.commissionRepository.save(commission);

    // Update deal with commission ID
    await this.dealRepository.update(dealId, {
      commissionId: savedCommission.id,
    });

    // Send notification email
    await this.emailService.sendCommissionNotification(
      specialist.email,
      specialist.name,
      dealValue,
      commissionAmount,
    );

    return savedCommission;
  }

  async payCommission(
    commissionId: string,
    specialistId: string,
  ): Promise<{ clientSecret: string }> {
    const commission = await this.commissionRepository.findOne({
      where: { id: commissionId, specialistId },
      relations: ['specialist', 'deal'],
    });

    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    if (commission.status !== CommissionStatus.PENDING) {
      throw new BadRequestException('Commission already paid or invoiced');
    }

    // Create Stripe Payment Intent
    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: Math.round(Number(commission.commissionAmount) * 100),
      currency: 'czk',
      metadata: {
        commissionId: commission.id,
        dealId: commission.dealId,
        specialistId,
      },
    });

    commission.stripePaymentIntentId = paymentIntent.id;
    commission.status = CommissionStatus.INVOICED;
    commission.invoicedAt = new Date();
    await this.commissionRepository.save(commission);

    return { clientSecret: paymentIntent.client_secret };
  }

  async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    const commission = await this.commissionRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      relations: ['specialist'],
    });

    if (!commission) return;

    commission.status = CommissionStatus.PAID;
    commission.paidAt = new Date();
    await this.commissionRepository.save(commission);

    // Update specialist total commissions
    await this.specialistRepository.increment(
      { id: commission.specialistId },
      'totalCommissionPaid',
      Number(commission.commissionAmount),
    );

    const specialist = await this.specialistRepository.findOne({
      where: { id: commission.specialistId },
    });

    // Send receipt email
    if (specialist) {
      await this.emailService.sendCommissionReceipt(
        specialist.email,
        specialist.name,
        Number(commission.commissionAmount),
        commission.id,
      );
    }
  }

  async getMyCommissions(specialistId: string): Promise<Commission[]> {
    return this.commissionRepository.find({
      where: { specialistId },
      relations: ['deal'],
      order: { calculatedAt: 'DESC' },
    });
  }

  async getCommissionStats(specialistId: string) {
    const commissions = await this.getMyCommissions(specialistId);

    const pending = commissions.filter((c) => c.status === CommissionStatus.PENDING);
    const paid = commissions.filter((c) => c.status === CommissionStatus.PAID);

    return {
      pending,
      paid,
      totalPending: pending.reduce((sum, c) => sum + Number(c.commissionAmount), 0),
      totalPaid: paid.reduce((sum, c) => sum + Number(c.commissionAmount), 0),
      totalCommissions: commissions.length,
      averageCommission:
        commissions.length > 0
          ? commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0) /
            commissions.length
          : 0,
    };
  }

  async getAllPending(): Promise<Commission[]> {
    return this.commissionRepository.find({
      where: { status: CommissionStatus.PENDING },
      relations: ['specialist', 'deal'],
      order: { dueDate: 'ASC' },
    });
  }

  async waiveCommission(commissionId: string, adminNote?: string): Promise<Commission> {
    const commission = await this.commissionRepository.findOne({
      where: { id: commissionId },
    });

    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    commission.status = CommissionStatus.WAIVED;
    commission.notes = adminNote || 'Waived by admin';

    return this.commissionRepository.save(commission);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Stripe from 'stripe';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { Specialist, SubscriptionTier } from '../database/entities/specialist.entity';
import { Commission, CommissionStatus } from '../database/entities/commission.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {
    const apiKey = this.configService.get('STRIPE_SECRET_KEY');
    if (apiKey && apiKey !== 'sk_test_xxxxxxxxxxxxx') {
      this.stripe = new Stripe(apiKey, { apiVersion: '2025-02-24.acacia' });
    }
  }

  async createCheckoutSession(userId: string, createCheckoutDto: CreateCheckoutDto) {
    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist) {
      throw new Error('Specialist not found');
    }

    let subscription = await this.subscriptionRepository.findOne({
      where: { specialistId: specialist.id },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: specialist.email,
        metadata: { specialistId: specialist.id, userId },
      });
      customerId = customer.id;
    }

    const priceIds = {
      [SubscriptionTier.BASIC]: this.configService.get('STRIPE_BASIC_PRICE_ID'),
      [SubscriptionTier.PRO]: this.configService.get('STRIPE_PRO_PRICE_ID'),
      [SubscriptionTier.PREMIUM]: this.configService.get('STRIPE_PREMIUM_PRICE_ID'),
    };

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[createCheckoutDto.tier],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/profi/dashboard?payment=success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/ceny?payment=cancel`,
      metadata: {
        specialistId: specialist.id,
        userId,
        tier: createCheckoutDto.tier,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, body: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        await this.handleCommissionWebhook(event);
        break;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as any;
    const { userId, specialistId, tier, subscriptionType } = metadata;

    // Get subscription details from Stripe
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string
    );

    let subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    if (!subscription) {
      subscription = this.subscriptionRepository.create({
        userId,
        specialistId: specialistId || null,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripeSubscriptionItemId: stripeSubscription.items.data[0].id,
        tier: tier as SubscriptionTier,
        subscriptionType: subscriptionType || 'marketplace',
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      });
    } else {
      subscription.stripeSubscriptionId = session.subscription as string;
      subscription.stripeSubscriptionItemId = stripeSubscription.items.data[0].id;
      subscription.tier = tier as SubscriptionTier;
      subscription.subscriptionType = subscriptionType || subscription.subscriptionType;
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    }

    await this.subscriptionRepository.save(subscription);

    // Update specialist tier if exists
    if (specialistId) {
      await this.specialistRepository.update(specialistId, {
        subscriptionTier: tier as SubscriptionTier,
      });
    }
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      subscription.status = stripeSubscription.status as SubscriptionStatus;
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

      // Handle scheduled downgrade
      if (subscription.scheduledDowngradeTo && stripeSubscription.status === 'active') {
        subscription.subscriptionType = subscription.scheduledDowngradeTo;
        subscription.scheduledDowngradeTo = null as any;
      }

      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELED;
      subscription.canceledAt = new Date();
      await this.subscriptionRepository.save(subscription);

      await this.specialistRepository.update(subscription.specialistId, {
        subscriptionTier: SubscriptionTier.BASIC,
      });
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.PAST_DUE;
      await this.subscriptionRepository.save(subscription);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    const expiredSubscriptions = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.currentPeriodEnd < :now', { now: new Date() })
      .andWhere('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .getMany();

    for (const subscription of expiredSubscriptions) {
      await this.specialistRepository.update(subscription.specialistId, {
        subscriptionTier: SubscriptionTier.BASIC,
      });
    }
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    metadata: any;
  }): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async handleCommissionWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.metadata.commissionId) {
          await this.handleCommissionPaymentSuccess(paymentIntent.id);
        }
        break;
      case 'payment_intent.payment_failed':
        console.error('Commission payment failed:', event.data.object);
        break;
    }
  }

  private async handleCommissionPaymentSuccess(paymentIntentId: string): Promise<void> {
    const commission = await this.commissionRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
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

    console.log('Commission payment processed successfully:', commission.id);
  }
}

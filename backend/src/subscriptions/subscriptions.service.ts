import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  Subscription,
  SubscriptionType,
  SubscriptionStatus,
} from '../database/entities/subscription.entity';
import {
  User,
  SubscriptionType as UserSubscriptionType,
} from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (apiKey && apiKey !== 'sk_test_xxxxxxxxxxxxx') {
      this.stripe = new Stripe(apiKey, { apiVersion: '2025-02-24.acacia' });
    }
  }

  async createEducationCheckout(
    userId: string,
  ): Promise<{ sessionId: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for existing subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.configService.get('STRIPE_EDUCATION_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/my-account/subscription?payment=success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing?payment=cancel`,
      metadata: {
        userId,
        subscriptionType: SubscriptionType.EDUCATION,
      },
    });

    return { sessionId: session.id };
  }

  async createMarketplaceCheckout(
    userId: string,
  ): Promise<{ sessionId: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist) {
      throw new BadRequestException(
        'Marketplace subscription requires a specialist account',
      );
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId, specialistId: specialist.id },
      });
      customerId = customer.id;
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.configService.get('STRIPE_MARKETPLACE_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/profi/dashboard?payment=success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing?payment=cancel`,
      metadata: {
        userId,
        specialistId: specialist.id,
        subscriptionType: SubscriptionType.MARKETPLACE,
      },
    });

    return { sessionId: session.id };
  }

  async createPremiumCheckout(userId: string): Promise<{ sessionId: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });

    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId, specialistId: specialist?.id },
      });
      customerId = customer.id;
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.configService.get('STRIPE_PREMIUM_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/my-account/subscription?payment=success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing?payment=cancel`,
      metadata: {
        userId,
        specialistId: specialist?.id,
        subscriptionType: SubscriptionType.PREMIUM,
      },
    });

    return { sessionId: session.id };
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async upgradeSubscription(
    userId: string,
    newType: SubscriptionType,
  ): Promise<Subscription> {
    const subscription = await this.findActiveByUserId(userId);

    if (!subscription) {
      throw new BadRequestException('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new BadRequestException('Invalid subscription state');
    }

    // Get current Stripe subscription
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );

    // Update Stripe subscription with proration
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: this.getPriceId(newType),
        },
      ],
      proration_behavior: 'create_prorations',
    });

    subscription.subscriptionType = newType;
    subscription.scheduledDowngradeTo = null!;

    // Update user subscription type
    await this.userRepository.update(userId, {
      subscriptionType: newType as unknown as UserSubscriptionType,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async downgradeSubscription(
    userId: string,
    newType: SubscriptionType,
  ): Promise<Subscription> {
    const subscription = await this.findActiveByUserId(userId);

    if (!subscription) {
      throw new BadRequestException('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new BadRequestException('Invalid subscription state');
    }

    // Get current Stripe subscription
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );

    // Schedule change for end of billing period
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: this.getPriceId(newType),
        },
      ],
      proration_behavior: 'none',
      billing_cycle_anchor: 'unchanged',
    });

    subscription.scheduledDowngradeTo = newType;

    return this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new BadRequestException('Invalid subscription state');
    }

    // Cancel at period end in Stripe
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.canceledAt = new Date();

    return this.subscriptionRepository.save(subscription);
  }

  async resumeSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new BadRequestException('Invalid subscription state');
    }

    // Resume subscription in Stripe
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    subscription.canceledAt = null!;

    return this.subscriptionRepository.save(subscription);
  }

  async getCustomerPortalUrl(userId: string): Promise<{ url: string }> {
    const subscription = await this.findActiveByUserId(userId);

    if (!subscription || !subscription.stripeCustomerId) {
      throw new BadRequestException('No active subscription found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.configService.get('FRONTEND_URL')}/my-account/subscription`,
    });

    return { url: session.url };
  }

  private getPriceId(type: SubscriptionType): string {
    switch (type) {
      case SubscriptionType.EDUCATION:
        return this.configService.get('STRIPE_EDUCATION_PRICE_ID')!;
      case SubscriptionType.MARKETPLACE:
        return this.configService.get('STRIPE_MARKETPLACE_PRICE_ID')!;
      case SubscriptionType.PREMIUM:
        return this.configService.get('STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID')!;
      default:
        throw new BadRequestException('Invalid subscription type');
    }
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionType } from '../../database/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../../database/entities/subscription.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Get active subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (!subscription) {
      throw new ForbiddenException('Active subscription required');
    }

    // Check subscription type based on route path
    const path = request.route?.path || request.url;

    // Academy routes require EDUCATION or PREMIUM
    if (path.includes('/academy') || path.includes('/courses')) {
      if (
        subscription.subscriptionType !== SubscriptionType.EDUCATION &&
        subscription.subscriptionType !== SubscriptionType.PREMIUM
      ) {
        throw new ForbiddenException(
          'Access to Academy requires an Education or Premium subscription',
        );
      }
    }

    // Deals/Commissions routes require MARKETPLACE or PREMIUM
    if (path.includes('/deals') || path.includes('/commissions')) {
      if (
        subscription.subscriptionType !== SubscriptionType.MARKETPLACE &&
        subscription.subscriptionType !== SubscriptionType.PREMIUM
      ) {
        throw new ForbiddenException(
          'Access to Marketplace features requires a Marketplace or Premium subscription',
        );
      }
    }

    // Check subscription expiration
    if (subscription.currentPeriodEnd) {
      const now = new Date();
      if (subscription.currentPeriodEnd < now) {
        throw new ForbiddenException('Your subscription has expired. Please renew to continue.');
      }
    }

    return true;
  }
}


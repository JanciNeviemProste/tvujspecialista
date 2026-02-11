import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  Subscription,
  SubscriptionType,
  SubscriptionStatus,
} from '../database/entities/subscription.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: jest.Mocked<SubscriptionsService>;

  const mockSubscription = {
    id: 'sub-123',
    userId: 'user-123',
    specialistId: 'specialist-123',
    stripeCustomerId: 'cus_123',
    stripeSubscriptionId: 'sub_stripe_123',
    subscriptionType: SubscriptionType.MARKETPLACE,
    status: SubscriptionStatus.ACTIVE,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    canceledAt: null,
    scheduledDowngradeTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Subscription;

  const mockRequest = {
    user: {
      userId: 'user-123',
      email: 'john@example.com',
      role: 'specialist',
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            createEducationCheckout: jest.fn(),
            createMarketplaceCheckout: jest.fn(),
            createPremiumCheckout: jest.fn(),
            findByUserId: jest.fn(),
            findActiveByUserId: jest.fn(),
            upgradeSubscription: jest.fn(),
            downgradeSubscription: jest.fn(),
            cancelSubscription: jest.fn(),
            resumeSubscription: jest.fn(),
            getCustomerPortalUrl: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEducationCheckout', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.createEducationCheckout,
      );
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
    });

    it('should create education checkout session', async () => {
      const checkoutResult = { sessionId: 'cs_123' };
      service.createEducationCheckout.mockResolvedValue(checkoutResult);

      const result = await controller.createEducationCheckout(mockRequest);

      expect(result).toEqual(checkoutResult);
      expect(service.createEducationCheckout).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException if user not found', async () => {
      service.createEducationCheckout.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.createEducationCheckout(mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMarketplaceCheckout', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.createMarketplaceCheckout,
      );
      expect(guards).toBeDefined();
    });

    it('should create marketplace checkout session', async () => {
      const checkoutResult = { sessionId: 'cs_456' };
      service.createMarketplaceCheckout.mockResolvedValue(checkoutResult);

      const result = await controller.createMarketplaceCheckout(mockRequest);

      expect(result).toEqual(checkoutResult);
      expect(service.createMarketplaceCheckout).toHaveBeenCalledWith(
        'user-123',
      );
    });

    it('should throw BadRequestException if not a specialist', async () => {
      service.createMarketplaceCheckout.mockRejectedValue(
        new BadRequestException(
          'Marketplace subscription requires a specialist account',
        ),
      );

      await expect(
        controller.createMarketplaceCheckout(mockRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createPremiumCheckout', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.createPremiumCheckout,
      );
      expect(guards).toBeDefined();
    });

    it('should create premium checkout session', async () => {
      const checkoutResult = { sessionId: 'cs_789' };
      service.createPremiumCheckout.mockResolvedValue(checkoutResult);

      const result = await controller.createPremiumCheckout(mockRequest);

      expect(result).toEqual(checkoutResult);
      expect(service.createPremiumCheckout).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getMySubscriptions', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getMySubscriptions,
      );
      expect(guards).toBeDefined();
    });

    it('should return user subscriptions', async () => {
      const subscriptions = [mockSubscription];
      service.findByUserId.mockResolvedValue(subscriptions);

      const result = await controller.getMySubscriptions(mockRequest);

      expect(result).toEqual(subscriptions);
      expect(service.findByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array when no subscriptions', async () => {
      service.findByUserId.mockResolvedValue([]);

      const result = await controller.getMySubscriptions(mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('getMyActiveSubscription', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getMyActiveSubscription,
      );
      expect(guards).toBeDefined();
    });

    it('should return active subscription', async () => {
      service.findActiveByUserId.mockResolvedValue(mockSubscription);

      const result = await controller.getMyActiveSubscription(mockRequest);

      expect(result).toEqual(mockSubscription);
      expect(service.findActiveByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should return null if no active subscription', async () => {
      service.findActiveByUserId.mockResolvedValue(null);

      const result = await controller.getMyActiveSubscription(mockRequest);

      expect(result).toBeNull();
    });
  });

  describe('upgrade', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.upgrade);
      expect(guards).toBeDefined();
    });

    it('should upgrade subscription', async () => {
      const upgradedSub = {
        ...mockSubscription,
        subscriptionType: SubscriptionType.PREMIUM,
      } as unknown as Subscription;
      service.upgradeSubscription.mockResolvedValue(upgradedSub);

      const result = await controller.upgrade(mockRequest, 'sub-123', {
        newType: SubscriptionType.PREMIUM,
      });

      expect(result).toEqual(upgradedSub);
      expect(service.upgradeSubscription).toHaveBeenCalledWith(
        'user-123',
        SubscriptionType.PREMIUM,
      );
    });

    it('should throw BadRequestException if no active subscription', async () => {
      service.upgradeSubscription.mockRejectedValue(
        new BadRequestException('No active subscription found'),
      );

      await expect(
        controller.upgrade(mockRequest, 'sub-123', {
          newType: SubscriptionType.PREMIUM,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('downgrade', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.downgrade);
      expect(guards).toBeDefined();
    });

    it('should schedule downgrade', async () => {
      const downgradedSub = {
        ...mockSubscription,
        scheduledDowngradeTo: SubscriptionType.EDUCATION,
      } as unknown as Subscription;
      service.downgradeSubscription.mockResolvedValue(downgradedSub);

      const result = await controller.downgrade(mockRequest, 'sub-123', {
        newType: SubscriptionType.EDUCATION,
      });

      expect(result).toEqual(downgradedSub);
      expect(service.downgradeSubscription).toHaveBeenCalledWith(
        'user-123',
        SubscriptionType.EDUCATION,
      );
    });
  });

  describe('cancel', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.cancel);
      expect(guards).toBeDefined();
    });

    it('should cancel subscription', async () => {
      const canceledSub = {
        ...mockSubscription,
        canceledAt: new Date(),
      } as unknown as Subscription;
      service.cancelSubscription.mockResolvedValue(canceledSub);

      const result = await controller.cancel(mockRequest, 'sub-123');

      expect(result).toEqual(canceledSub);
      expect(service.cancelSubscription).toHaveBeenCalledWith(
        'user-123',
        'sub-123',
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      service.cancelSubscription.mockRejectedValue(
        new NotFoundException('Subscription not found'),
      );

      await expect(
        controller.cancel(mockRequest, 'invalid-sub'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resume', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.resume);
      expect(guards).toBeDefined();
    });

    it('should resume subscription', async () => {
      const resumedSub = {
        ...mockSubscription,
        canceledAt: null,
      } as unknown as Subscription;
      service.resumeSubscription.mockResolvedValue(resumedSub);

      const result = await controller.resume(mockRequest, 'sub-123');

      expect(result).toEqual(resumedSub);
      expect(service.resumeSubscription).toHaveBeenCalledWith(
        'user-123',
        'sub-123',
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      service.resumeSubscription.mockRejectedValue(
        new NotFoundException('Subscription not found'),
      );

      await expect(
        controller.resume(mockRequest, 'invalid-sub'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCustomerPortal', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getCustomerPortal,
      );
      expect(guards).toBeDefined();
    });

    it('should return customer portal URL', async () => {
      const portalResult = {
        url: 'https://billing.stripe.com/session/123',
      };
      service.getCustomerPortalUrl.mockResolvedValue(portalResult);

      const result = await controller.getCustomerPortal(mockRequest);

      expect(result).toEqual(portalResult);
      expect(service.getCustomerPortalUrl).toHaveBeenCalledWith('user-123');
    });

    it('should throw BadRequestException if no active subscription', async () => {
      service.getCustomerPortalUrl.mockRejectedValue(
        new BadRequestException('No active subscription found'),
      );

      await expect(
        controller.getCustomerPortal(mockRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Guard Integration', () => {
    it('should apply JwtAuthGuard to all endpoints', () => {
      const methods = [
        'createEducationCheckout',
        'createMarketplaceCheckout',
        'createPremiumCheckout',
        'getMySubscriptions',
        'getMyActiveSubscription',
        'upgrade',
        'downgrade',
        'cancel',
        'resume',
        'getCustomerPortal',
      ];

      methods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          (controller as unknown as Record<string, Function>)[method],
        );
        expect(guards).toBeDefined();
        const guardNames = guards.map(
          (guard: { name: string }) => guard.name,
        );
        expect(guardNames).toContain('JwtAuthGuard');
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate service errors', async () => {
      service.createEducationCheckout.mockRejectedValue(
        new Error('Stripe error'),
      );

      await expect(
        controller.createEducationCheckout(mockRequest),
      ).rejects.toThrow('Stripe error');
    });
  });
});

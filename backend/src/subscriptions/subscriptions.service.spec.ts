import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  Subscription,
  SubscriptionType,
  SubscriptionStatus,
} from '../database/entities/subscription.entity';
import { User } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let subscriptionRepository: jest.Mocked<Repository<Subscription>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let mockStripe: {
    customers: { create: jest.Mock };
    checkout: { sessions: { create: jest.Mock } };
    subscriptions: { retrieve: jest.Mock; update: jest.Mock };
    billingPortal: { sessions: { create: jest.Mock } };
  };

  const mockUser = {
    id: 'user-123',
    email: 'john@example.com',
    name: 'John Doe',
  } as User;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    email: 'john@example.com',
    name: 'John Specialist',
  } as Specialist;

  const mockSubscription = {
    id: 'sub-123',
    userId: 'user-123',
    specialistId: 'specialist-123',
    stripeCustomerId: 'cus_123',
    stripeSubscriptionId: 'sub_stripe_123',
    stripeSubscriptionItemId: 'si_123',
    subscriptionType: SubscriptionType.MARKETPLACE,
    status: SubscriptionStatus.ACTIVE,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    canceledAt: null,
    scheduledDowngradeTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Subscription;

  beforeEach(async () => {
    mockStripe = {
      customers: {
        create: jest.fn().mockResolvedValue({ id: 'cus_new_123' }),
      },
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            id: 'cs_123',
            url: 'https://checkout.stripe.com/session/123',
          }),
        },
      },
      subscriptions: {
        retrieve: jest.fn().mockResolvedValue({
          id: 'sub_stripe_123',
          items: {
            data: [{ id: 'si_123' }],
          },
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      billingPortal: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            url: 'https://billing.stripe.com/session/123',
          }),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                STRIPE_SECRET_KEY: 'sk_test_xxxxxxxxxxxxx',
                STRIPE_EDUCATION_PRICE_ID: 'price_edu_123',
                STRIPE_MARKETPLACE_PRICE_ID: 'price_mkt_123',
                STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID: 'price_prem_123',
                STRIPE_PREMIUM_PRICE_ID: 'price_prem_123',
                FRONTEND_URL: 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    subscriptionRepository = module.get(getRepositoryToken(Subscription));
    userRepository = module.get(getRepositoryToken(User));
    specialistRepository = module.get(getRepositoryToken(Specialist));

    // Replace the stripe instance with our mock
    service['stripe'] = mockStripe as unknown as import('stripe').default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEducationCheckout', () => {
    it('should create a checkout session for education subscription', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      subscriptionRepository.findOne.mockResolvedValue(null);

      const result = await service.createEducationCheckout('user-123');

      expect(result).toHaveProperty('sessionId');
      expect(result.sessionId).toBe('cs_123');
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: mockUser.email,
        metadata: { userId: 'user-123' },
      });
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          metadata: expect.objectContaining({
            userId: 'user-123',
            subscriptionType: SubscriptionType.EDUCATION,
          }),
        }),
      );
    });

    it('should use existing customer if available', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      await service.createEducationCheckout('user-123');

      expect(mockStripe.customers.create).not.toHaveBeenCalled();
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_123',
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createEducationCheckout('invalid-user'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createEducationCheckout('invalid-user'),
      ).rejects.toThrow('User not found');
    });

    it('should include correct success and cancel URLs', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      subscriptionRepository.findOne.mockResolvedValue(null);

      await service.createEducationCheckout('user-123');

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url:
            'http://localhost:3000/my-account/subscription?payment=success',
          cancel_url: 'http://localhost:3000/pricing?payment=cancel',
        }),
      );
    });
  });

  describe('createMarketplaceCheckout', () => {
    it('should create a checkout session for marketplace subscription', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);

      const result = await service.createMarketplaceCheckout('user-123');

      expect(result).toHaveProperty('sessionId');
      expect(result.sessionId).toBe('cs_123');
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            subscriptionType: SubscriptionType.MARKETPLACE,
            specialistId: 'specialist-123',
          }),
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createMarketplaceCheckout('invalid-user'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if specialist not found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createMarketplaceCheckout('user-123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createMarketplaceCheckout('user-123'),
      ).rejects.toThrow(
        'Marketplace subscription requires a specialist account',
      );
    });

    it('should include correct success and cancel URLs', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);

      await service.createMarketplaceCheckout('user-123');

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url: 'http://localhost:3000/profi/dashboard?payment=success',
          cancel_url: 'http://localhost:3000/pricing?payment=cancel',
        }),
      );
    });
  });

  describe('createPremiumCheckout', () => {
    it('should create a checkout session for premium subscription', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);

      const result = await service.createPremiumCheckout('user-123');

      expect(result).toHaveProperty('sessionId');
      expect(result.sessionId).toBe('cs_123');
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createPremiumCheckout('invalid-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return subscriptions for a user', async () => {
      const subscriptions = [mockSubscription];
      subscriptionRepository.find.mockResolvedValue(subscriptions);

      const result = await service.findByUserId('user-123');

      expect(result).toEqual(subscriptions);
      expect(subscriptionRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no subscriptions exist', async () => {
      subscriptionRepository.find.mockResolvedValue([]);

      const result = await service.findByUserId('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('findActiveByUserId', () => {
    it('should return active subscription for a user', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      const result = await service.findActiveByUserId('user-123');

      expect(result).toEqual(mockSubscription);
      expect(subscriptionRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: SubscriptionStatus.ACTIVE,
        },
      });
    });

    it('should return null if no active subscription', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      const result = await service.findActiveByUserId('user-123');

      expect(result).toBeNull();
    });
  });

  describe('upgradeSubscription', () => {
    it('should upgrade subscription type', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Subscription),
      );
      userRepository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      const result = await service.upgradeSubscription(
        'user-123',
        SubscriptionType.PREMIUM,
      );

      expect(result.subscriptionType).toBe(SubscriptionType.PREMIUM);
      expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith(
        'sub_stripe_123',
      );
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_stripe_123',
        expect.objectContaining({
          proration_behavior: 'create_prorations',
        }),
      );
    });

    it('should update user subscription type', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Subscription),
      );
      userRepository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.upgradeSubscription('user-123', SubscriptionType.PREMIUM);

      expect(userRepository.update).toHaveBeenCalledWith('user-123', {
        subscriptionType: SubscriptionType.PREMIUM as unknown as string,
      });
    });

    it('should throw BadRequestException if no active subscription', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.upgradeSubscription('user-123', SubscriptionType.PREMIUM),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.upgradeSubscription('user-123', SubscriptionType.PREMIUM),
      ).rejects.toThrow('No active subscription found');
    });

    it('should throw BadRequestException if no stripe subscription id', async () => {
      const subWithoutStripe = {
        ...mockSubscription,
        stripeSubscriptionId: null,
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(subWithoutStripe);

      await expect(
        service.upgradeSubscription('user-123', SubscriptionType.PREMIUM),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.upgradeSubscription('user-123', SubscriptionType.PREMIUM),
      ).rejects.toThrow('Invalid subscription state');
    });
  });

  describe('downgradeSubscription', () => {
    it('should schedule downgrade for end of billing period', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Subscription),
      );

      const result = await service.downgradeSubscription(
        'user-123',
        SubscriptionType.EDUCATION,
      );

      expect(result.scheduledDowngradeTo).toBe(SubscriptionType.EDUCATION);
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_stripe_123',
        expect.objectContaining({
          proration_behavior: 'none',
          billing_cycle_anchor: 'unchanged',
        }),
      );
    });

    it('should throw BadRequestException if no active subscription', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.downgradeSubscription('user-123', SubscriptionType.EDUCATION),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.downgradeSubscription('user-123', SubscriptionType.EDUCATION),
      ).rejects.toThrow('No active subscription found');
    });

    it('should throw BadRequestException if no stripe subscription id', async () => {
      const subWithoutStripe = {
        ...mockSubscription,
        stripeSubscriptionId: null,
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(subWithoutStripe);

      await expect(
        service.downgradeSubscription('user-123', SubscriptionType.EDUCATION),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Subscription),
      );

      const result = await service.cancelSubscription('user-123', 'sub-123');

      expect(result.canceledAt).toBeInstanceOf(Date);
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_stripe_123',
        { cancel_at_period_end: true },
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.cancelSubscription('user-123', 'invalid-sub'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.cancelSubscription('user-123', 'invalid-sub'),
      ).rejects.toThrow('Subscription not found');
    });

    it('should throw BadRequestException if no stripe subscription id', async () => {
      const subWithoutStripe = {
        ...mockSubscription,
        stripeSubscriptionId: null,
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(subWithoutStripe);

      await expect(
        service.cancelSubscription('user-123', 'sub-123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.cancelSubscription('user-123', 'sub-123'),
      ).rejects.toThrow('Invalid subscription state');
    });
  });

  describe('resumeSubscription', () => {
    it('should resume a canceled subscription', async () => {
      const canceledSub = {
        ...mockSubscription,
        canceledAt: new Date(),
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(canceledSub);
      subscriptionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Subscription),
      );

      const result = await service.resumeSubscription('user-123', 'sub-123');

      expect(result.canceledAt).toBeNull();
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_stripe_123',
        { cancel_at_period_end: false },
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resumeSubscription('user-123', 'invalid-sub'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no stripe subscription id', async () => {
      const subWithoutStripe = {
        ...mockSubscription,
        stripeSubscriptionId: null,
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(subWithoutStripe);

      await expect(
        service.resumeSubscription('user-123', 'sub-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCustomerPortalUrl', () => {
    it('should return billing portal URL', async () => {
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      const result = await service.getCustomerPortalUrl('user-123');

      expect(result).toEqual({
        url: 'https://billing.stripe.com/session/123',
      });
      expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: 'http://localhost:3000/my-account/subscription',
      });
    });

    it('should throw BadRequestException if no active subscription', async () => {
      subscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.getCustomerPortalUrl('user-123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getCustomerPortalUrl('user-123')).rejects.toThrow(
        'No active subscription found',
      );
    });

    it('should throw BadRequestException if no stripe customer id', async () => {
      const subWithoutCustomer = {
        ...mockSubscription,
        stripeCustomerId: null,
      } as unknown as Subscription;
      subscriptionRepository.findOne.mockResolvedValue(subWithoutCustomer);

      await expect(service.getCustomerPortalUrl('user-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import {
  Subscription,
  SubscriptionStatus,
} from '../database/entities/subscription.entity';
import {
  Specialist,
  SubscriptionTier,
} from '../database/entities/specialist.entity';
import {
  Commission,
  CommissionStatus,
} from '../database/entities/commission.entity';

describe('StripeService', () => {
  let service: StripeService;
  let configService: jest.Mocked<ConfigService>;
  let subscriptionRepository: jest.Mocked<Repository<Subscription>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let commissionRepository: jest.Mocked<Repository<Commission>>;
  let mockStripe: {
    paymentIntents: { create: jest.Mock };
    webhooks: { constructEvent: jest.Mock };
    checkout: { sessions: { create: jest.Mock } };
    customers: { create: jest.Mock };
    subscriptions: { retrieve: jest.Mock };
  };

  const mockCommission = {
    id: 'commission-123',
    dealId: 'deal-123',
    specialistId: 'specialist-123',
    commissionAmount: 15000,
    stripePaymentIntentId: 'pi_123',
    status: CommissionStatus.PENDING,
  } as Commission;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    email: 'john@example.com',
    totalCommissionPaid: 0,
  } as Specialist;

  beforeEach(async () => {
    // Mock Stripe client
    mockStripe = {
      paymentIntents: {
        create: jest.fn(),
      },
      webhooks: {
        constructEvent: jest.fn(),
      },
      checkout: {
        sessions: {
          create: jest.fn(),
        },
      },
      customers: {
        create: jest.fn(),
      },
      subscriptions: {
        retrieve: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                STRIPE_SECRET_KEY: 'sk_test_valid_key',
                STRIPE_WEBHOOK_SECRET: 'whsec_test_secret',
                STRIPE_BASIC_PRICE_ID: 'price_basic_123',
                STRIPE_PRO_PRICE_ID: 'price_pro_123',
                STRIPE_PREMIUM_PRICE_ID: 'price_premium_123',
                FRONTEND_URL: 'http://localhost:3000',
              };
              return config[key as keyof typeof config];
            }),
          },
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            increment: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Commission),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    configService = module.get(ConfigService);
    subscriptionRepository = module.get(getRepositoryToken(Subscription));
    specialistRepository = module.get(getRepositoryToken(Specialist));
    commissionRepository = module.get(getRepositoryToken(Commission));

    // Replace the stripe instance with our mock
    service['stripe'] = mockStripe as unknown as import('stripe').default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent with correct amount', async () => {
      const mockPaymentIntent = {
        id: 'pi_123',
        client_secret: 'secret_123',
        amount: 1500000,
        currency: 'czk',
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await service.createPaymentIntent({
        amount: 1500000,
        currency: 'czk',
        metadata: { commissionId: 'commission-123' },
      });

      expect(result).toEqual(mockPaymentIntent);
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 1500000,
        currency: 'czk',
        metadata: { commissionId: 'commission-123' },
        automatic_payment_methods: {
          enabled: true,
        },
      });
    });

    it('should include commission metadata', async () => {
      const metadata = {
        commissionId: 'commission-123',
        dealId: 'deal-456',
        specialistId: 'specialist-789',
      };

      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      });

      await service.createPaymentIntent({
        amount: 1500000,
        currency: 'czk',
        metadata,
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata,
        }),
      );
    });

    it('should set currency to czk', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      });

      await service.createPaymentIntent({
        amount: 1500000,
        currency: 'czk',
        metadata: {},
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: 'czk',
        }),
      );
    });

    it('should call Stripe API with correct params', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      });

      await service.createPaymentIntent({
        amount: 1500000,
        currency: 'czk',
        metadata: { commissionId: 'commission-123' },
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 1500000,
        currency: 'czk',
        metadata: { commissionId: 'commission-123' },
        automatic_payment_methods: {
          enabled: true,
        },
      });
    });

    it('should enable automatic payment methods', async () => {
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      });

      await service.createPaymentIntent({
        amount: 1500000,
        currency: 'czk',
        metadata: {},
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          automatic_payment_methods: {
            enabled: true,
          },
        }),
      );
    });
  });

  describe('handleWebhook', () => {
    const mockSignature = 'test_signature';
    const mockBody = Buffer.from('test_body');

    it('should verify webhook signature', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockResolvedValue(mockCommission);
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.handleWebhook(mockSignature, mockBody);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        mockBody,
        mockSignature,
        'whsec_test_secret',
      );
    });

    it('should throw error for invalid signature', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(
        service.handleWebhook('invalid_signature', mockBody),
      ).rejects.toThrow('Webhook signature verification failed');
    });

    it('should handle payment_intent.succeeded event', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockResolvedValue(mockCommission);
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      const result = await service.handleWebhook(mockSignature, mockBody);

      expect(result).toEqual({ received: true });
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await service.handleWebhook(mockSignature, mockBody);

      expect(result).toEqual({ received: true });
    });

    it('should call commission service on success', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockResolvedValue({
        ...mockCommission,
        status: CommissionStatus.PAID,
      });
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.handleWebhook(mockSignature, mockBody);

      expect(commissionRepository.findOne).toHaveBeenCalledWith({
        where: { stripePaymentIntentId: 'pi_123' },
      });
      expect(commissionRepository.save).toHaveBeenCalled();
    });

    it('should update commission status to PAID on success', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Commission),
      );
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.handleWebhook(mockSignature, mockBody);

      expect(commissionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CommissionStatus.PAID,
          paidAt: expect.any(Date),
        }),
      );
    });

    it('should increment specialist total commission paid', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockResolvedValue(mockCommission);
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.handleWebhook(mockSignature, mockBody);

      expect(specialistRepository.increment).toHaveBeenCalledWith(
        { id: 'specialist-123' },
        'totalCommissionPaid',
        15000,
      );
    });
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session for subscription', async () => {
      const mockSession = {
        id: 'cs_123',
        url: 'https://checkout.stripe.com/session/123',
      };

      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);
      mockStripe.customers.create.mockResolvedValue({ id: 'cus_123' });
      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const result = await service.createCheckoutSession('user-123', {
        tier: SubscriptionTier.PRO,
      });

      expect(result).toEqual({ url: mockSession.url });
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
    });

    it('should use correct price ID for tier', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);
      mockStripe.customers.create.mockResolvedValue({ id: 'cus_123' });
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com',
      });

      await service.createCheckoutSession('user-123', {
        tier: SubscriptionTier.PRO,
      });

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [
            {
              price: 'price_pro_123',
              quantity: 1,
            },
          ],
        }),
      );
    });

    it('should include success/cancel URLs', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);
      mockStripe.customers.create.mockResolvedValue({ id: 'cus_123' });
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com',
      });

      await service.createCheckoutSession('user-123', {
        tier: SubscriptionTier.BASIC,
      });

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url: 'http://localhost:3000/profi/dashboard?payment=success',
          cancel_url: 'http://localhost:3000/ceny?payment=cancel',
        }),
      );
    });

    it('should create customer if not exists', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(null);
      mockStripe.customers.create.mockResolvedValue({ id: 'cus_123' });
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com',
      });

      await service.createCheckoutSession('user-123', {
        tier: SubscriptionTier.BASIC,
      });

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'john@example.com',
        metadata: { specialistId: 'specialist-123', userId: 'user-123' },
      });
    });

    it('should use existing customer if available', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripeCustomerId: 'cus_existing',
      } as Subscription;

      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      subscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com',
      });

      await service.createCheckoutSession('user-123', {
        tier: SubscriptionTier.BASIC,
      });

      expect(mockStripe.customers.create).not.toHaveBeenCalled();
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_existing',
        }),
      );
    });
  });

  describe('handleCommissionWebhook', () => {
    it('should handle payment success with commission metadata', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { commissionId: 'commission-123' },
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockResolvedValue(mockCommission);
      specialistRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.handleCommissionWebhook(mockEvent as Stripe.Event);

      expect(commissionRepository.findOne).toHaveBeenCalledWith({
        where: { stripePaymentIntentId: 'pi_123' },
      });
    });

    it('should not process if commission not found', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_invalid',
            metadata: { commissionId: 'invalid' },
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      commissionRepository.findOne.mockResolvedValue(null);

      await service.handleCommissionWebhook(mockEvent as Stripe.Event);

      expect(commissionRepository.save).not.toHaveBeenCalled();
    });

    it('should handle payment without commission metadata', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: {},
          } as Partial<Stripe.PaymentIntent> as Stripe.PaymentIntent,
        },
      };

      await service.handleCommissionWebhook(mockEvent as Stripe.Event);

      expect(commissionRepository.findOne).not.toHaveBeenCalled();
    });
  });
});

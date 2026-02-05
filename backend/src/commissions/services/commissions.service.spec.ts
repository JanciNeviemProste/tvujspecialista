import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { Commission, CommissionStatus } from '../../database/entities/commission.entity';
import { Deal } from '../../database/entities/deal.entity';
import { Specialist } from '../../database/entities/specialist.entity';
import { StripeService } from '../../stripe/stripe.service';
import { EmailService } from '../../email/email.service';

describe('CommissionsService', () => {
  let service: CommissionsService;
  let commissionRepository: jest.Mocked<Repository<Commission>>;
  let dealRepository: jest.Mocked<Repository<Deal>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let stripeService: jest.Mocked<StripeService>;
  let emailService: jest.Mocked<EmailService>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    name: 'John Specialist',
    email: 'john@example.com',
    commissionRate: 0.15,
    totalCommissionPaid: 0,
  } as Specialist;

  const mockDeal = {
    id: 'deal-123',
    title: 'Test Deal',
    value: 100000,
  } as Partial<Deal> as Deal;

  const mockCommission = {
    id: 'commission-123',
    dealId: 'deal-123',
    specialistId: 'specialist-123',
    dealValue: 100000,
    commissionRate: 0.15,
    commissionAmount: 15000,
    status: CommissionStatus.PENDING,
    calculatedAt: new Date('2026-01-01'),
    dueDate: new Date('2026-01-31'),
    deal: mockDeal,
    specialist: mockSpecialist,
  } as Commission;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionsService,
        {
          provide: getRepositoryToken(Commission),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Deal),
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            findOne: jest.fn(),
            increment: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendCommissionNotification: jest.fn(),
            sendCommissionReceipt: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommissionsService>(CommissionsService);
    commissionRepository = module.get(getRepositoryToken(Commission));
    dealRepository = module.get(getRepositoryToken(Deal));
    specialistRepository = module.get(getRepositoryToken(Specialist));
    stripeService = module.get(StripeService);
    emailService = module.get(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCommission', () => {
    it('should create commission for specialist', async () => {
      const dealValue = 100000;
      const expectedAmount = 15000; // 15% of 100000

      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      commissionRepository.create.mockReturnValue(mockCommission);
      commissionRepository.save.mockResolvedValue(mockCommission);
      dealRepository.update.mockResolvedValue({} as any);
      emailService.sendCommissionNotification.mockResolvedValue(undefined);

      const result = await service.createCommission(
        'deal-123',
        'specialist-123',
        dealValue,
      );

      expect(result).toEqual(mockCommission);
      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'specialist-123' },
      });
      expect(commissionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          dealId: 'deal-123',
          specialistId: 'specialist-123',
          dealValue,
          commissionRate: 0.15,
          commissionAmount: expectedAmount,
          status: CommissionStatus.PENDING,
        }),
      );
      expect(emailService.sendCommissionNotification).toHaveBeenCalledWith(
        'john@example.com',
        'John Specialist',
        dealValue,
        expectedAmount,
      );
    });

    it('should throw NotFoundException for non-existent specialist', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createCommission('deal-123', 'invalid-id', 100000),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('payCommission', () => {
    it('should create payment intent for PENDING commission', async () => {
      const mockPaymentIntent = {
        id: 'pi_123',
        client_secret: 'secret_123',
        amount: 1500000, // 15000 CZK in cents
        currency: 'czk',
      };

      commissionRepository.findOne.mockResolvedValue(mockCommission);
      stripeService.createPaymentIntent.mockResolvedValue(mockPaymentIntent as any);
      commissionRepository.save.mockResolvedValue({
        ...mockCommission,
        status: CommissionStatus.INVOICED,
        stripePaymentIntentId: 'pi_123',
      });

      const result = await service.payCommission('commission-123', 'specialist-123');

      expect(result).toEqual({ clientSecret: 'secret_123' });
      expect(commissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'commission-123', specialistId: 'specialist-123' },
        relations: ['specialist', 'deal'],
      });
      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: 1500000, // 15000 * 100
        currency: 'czk',
        metadata: {
          commissionId: 'commission-123',
          dealId: 'deal-123',
          specialistId: 'specialist-123',
        },
      });
    });

    it('should throw NotFoundException for non-existent commission', async () => {
      commissionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.payCommission('invalid-id', 'specialist-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for non-PENDING commission', async () => {
      const paidCommission = {
        ...mockCommission,
        status: CommissionStatus.PAID,
      };
      commissionRepository.findOne.mockResolvedValue(paidCommission);

      await expect(
        service.payCommission('commission-123', 'specialist-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should calculate correct amount with platform fee', async () => {
      const commissionAmount = 15000;
      const expectedStripeAmount = 1500000; // 15000 CZK * 100 cents
      const pendingCommission = { ...mockCommission, status: CommissionStatus.PENDING };

      commissionRepository.findOne.mockResolvedValue(pendingCommission);
      stripeService.createPaymentIntent.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      } as any);
      commissionRepository.save.mockResolvedValue(pendingCommission);

      await service.payCommission('commission-123', 'specialist-123');

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: expectedStripeAmount,
        }),
      );
    });

    it('should include commission metadata in payment intent', async () => {
      const pendingCommission = { ...mockCommission, status: CommissionStatus.PENDING };

      commissionRepository.findOne.mockResolvedValue(pendingCommission);
      stripeService.createPaymentIntent.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
      } as any);
      commissionRepository.save.mockResolvedValue(pendingCommission);

      await service.payCommission('commission-123', 'specialist-123');

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            commissionId: 'commission-123',
            dealId: 'deal-123',
            specialistId: 'specialist-123',
          },
        }),
      );
    });
  });

  describe('handlePaymentSuccess', () => {
    it('should update commission status to PAID', async () => {
      const paymentIntentId = 'pi_123';
      const commission = {
        ...mockCommission,
        stripePaymentIntentId: paymentIntentId,
      };

      commissionRepository.findOne.mockResolvedValue(commission);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      commissionRepository.save.mockResolvedValue({
        ...commission,
        status: CommissionStatus.PAID,
        paidAt: expect.any(Date),
      });
      emailService.sendCommissionReceipt.mockResolvedValue(undefined);

      await service.handlePaymentSuccess(paymentIntentId);

      expect(commissionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CommissionStatus.PAID,
          paidAt: expect.any(Date),
        }),
      );
    });

    it('should record payment date (paidAt)', async () => {
      const paymentIntentId = 'pi_123';
      const commission = {
        ...mockCommission,
        stripePaymentIntentId: paymentIntentId,
      };

      commissionRepository.findOne.mockResolvedValue(commission);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      commissionRepository.save.mockImplementation((entity) => Promise.resolve(entity as Commission));
      emailService.sendCommissionReceipt.mockResolvedValue(undefined);

      await service.handlePaymentSuccess(paymentIntentId);

      expect(commissionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          paidAt: expect.any(Date),
        }),
      );
    });

    it('should send receipt email to specialist', async () => {
      const paymentIntentId = 'pi_123';
      const commission = {
        ...mockCommission,
        stripePaymentIntentId: paymentIntentId,
      };

      commissionRepository.findOne.mockResolvedValue(commission);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      commissionRepository.save.mockResolvedValue(commission);
      emailService.sendCommissionReceipt.mockResolvedValue(undefined);

      await service.handlePaymentSuccess(paymentIntentId);

      expect(specialistRepository.increment).toHaveBeenCalledWith(
        { id: 'specialist-123' },
        'totalCommissionPaid',
        15000,
      );
      expect(emailService.sendCommissionReceipt).toHaveBeenCalledWith(
        'john@example.com',
        'John Specialist',
        15000,
        'commission-123',
      );
    });

    it('should not throw error if commission not found', async () => {
      commissionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.handlePaymentSuccess('invalid-pi'),
      ).resolves.toBeUndefined();
    });

    it('should update specialist total commissions paid', async () => {
      const paymentIntentId = 'pi_123';
      const commission = {
        ...mockCommission,
        stripePaymentIntentId: paymentIntentId,
      };

      commissionRepository.findOne.mockResolvedValue(commission);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      commissionRepository.save.mockResolvedValue(commission);
      emailService.sendCommissionReceipt.mockResolvedValue(undefined);

      await service.handlePaymentSuccess(paymentIntentId);

      expect(specialistRepository.increment).toHaveBeenCalledWith(
        { id: 'specialist-123' },
        'totalCommissionPaid',
        15000,
      );
    });
  });

  describe('getMyCommissions', () => {
    it('should return commissions for specific user', async () => {
      const commissions = [mockCommission];
      commissionRepository.find.mockResolvedValue(commissions);

      const result = await service.getMyCommissions('specialist-123');

      expect(result).toEqual(commissions);
      expect(commissionRepository.find).toHaveBeenCalledWith({
        where: { specialistId: 'specialist-123' },
        relations: ['deal'],
        order: { calculatedAt: 'DESC' },
      });
    });

    it('should include deal relation', async () => {
      commissionRepository.find.mockResolvedValue([mockCommission]);

      await service.getMyCommissions('specialist-123');

      expect(commissionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['deal'],
        }),
      );
    });

    it('should order by calculatedAt DESC', async () => {
      commissionRepository.find.mockResolvedValue([]);

      await service.getMyCommissions('specialist-123');

      expect(commissionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { calculatedAt: 'DESC' },
        }),
      );
    });
  });

  describe('getAllPending', () => {
    it('should return only PENDING commissions', async () => {
      const pendingCommissions = [mockCommission];
      commissionRepository.find.mockResolvedValue(pendingCommissions);

      const result = await service.getAllPending();

      expect(result).toEqual(pendingCommissions);
      expect(commissionRepository.find).toHaveBeenCalledWith({
        where: { status: CommissionStatus.PENDING },
        relations: ['specialist', 'deal'],
        order: { dueDate: 'ASC' },
      });
    });

    it('should include deal and specialist relations', async () => {
      commissionRepository.find.mockResolvedValue([]);

      await service.getAllPending();

      expect(commissionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['specialist', 'deal'],
        }),
      );
    });

    it('should order by dueDate ASC', async () => {
      commissionRepository.find.mockResolvedValue([]);

      await service.getAllPending();

      expect(commissionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { dueDate: 'ASC' },
        }),
      );
    });
  });

  describe('waiveCommission', () => {
    it('should update status to WAIVED', async () => {
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockImplementation((entity) => Promise.resolve(entity as Commission));

      const result = await service.waiveCommission('commission-123', 'Admin approved waiver');

      expect(result.status).toBe(CommissionStatus.WAIVED);
      expect(commissionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CommissionStatus.WAIVED,
        }),
      );
    });

    it('should record waived note', async () => {
      const adminNote = 'Special case - waiving fee';
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockImplementation((entity) => Promise.resolve(entity as Commission));

      const result = await service.waiveCommission('commission-123', adminNote);

      expect(result.notes).toBe(adminNote);
      expect(commissionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: adminNote,
        }),
      );
    });

    it('should use default note if none provided', async () => {
      commissionRepository.findOne.mockResolvedValue(mockCommission);
      commissionRepository.save.mockImplementation((entity) => Promise.resolve(entity as Commission));

      const result = await service.waiveCommission('commission-123');

      expect(result.notes).toBe('Waived by admin');
    });

    it('should throw error if commission not found', async () => {
      commissionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.waiveCommission('invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCommissionStats', () => {
    it('should calculate pending and paid totals', async () => {
      const commissions = [
        { ...mockCommission, status: CommissionStatus.PENDING, commissionAmount: 10000 },
        { ...mockCommission, status: CommissionStatus.PENDING, commissionAmount: 5000 },
        { ...mockCommission, status: CommissionStatus.PAID, commissionAmount: 15000 },
      ] as Commission[];

      commissionRepository.find.mockResolvedValue(commissions);

      const result = await service.getCommissionStats('specialist-123');

      expect(result.totalPending).toBe(15000);
      expect(result.totalPaid).toBe(15000);
      expect(result.totalCommissions).toBe(3);
      expect(result.averageCommission).toBe(10000);
    });

    it('should return correct stats structure', async () => {
      commissionRepository.find.mockResolvedValue([mockCommission]);

      const result = await service.getCommissionStats('specialist-123');

      expect(result).toHaveProperty('pending');
      expect(result).toHaveProperty('paid');
      expect(result).toHaveProperty('totalPending');
      expect(result).toHaveProperty('totalPaid');
      expect(result).toHaveProperty('totalCommissions');
      expect(result).toHaveProperty('averageCommission');
    });
  });
});

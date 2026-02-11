import { Test, TestingModule } from '@nestjs/testing';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadLimitGuard } from '../leads/guards/lead-limit.guard';
import { NotFoundException } from '@nestjs/common';
import { Deal, DealStatus } from '../database/entities/deal.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

describe('DealsController', () => {
  let controller: DealsController;
  let service: jest.Mocked<DealsService>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    name: 'John Specialist',
    email: 'john@example.com',
  } as Specialist;

  const mockDeal = {
    id: 'deal-123',
    specialistId: 'specialist-123',
    customerName: 'Jane Customer',
    customerEmail: 'jane@example.com',
    customerPhone: '+420987654321',
    message: 'I need financial advice',
    status: DealStatus.NEW,
    notes: [],
    gdprConsent: true,
    dealValue: 100000,
    estimatedCloseDate: null,
    actualCloseDate: null,
    commissionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Deal;

  const mockRequest = {
    user: {
      userId: 'user-123',
      email: 'john@example.com',
      role: 'specialist',
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealsController],
      providers: [
        {
          provide: DealsService,
          useValue: {
            create: jest.fn(),
            findSpecialistByUserId: jest.fn(),
            findBySpecialist: jest.fn(),
            updateStatus: jest.fn(),
            updateDealValue: jest.fn(),
            closeDeal: jest.fn(),
            reopenDeal: jest.fn(),
            addNote: jest.fn(),
            getEventsByDeal: jest.fn(),
            getAnalytics: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(LeadLimitGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<DealsController>(DealsController);
    service = module.get(DealsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new deal', async () => {
      const createDto = {
        specialistId: 'specialist-123',
        customerName: 'Jane Customer',
        customerEmail: 'jane@example.com',
        customerPhone: '+420987654321',
        message: 'I need financial advice',
        gdprConsent: true,
      };
      service.create.mockResolvedValue(mockDeal);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockDeal);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should apply LeadLimitGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.create);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('LeadLimitGuard');
    });
  });

  describe('getMyDeals', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getMyDeals);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
    });

    it('should return deals for authenticated specialist', async () => {
      const deals = [mockDeal];
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.findBySpecialist.mockResolvedValue(deals);

      const result = await controller.getMyDeals(mockRequest);

      expect(result).toEqual(deals);
      expect(service.findSpecialistByUserId).toHaveBeenCalledWith('user-123');
      expect(service.findBySpecialist).toHaveBeenCalledWith('specialist-123');
    });

    it('should throw NotFoundException if specialist not found', async () => {
      service.findSpecialistByUserId.mockRejectedValue(
        new NotFoundException('Specialist not found'),
      );

      await expect(controller.getMyDeals(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.updateStatus,
      );
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
    });

    it('should update deal status', async () => {
      const updatedDeal = { ...mockDeal, status: DealStatus.CONTACTED } as Deal;
      service.updateStatus.mockResolvedValue(updatedDeal);

      const result = await controller.updateStatus(
        'deal-123',
        mockRequest,
        { status: DealStatus.CONTACTED },
      );

      expect(result).toEqual(updatedDeal);
      expect(service.updateStatus).toHaveBeenCalledWith(
        'deal-123',
        'user-123',
        { status: DealStatus.CONTACTED },
      );
    });
  });

  describe('updateDealValue', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.updateDealValue,
      );
      expect(guards).toBeDefined();
    });

    it('should update deal value', async () => {
      const closeDate = new Date('2026-06-01');
      const updatedDeal = {
        ...mockDeal,
        dealValue: 200000,
        estimatedCloseDate: closeDate,
      } as Deal;
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.updateDealValue.mockResolvedValue(updatedDeal);

      const result = await controller.updateDealValue('deal-123', mockRequest, {
        dealValue: 200000,
        estimatedCloseDate: closeDate,
      });

      expect(result).toEqual(updatedDeal);
      expect(service.updateDealValue).toHaveBeenCalledWith(
        'deal-123',
        'specialist-123',
        200000,
        closeDate,
      );
    });
  });

  describe('closeDeal', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.closeDeal);
      expect(guards).toBeDefined();
    });

    it('should close deal', async () => {
      const closedDeal = {
        ...mockDeal,
        status: DealStatus.CLOSED_WON,
        actualCloseDate: new Date(),
      } as Deal;
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.closeDeal.mockResolvedValue(closedDeal);

      const result = await controller.closeDeal('deal-123', mockRequest, {
        status: DealStatus.CLOSED_WON,
        actualDealValue: 150000,
      });

      expect(result).toEqual(closedDeal);
      expect(service.closeDeal).toHaveBeenCalledWith(
        'deal-123',
        'specialist-123',
        DealStatus.CLOSED_WON,
        150000,
      );
    });
  });

  describe('reopenDeal', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.reopenDeal);
      expect(guards).toBeDefined();
    });

    it('should reopen a closed deal', async () => {
      const reopenedDeal = {
        ...mockDeal,
        status: DealStatus.IN_PROGRESS,
      } as Deal;
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.reopenDeal.mockResolvedValue(reopenedDeal);

      const result = await controller.reopenDeal('deal-123', mockRequest);

      expect(result).toEqual(reopenedDeal);
      expect(service.reopenDeal).toHaveBeenCalledWith(
        'deal-123',
        'specialist-123',
      );
    });
  });

  describe('addNote', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.addNote);
      expect(guards).toBeDefined();
    });

    it('should add a note to deal', async () => {
      const dealWithNote = {
        ...mockDeal,
        notes: ['new note'],
      } as unknown as Deal;
      service.addNote.mockResolvedValue(dealWithNote);

      const result = await controller.addNote('deal-123', mockRequest, {
        note: 'new note',
      });

      expect(result).toEqual(dealWithNote);
      expect(service.addNote).toHaveBeenCalledWith('deal-123', 'user-123', {
        note: 'new note',
      });
    });
  });

  describe('getDealEvents', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getDealEvents,
      );
      expect(guards).toBeDefined();
    });

    it('should return events for a deal', async () => {
      const mockEvents = [{ id: 'event-1', type: 'created' }];
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.getEventsByDeal.mockResolvedValue(mockEvents as never);

      const result = await controller.getDealEvents('deal-123', mockRequest);

      expect(result).toEqual(mockEvents);
      expect(service.getEventsByDeal).toHaveBeenCalledWith(
        'deal-123',
        'specialist-123',
      );
    });
  });

  describe('getDealAnalytics', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getDealAnalytics,
      );
      expect(guards).toBeDefined();
    });

    it('should return analytics for specialist', async () => {
      const analytics = {
        conversionRate: 50,
        averageDealValue: 100000,
        averageTimeToClose: 10,
        winRate: 50,
        statusDistribution: [],
        monthlyTrend: [],
      };
      service.findSpecialistByUserId.mockResolvedValue(mockSpecialist);
      service.getAnalytics.mockResolvedValue(analytics);

      const result = await controller.getDealAnalytics(mockRequest);

      expect(result).toEqual(analytics);
      expect(service.getAnalytics).toHaveBeenCalledWith('specialist-123');
    });
  });

  describe('Guard Integration', () => {
    it('should apply JwtAuthGuard to authenticated endpoints', () => {
      const authMethods = [
        'getMyDeals',
        'updateStatus',
        'updateDealValue',
        'closeDeal',
        'reopenDeal',
        'addNote',
        'getDealEvents',
        'getDealAnalytics',
      ];

      authMethods.forEach((method) => {
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
      service.create.mockRejectedValue(new Error('Database error'));

      await expect(
        controller.create({
          specialistId: 'specialist-123',
          customerName: 'Test',
          customerEmail: 'test@test.com',
          customerPhone: '+420000000000',
          message: 'test',
          gdprConsent: true,
        }),
      ).rejects.toThrow('Database error');
    });
  });
});

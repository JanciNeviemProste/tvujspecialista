import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DealsService } from './deals.service';
import { Deal, DealStatus } from '../database/entities/deal.entity';
import {
  LeadEvent,
  LeadEventType,
} from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { EmailService } from '../email/email.service';
import { CommissionsService } from '../commissions/services/commissions.service';
import { CreateDealDto } from './dto/create-deal.dto';

describe('DealsService', () => {
  let service: DealsService;
  let dealRepository: jest.Mocked<Repository<Deal>>;
  let leadEventRepository: jest.Mocked<Repository<LeadEvent>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let emailService: jest.Mocked<EmailService>;
  let commissionsService: jest.Mocked<CommissionsService>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    name: 'John Specialist',
    email: 'john@example.com',
    leadsThisMonth: 3,
    commissionRate: 0.15,
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
    estimatedCloseDate: new Date('2026-06-01'),
    actualCloseDate: null as any,
    commissionId: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    specialist: mockSpecialist,
  } as unknown as Deal;

  const mockCreateDealDto: CreateDealDto = {
    specialistId: 'specialist-123',
    customerName: 'Jane Customer',
    customerEmail: 'jane@example.com',
    customerPhone: '+420987654321',
    message: 'I need financial advice',
    gdprConsent: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        {
          provide: getRepositoryToken(Deal),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LeadEvent),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendNewLeadNotification: jest.fn().mockResolvedValue(undefined),
            sendLeadConfirmation: jest.fn().mockResolvedValue(undefined),
            sendDealStatusChange: jest.fn().mockResolvedValue(undefined),
            sendDealValueSet: jest.fn().mockResolvedValue(undefined),
            sendDealDeadlineReminder: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CommissionsService,
          useValue: {
            createCommission: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DealsService>(DealsService);
    dealRepository = module.get(getRepositoryToken(Deal));
    leadEventRepository = module.get(getRepositoryToken(LeadEvent));
    specialistRepository = module.get(getRepositoryToken(Specialist));
    emailService = module.get(EmailService);
    commissionsService = module.get(CommissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a deal successfully', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.create.mockReturnValue(mockDeal);
      dealRepository.save.mockResolvedValue(mockDeal);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      const result = await service.create(mockCreateDealDto);

      expect(result).toEqual(mockDeal);
      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCreateDealDto.specialistId },
      });
      expect(dealRepository.create).toHaveBeenCalledWith(mockCreateDealDto);
      expect(dealRepository.save).toHaveBeenCalled();
    });

    it('should create a lead event on deal creation', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.create.mockReturnValue(mockDeal);
      dealRepository.save.mockResolvedValue(mockDeal);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateDealDto);

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: mockDeal.id,
        type: LeadEventType.CREATED,
        data: { customerName: mockCreateDealDto.customerName },
      });
    });

    it('should increment specialist leadsThisMonth', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.create.mockReturnValue(mockDeal);
      dealRepository.save.mockResolvedValue(mockDeal);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateDealDto);

      expect(specialistRepository.update).toHaveBeenCalledWith(
        mockSpecialist.id,
        { leadsThisMonth: mockSpecialist.leadsThisMonth + 1 },
      );
    });

    it('should send email notifications', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.create.mockReturnValue(mockDeal);
      dealRepository.save.mockResolvedValue(mockDeal);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateDealDto);

      expect(emailService.sendNewLeadNotification).toHaveBeenCalledWith(
        mockSpecialist.email,
        mockSpecialist.name,
        mockCreateDealDto,
      );
      expect(emailService.sendLeadConfirmation).toHaveBeenCalledWith(
        mockCreateDealDto.customerEmail,
        mockCreateDealDto.customerName,
        mockSpecialist.name,
      );
    });

    it('should throw BadRequestException if GDPR consent not given', async () => {
      const dtoWithoutConsent = { ...mockCreateDealDto, gdprConsent: false };

      await expect(service.create(dtoWithoutConsent)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dtoWithoutConsent)).rejects.toThrow(
        'GDPR consent is required',
      );
    });

    it('should throw NotFoundException if specialist not found', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(service.create(mockCreateDealDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(mockCreateDealDto)).rejects.toThrow(
        'Specialist not found',
      );
    });
  });

  describe('findBySpecialist', () => {
    it('should return deals for a specialist', async () => {
      const deals = [mockDeal];
      dealRepository.find.mockResolvedValue(deals);

      const result = await service.findBySpecialist('specialist-123');

      expect(result).toEqual(deals);
      expect(dealRepository.find).toHaveBeenCalledWith({
        where: { specialistId: 'specialist-123' },
        relations: ['commission'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no deals exist', async () => {
      dealRepository.find.mockResolvedValue([]);

      const result = await service.findBySpecialist('specialist-123');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a deal by id and specialist', async () => {
      dealRepository.findOne.mockResolvedValue(mockDeal);

      const result = await service.findOne('deal-123', 'specialist-123');

      expect(result).toEqual(mockDeal);
      expect(dealRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'deal-123' },
        relations: ['specialist', 'commission'],
      });
    });

    it('should throw NotFoundException if deal not found', async () => {
      dealRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('invalid-id', 'specialist-123'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('invalid-id', 'specialist-123'),
      ).rejects.toThrow('Deal not found');
    });

    it('should throw BadRequestException if deal belongs to another specialist', async () => {
      const otherDeal = {
        ...mockDeal,
        specialistId: 'other-specialist',
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(otherDeal);

      await expect(
        service.findOne('deal-123', 'specialist-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should update deal status', async () => {
      const dealWithRelations = {
        ...mockDeal,
        status: DealStatus.NEW,
        specialist: {
          ...mockSpecialist,
          user: { email: 'john@example.com', name: 'John' },
        },
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(dealWithRelations);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.save.mockResolvedValue({
        ...dealWithRelations,
        status: DealStatus.CONTACTED,
      } as unknown as Deal);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.updateStatus('deal-123', 'user-123', {
        status: DealStatus.CONTACTED,
      });

      expect(dealRepository.save).toHaveBeenCalled();
      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'deal-123',
        type: LeadEventType.STATUS_CHANGED,
        data: { oldStatus: DealStatus.NEW, newStatus: DealStatus.CONTACTED },
      });
    });

    it('should throw NotFoundException if deal not found', async () => {
      dealRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid-id', 'user-123', {
          status: DealStatus.CONTACTED,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if specialist does not own deal', async () => {
      dealRepository.findOne.mockResolvedValue(mockDeal);
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('deal-123', 'other-user', {
          status: DealStatus.CONTACTED,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if specialist id does not match', async () => {
      dealRepository.findOne.mockResolvedValue(mockDeal);
      const otherSpecialist = {
        ...mockSpecialist,
        id: 'other-specialist-id',
      } as Specialist;
      specialistRepository.findOne.mockResolvedValue(otherSpecialist);

      await expect(
        service.updateStatus('deal-123', 'user-456', {
          status: DealStatus.CONTACTED,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addNote', () => {
    it('should add a note to a deal', async () => {
      const dealWithNotes = {
        ...mockDeal,
        notes: ['first note'],
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(dealWithNotes);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.addNote('deal-123', 'user-123', {
        note: 'new note',
      });

      expect(result.notes).toEqual(['first note', 'new note']);
      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'deal-123',
        type: LeadEventType.NOTE_ADDED,
        data: { note: 'new note' },
      });
    });

    it('should throw NotFoundException if deal not found', async () => {
      dealRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addNote('invalid-id', 'user-123', { note: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not authorized', async () => {
      dealRepository.findOne.mockResolvedValue(mockDeal);
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addNote('deal-123', 'other-user', { note: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateDealValue', () => {
    it('should update deal value and estimated close date', async () => {
      const dealWithRelations = {
        ...mockDeal,
        specialist: {
          ...mockSpecialist,
          user: { email: 'john@example.com', name: 'John' },
        },
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(dealWithRelations);
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const newCloseDate = new Date('2026-07-01');
      const result = await service.updateDealValue(
        'deal-123',
        'specialist-123',
        200000,
        newCloseDate,
      );

      expect(result.dealValue).toBe(200000);
      expect(result.estimatedCloseDate).toEqual(newCloseDate);
    });

    it('should create a lead event for value update', async () => {
      const dealWithRelations = {
        ...mockDeal,
        specialist: {
          ...mockSpecialist,
          user: { email: 'john@example.com', name: 'John' },
        },
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(dealWithRelations);
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const newCloseDate = new Date('2026-07-01');
      await service.updateDealValue(
        'deal-123',
        'specialist-123',
        200000,
        newCloseDate,
      );

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'deal-123',
        type: LeadEventType.STATUS_CHANGED,
        data: {
          action: 'value_updated',
          dealValue: 200000,
          estimatedCloseDate: newCloseDate,
        },
      });
    });

    it('should throw NotFoundException if deal not found', async () => {
      dealRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateDealValue(
          'invalid-id',
          'specialist-123',
          200000,
          new Date(),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('closeDeal', () => {
    const freshDeal = () =>
      ({
        ...mockDeal,
        status: DealStatus.NEW,
        notes: [],
        actualCloseDate: null,
        commissionId: null,
      }) as unknown as Deal;

    it('should close a deal as won with value', async () => {
      dealRepository.findOne.mockResolvedValue(freshDeal());
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      commissionsService.createCommission.mockResolvedValue({
        id: 'commission-456',
      } as any);

      const result = await service.closeDeal(
        'deal-123',
        'specialist-123',
        DealStatus.CLOSED_WON,
        150000,
      );

      expect(result.status).toBe(DealStatus.CLOSED_WON);
      expect(result.dealValue).toBe(150000);
      expect(result.actualCloseDate).toBeInstanceOf(Date);
      expect(commissionsService.createCommission).toHaveBeenCalledWith(
        'deal-123',
        'specialist-123',
        150000,
      );
    });

    it('should close a deal as lost', async () => {
      dealRepository.findOne.mockResolvedValue(freshDeal());
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.closeDeal(
        'deal-123',
        'specialist-123',
        DealStatus.CLOSED_LOST,
      );

      expect(result.status).toBe(DealStatus.CLOSED_LOST);
      expect(result.actualCloseDate).toBeInstanceOf(Date);
      expect(commissionsService.createCommission).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if won without deal value', async () => {
      dealRepository.findOne.mockResolvedValue(freshDeal());

      await expect(
        service.closeDeal('deal-123', 'specialist-123', DealStatus.CLOSED_WON),
      ).rejects.toThrow(BadRequestException);
      dealRepository.findOne.mockResolvedValue(freshDeal());
      await expect(
        service.closeDeal('deal-123', 'specialist-123', DealStatus.CLOSED_WON),
      ).rejects.toThrow('Deal value required for closed won deals');
    });

    it('should create lead event on close', async () => {
      dealRepository.findOne.mockResolvedValue(freshDeal());
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      await service.closeDeal(
        'deal-123',
        'specialist-123',
        DealStatus.CLOSED_LOST,
      );

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'deal-123',
        type: LeadEventType.STATUS_CHANGED,
        data: {
          oldStatus: DealStatus.NEW,
          newStatus: DealStatus.CLOSED_LOST,
          actualDealValue: undefined,
        },
      });
    });
  });

  describe('reopenDeal', () => {
    it('should reopen a closed lost deal', async () => {
      const closedDeal = {
        ...mockDeal,
        status: DealStatus.CLOSED_LOST,
        actualCloseDate: new Date(),
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(closedDeal);
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.reopenDeal('deal-123', 'specialist-123');

      expect(result.status).toBe(DealStatus.IN_PROGRESS);
    });

    it('should throw BadRequestException if deal is not closed lost', async () => {
      const wonDeal = {
        ...mockDeal,
        status: DealStatus.CLOSED_WON,
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(wonDeal);

      await expect(
        service.reopenDeal('deal-123', 'specialist-123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.reopenDeal('deal-123', 'specialist-123'),
      ).rejects.toThrow('Can only reopen closed lost deals');
    });

    it('should create a lead event for reopening', async () => {
      const closedDeal = {
        ...mockDeal,
        status: DealStatus.CLOSED_LOST,
      } as unknown as Deal;
      dealRepository.findOne.mockResolvedValue(closedDeal);
      dealRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Deal),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      await service.reopenDeal('deal-123', 'specialist-123');

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'deal-123',
        type: LeadEventType.STATUS_CHANGED,
        data: {
          oldStatus: DealStatus.CLOSED_LOST,
          newStatus: DealStatus.IN_PROGRESS,
          action: 'reopened',
        },
      });
    });
  });

  describe('getEventsByDeal', () => {
    it('should return events for a deal', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          leadId: 'deal-123',
          type: LeadEventType.CREATED,
          data: {},
          createdAt: new Date(),
        },
      ] as LeadEvent[];

      dealRepository.findOne.mockResolvedValue(mockDeal);
      leadEventRepository.find.mockResolvedValue(mockEvents);

      const result = await service.getEventsByDeal(
        'deal-123',
        'specialist-123',
      );

      expect(result).toEqual(mockEvents);
      expect(leadEventRepository.find).toHaveBeenCalledWith({
        where: { leadId: 'deal-123' },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw NotFoundException if deal not found', async () => {
      dealRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getEventsByDeal('invalid-id', 'specialist-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAnalytics', () => {
    function mockQueryBuilder(results: { getRawMany?: any[]; getRawOne?: any }[]) {
      let callIndex = 0;
      const qb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockImplementation(() => {
          const r = results[callIndex];
          callIndex++;
          return Promise.resolve(r?.getRawMany || []);
        }),
        getRawOne: jest.fn().mockImplementation(() => {
          const r = results[callIndex];
          callIndex++;
          return Promise.resolve(r?.getRawOne || null);
        }),
      };
      dealRepository.createQueryBuilder.mockReturnValue(qb as any);
      return qb;
    }

    it('should return analytics for a specialist', async () => {
      mockQueryBuilder([
        // 1st call: status distribution (getRawMany)
        {
          getRawMany: [
            { status: DealStatus.CLOSED_WON, count: '1' },
            { status: DealStatus.CLOSED_LOST, count: '1' },
            { status: DealStatus.NEW, count: '1' },
          ],
        },
        // 2nd call: aggregates (getRawOne)
        {
          getRawOne: { avgValue: '75000', avgDaysToClose: '10' },
        },
        // 3rd call: monthly trend (getRawMany)
        { getRawMany: [] },
      ]);

      const result = await service.getAnalytics('specialist-123');

      expect(result).toHaveProperty('conversionRate');
      expect(result).toHaveProperty('averageDealValue');
      expect(result).toHaveProperty('averageTimeToClose');
      expect(result).toHaveProperty('winRate');
      expect(result).toHaveProperty('statusDistribution');
      expect(result).toHaveProperty('monthlyTrend');
      expect(result.conversionRate).toBe(50);
      expect(result.winRate).toBe(50);
    });

    it('should handle zero deals gracefully', async () => {
      mockQueryBuilder([
        { getRawMany: [] },
        { getRawOne: null },
        { getRawMany: [] },
      ]);

      const result = await service.getAnalytics('specialist-123');

      expect(result.conversionRate).toBe(0);
      expect(result.averageDealValue).toBe(0);
      expect(result.averageTimeToClose).toBe(0);
      expect(result.winRate).toBe(0);
    });
  });
});

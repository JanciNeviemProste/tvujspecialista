import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Lead, LeadStatus } from '../database/entities/lead.entity';
import {
  LeadEvent,
  LeadEventType,
} from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { EmailService } from '../email/email.service';
import { CreateLeadDto } from './dto/create-lead.dto';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadRepository: jest.Mocked<Repository<Lead>>;
  let leadEventRepository: jest.Mocked<Repository<LeadEvent>>;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let emailService: jest.Mocked<EmailService>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    name: 'John Specialist',
    email: 'john@example.com',
    leadsThisMonth: 2,
  } as Specialist;

  const mockLead = {
    id: 'lead-123',
    specialistId: 'specialist-123',
    customerName: 'Jane Customer',
    customerEmail: 'jane@example.com',
    customerPhone: '+420987654321',
    message: 'I need help with my finances',
    status: LeadStatus.NEW,
    notes: [],
    gdprConsent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Lead;

  const mockCreateLeadDto: CreateLeadDto = {
    specialistId: 'specialist-123',
    customerName: 'Jane Customer',
    customerEmail: 'jane@example.com',
    customerPhone: '+420987654321',
    message: 'I need help with my finances',
    gdprConsent: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: getRepositoryToken(Lead),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LeadEvent),
          useValue: {
            save: jest.fn(),
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
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    leadRepository = module.get(getRepositoryToken(Lead));
    leadEventRepository = module.get(getRepositoryToken(LeadEvent));
    specialistRepository = module.get(getRepositoryToken(Specialist));
    emailService = module.get(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a lead successfully', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.create.mockReturnValue(mockLead);
      leadRepository.save.mockResolvedValue(mockLead);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      const result = await service.create(mockCreateLeadDto);

      expect(result).toEqual(mockLead);
      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCreateLeadDto.specialistId },
      });
      expect(leadRepository.create).toHaveBeenCalledWith(mockCreateLeadDto);
      expect(leadRepository.save).toHaveBeenCalled();
    });

    it('should create a lead event on creation', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.create.mockReturnValue(mockLead);
      leadRepository.save.mockResolvedValue(mockLead);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateLeadDto);

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: mockLead.id,
        type: LeadEventType.CREATED,
        data: { customerName: mockCreateLeadDto.customerName },
      });
    });

    it('should increment specialist leadsThisMonth', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.create.mockReturnValue(mockLead);
      leadRepository.save.mockResolvedValue(mockLead);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateLeadDto);

      expect(specialistRepository.update).toHaveBeenCalledWith(
        mockSpecialist.id,
        { leadsThisMonth: mockSpecialist.leadsThisMonth + 1 },
      );
    });

    it('should send email notifications', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.create.mockReturnValue(mockLead);
      leadRepository.save.mockResolvedValue(mockLead);
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);
      specialistRepository.update.mockResolvedValue({} as any);

      await service.create(mockCreateLeadDto);

      expect(emailService.sendNewLeadNotification).toHaveBeenCalledWith(
        mockSpecialist.email,
        mockSpecialist.name,
        mockCreateLeadDto,
      );
      expect(emailService.sendLeadConfirmation).toHaveBeenCalledWith(
        mockCreateLeadDto.customerEmail,
        mockCreateLeadDto.customerName,
        mockSpecialist.name,
      );
    });

    it('should throw error if GDPR consent not given', async () => {
      const dtoWithoutConsent = { ...mockCreateLeadDto, gdprConsent: false };

      await expect(service.create(dtoWithoutConsent)).rejects.toThrow(
        'GDPR consent is required',
      );
    });

    it('should throw NotFoundException if specialist not found', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(service.create(mockCreateLeadDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(mockCreateLeadDto)).rejects.toThrow(
        'Specialist not found',
      );
    });
  });

  describe('findBySpecialist', () => {
    it('should return leads for a specialist', async () => {
      const leads = [mockLead];
      leadRepository.find.mockResolvedValue(leads);

      const result = await service.findBySpecialist('specialist-123');

      expect(result).toEqual(leads);
      expect(leadRepository.find).toHaveBeenCalledWith({
        where: { specialistId: 'specialist-123' },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no leads exist', async () => {
      leadRepository.find.mockResolvedValue([]);

      const result = await service.findBySpecialist('specialist-123');

      expect(result).toEqual([]);
    });

    it('should order by createdAt DESC', async () => {
      leadRepository.find.mockResolvedValue([]);

      await service.findBySpecialist('specialist-123');

      expect(leadRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { createdAt: 'DESC' },
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update lead status', async () => {
      const freshLead = {
        ...mockLead,
        status: LeadStatus.NEW,
      } as unknown as Lead;
      leadRepository.findOne.mockResolvedValue(freshLead);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Lead),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.updateStatus('lead-123', 'user-123', {
        status: LeadStatus.CONTACTED,
      });

      expect(result.status).toBe(LeadStatus.CONTACTED);
    });

    it('should create lead event for status change', async () => {
      const freshLead = {
        ...mockLead,
        status: LeadStatus.NEW,
      } as unknown as Lead;
      leadRepository.findOne.mockResolvedValue(freshLead);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Lead),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      await service.updateStatus('lead-123', 'user-123', {
        status: LeadStatus.CONTACTED,
      });

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'lead-123',
        type: LeadEventType.STATUS_CHANGED,
        data: {
          oldStatus: LeadStatus.NEW,
          newStatus: LeadStatus.CONTACTED,
        },
      });
    });

    it('should throw NotFoundException if lead not found', async () => {
      leadRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid-id', 'user-123', {
          status: LeadStatus.CONTACTED,
        }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateStatus('invalid-id', 'user-123', {
          status: LeadStatus.CONTACTED,
        }),
      ).rejects.toThrow('Lead not found');
    });

    it('should throw NotFoundException if specialist not found', async () => {
      leadRepository.findOne.mockResolvedValue(mockLead);
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('lead-123', 'other-user', {
          status: LeadStatus.CONTACTED,
        }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateStatus('lead-123', 'other-user', {
          status: LeadStatus.CONTACTED,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw NotFoundException if specialist does not own lead', async () => {
      leadRepository.findOne.mockResolvedValue(mockLead);
      const otherSpecialist = {
        ...mockSpecialist,
        id: 'other-specialist',
      } as Specialist;
      specialistRepository.findOne.mockResolvedValue(otherSpecialist);

      await expect(
        service.updateStatus('lead-123', 'user-456', {
          status: LeadStatus.CONTACTED,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addNote', () => {
    it('should add a note to a lead', async () => {
      const leadWithNotes = {
        ...mockLead,
        notes: ['existing note'],
      } as unknown as Lead;
      leadRepository.findOne.mockResolvedValue(leadWithNotes);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Lead),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      const result = await service.addNote('lead-123', 'user-123', {
        note: 'new note',
      });

      expect(result.notes).toEqual(['existing note', 'new note']);
    });

    it('should create lead event for note addition', async () => {
      leadRepository.findOne.mockResolvedValue(mockLead);
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      leadRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Lead),
      );
      leadEventRepository.save.mockResolvedValue({} as LeadEvent);

      await service.addNote('lead-123', 'user-123', { note: 'test note' });

      expect(leadEventRepository.save).toHaveBeenCalledWith({
        leadId: 'lead-123',
        type: LeadEventType.NOTE_ADDED,
        data: { note: 'test note' },
      });
    });

    it('should throw NotFoundException if lead not found', async () => {
      leadRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addNote('invalid-id', 'user-123', { note: 'test' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.addNote('invalid-id', 'user-123', { note: 'test' }),
      ).rejects.toThrow('Lead not found');
    });

    it('should throw NotFoundException if not authorized', async () => {
      leadRepository.findOne.mockResolvedValue(mockLead);
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addNote('lead-123', 'other-user', { note: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetMonthlyLeadCounts', () => {
    it('should reset all specialist lead counts', async () => {
      specialistRepository.update.mockResolvedValue({} as any);

      await service.resetMonthlyLeadCounts();

      expect(specialistRepository.update).toHaveBeenCalledWith(
        {},
        { leadsThisMonth: 0 },
      );
    });
  });
});

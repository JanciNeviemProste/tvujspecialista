import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './services/events.service';
import {
  Event,
  EventStatus,
  EventType,
  EventFormat,
  EventCategory,
} from '../database/entities/event.entity';
import { RSVP } from '../database/entities/rsvp.entity';
import { User } from '../database/entities/user.entity';
import { EmailService } from '../email/email.service';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: jest.Mocked<Repository<Event>>;
  let rsvpRepository: jest.Mocked<Repository<RSVP>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let emailService: jest.Mocked<EmailService>;

  const mockEvent = {
    id: 'event-123',
    slug: 'test-workshop',
    title: 'Test Workshop',
    description: 'A test workshop event',
    type: EventType.WORKSHOP,
    format: EventFormat.ONLINE,
    category: EventCategory.FINANCIAL,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ), // +2 hours
    timezone: 'Europe/Prague',
    organizerId: 'user-123',
    maxAttendees: 50,
    attendeeCount: 10,
    price: 0,
    currency: 'CZK',
    status: EventStatus.PUBLISHED,
    published: true,
    featured: false,
    tags: ['finance'],
    rsvps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Event;

  // Mock query builder
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockEvent], 1]),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(RSVP),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEventCancellation: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get(getRepositoryToken(Event));
    rsvpRepository = module.get(getRepositoryToken(RSVP));
    userRepository = module.get(getRepositoryToken(User));
    emailService = module.get(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      const result = await service.findAll({});

      expect(eventRepository.createQueryBuilder).toHaveBeenCalledWith('event');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'event.published = :published',
        { published: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'event.status != :cancelled',
        { cancelled: EventStatus.CANCELLED },
      );
      expect(result.events).toEqual([mockEvent]);
      expect(result.total).toBe(1);
    });

    it('should apply type filter', async () => {
      await service.findAll({ type: EventType.WORKSHOP });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'event.type = :type',
        { type: EventType.WORKSHOP },
      );
    });
  });

  describe('findBySlug', () => {
    it('should return event by slug', async () => {
      eventRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findBySlug('test-workshop');

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'test-workshop', published: true },
        relations: ['organizer'],
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent-event')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findBySlug('nonexistent-event')).rejects.toThrow(
        'Event not found or not available',
      );
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createDto = {
        title: 'New Workshop',
        description: 'A new workshop event',
        type: EventType.WORKSHOP,
        format: EventFormat.ONLINE,
        category: EventCategory.FINANCIAL,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
        ).toISOString(),
      };

      eventRepository.findOne.mockResolvedValue(null); // slug is unique
      eventRepository.create.mockReturnValue(mockEvent);
      eventRepository.save.mockResolvedValue(mockEvent);

      const result = await service.create('user-123', createDto as any);

      expect(eventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'new-workshop',
          organizerId: 'user-123',
          published: false,
          status: EventStatus.DRAFT,
        }),
      );
      expect(eventRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should throw BadRequestException if end date is before start date', async () => {
      const createDto = {
        title: 'Bad Event',
        description: 'An event with invalid dates',
        type: EventType.WORKSHOP,
        format: EventFormat.ONLINE,
        category: EventCategory.FINANCIAL,
        startDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
        ).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await expect(
        service.create('user-123', createDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update event when user is the organizer', async () => {
      const updateDto = { description: 'Updated description' };
      const updatedEvent = { ...mockEvent, ...updateDto } as unknown as Event;

      eventRepository.findOne.mockResolvedValue(mockEvent);
      eventRepository.save.mockResolvedValue(updatedEvent);

      const result = await service.update(
        'event-123',
        'user-123',
        updateDto as any,
      );

      expect(eventRepository.save).toHaveBeenCalled();
      expect(result.description).toBe('Updated description');
    });

    it('should throw ForbiddenException if user is not the organizer', async () => {
      eventRepository.findOne.mockResolvedValue(mockEvent);

      await expect(
        service.update('event-123', 'other-user', {
          description: 'Hacked',
        } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', 'user-123', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete event when user is the organizer and no confirmed attendees', async () => {
      const eventNoRsvps = { ...mockEvent, rsvps: [] } as unknown as Event;
      eventRepository.findOne.mockResolvedValue(eventNoRsvps);
      eventRepository.delete.mockResolvedValue({} as any);

      await service.delete('event-123', 'user-123');

      expect(eventRepository.delete).toHaveBeenCalledWith('event-123');
    });

    it('should throw ForbiddenException if user is not the organizer', async () => {
      eventRepository.findOne.mockResolvedValue(mockEvent);

      await expect(service.delete('event-123', 'other-user')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

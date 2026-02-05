import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Event, EventStatus } from '../../database/entities/event.entity';
import { RSVP, RSVPStatus } from '../../database/entities/rsvp.entity';
import { User } from '../../database/entities/user.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
import { EmailService } from '../../email/email.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(RSVP)
    private rsvpRepository: Repository<RSVP>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findAll(
    filters: QueryEventsDto,
  ): Promise<{ events: Event[]; total: number }> {
    const query = this.eventRepository.createQueryBuilder('event');

    // Always filter by published for public access
    query.where('event.published = :published', { published: true });
    query.andWhere('event.status != :cancelled', {
      cancelled: EventStatus.CANCELLED,
    });

    // Apply filters
    if (filters.type) {
      query.andWhere('event.type = :type', { type: filters.type });
    }
    if (filters.format) {
      query.andWhere('event.format = :format', { format: filters.format });
    }
    if (filters.category) {
      query.andWhere('event.category = :category', {
        category: filters.category,
      });
    }
    if (filters.featured !== undefined) {
      query.andWhere('event.featured = :featured', {
        featured: filters.featured,
      });
    }
    if (filters.startDate) {
      query.andWhere('event.startDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      query.andWhere('event.endDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    // Order by startDate (upcoming first)
    query.orderBy('event.startDate', 'ASC');

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Load organizer relation
    query.leftJoinAndSelect('event.organizer', 'organizer');

    const [events, total] = await query.getManyAndCount();

    return { events, total };
  }

  async findUpcoming(): Promise<Event[]> {
    const now = new Date();

    const events = await this.eventRepository.find({
      where: {
        published: true,
        status: EventStatus.PUBLISHED,
        startDate: MoreThan(now),
      },
      relations: ['organizer'],
      order: {
        startDate: 'ASC',
      },
      take: 6, // Return top 6 upcoming events
    });

    return events;
  }

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { slug, published: true },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException('Event not found or not available');
    }

    return event;
  }

  async create(userId: string, dto: CreateEventDto): Promise<Event> {
    // Validate dates
    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('End date must be after start date');
    }

    // Generate slug from title
    let slug = this.generateSlug(dto.title);

    // Ensure slug is unique
    const existingEvent = await this.eventRepository.findOne({
      where: { slug },
    });
    if (existingEvent) {
      // Append random suffix to make it unique
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    // Create event
    const event = this.eventRepository.create({
      ...dto,
      slug,
      organizerId: userId,
      published: false,
      featured: false,
      status: EventStatus.DRAFT,
      attendeeCount: 0,
      price: dto.price || 0,
      currency: dto.currency || 'CZK',
      timezone: dto.timezone || 'Europe/Prague',
      tags: dto.tags || [],
    });

    return this.eventRepository.save(event);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify ownership
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    // If title changed, regenerate slug
    if (dto.title && dto.title !== event.title) {
      let newSlug = this.generateSlug(dto.title);

      // Ensure new slug is unique (excluding current event)
      const existingEvent = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.slug = :slug AND event.id != :id', {
          slug: newSlug,
          id,
        })
        .getOne();

      if (existingEvent) {
        newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 8)}`;
      }

      event.slug = newSlug;
    }

    // Validate dates if provided
    const startDate = dto.startDate ? new Date(dto.startDate) : event.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : event.endDate;
    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Update fields
    Object.assign(event, dto);

    return this.eventRepository.save(event);
  }

  async delete(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['rsvps'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify ownership
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this event');
    }

    // Check if event has confirmed attendees
    const confirmedRSVPs = event.rsvps?.filter(
      (rsvp) => rsvp.status === RSVPStatus.CONFIRMED || rsvp.status === RSVPStatus.ATTENDED,
    );
    if (confirmedRSVPs && confirmedRSVPs.length > 0) {
      throw new BadRequestException(
        'Cannot delete event with confirmed attendees. Please cancel the event instead.',
      );
    }

    await this.eventRepository.delete(id);
  }

  async publish(
    id: string,
    userId: string,
    published: boolean,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify ownership
    if (event.organizerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to publish/unpublish this event',
      );
    }

    // If publishing, validate that event is ready
    if (published) {
      if (!event.title || !event.description) {
        throw new BadRequestException(
          'Event must have title and description before publishing',
        );
      }

      if (new Date(event.startDate) <= new Date()) {
        throw new BadRequestException(
          'Cannot publish event that has already started',
        );
      }
    }

    event.published = published;
    event.status = published ? EventStatus.PUBLISHED : EventStatus.DRAFT;

    return this.eventRepository.save(event);
  }

  async cancel(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['rsvps', 'rsvps.user'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify ownership
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not authorized to cancel this event');
    }

    // Check if event is already cancelled or completed
    if (event.status === EventStatus.CANCELLED) {
      throw new BadRequestException('Event is already cancelled');
    }
    if (event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed event');
    }

    // Update event status
    event.status = EventStatus.CANCELLED;
    event.published = false;
    await this.eventRepository.save(event);

    // Send cancellation emails to all confirmed attendees
    const confirmedRSVPs = event.rsvps?.filter(
      (rsvp) => rsvp.status === RSVPStatus.CONFIRMED || rsvp.status === RSVPStatus.PENDING,
    );

    if (confirmedRSVPs && confirmedRSVPs.length > 0) {
      for (const rsvp of confirmedRSVPs) {
        if (rsvp.user) {
          await this.emailService.sendEventCancellation(
            rsvp.user.email,
            rsvp.user.name,
            event.title,
          );
        }
      }
    }
  }

  async getAttendees(id: string, userId: string): Promise<RSVP[]> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify ownership
    if (event.organizerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view attendees for this event',
      );
    }

    const rsvps = await this.rsvpRepository.find({
      where: { eventId: id },
      relations: ['user'],
      order: { registeredAt: 'DESC' },
    });

    return rsvps;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
}

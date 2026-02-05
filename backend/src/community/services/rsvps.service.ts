import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../../database/entities/event.entity';
import { RSVP, RSVPStatus } from '../../database/entities/rsvp.entity';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../../email/email.service';

@Injectable()
export class RSVPsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(RSVP)
    private rsvpRepository: Repository<RSVP>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async rsvp(
    userId: string,
    eventId: string,
    notes?: string,
  ): Promise<RSVP> {
    // 1. Validate event exists and published
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.published || event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not available for registration');
    }

    // Check if event has already started
    if (new Date(event.startDate) <= new Date()) {
      throw new BadRequestException('Cannot register for event that has already started');
    }

    // 2. Check maxAttendees limit
    if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
      throw new BadRequestException('Event has reached maximum attendee capacity');
    }

    // 3. Check if already registered
    const existingRSVP = await this.rsvpRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRSVP) {
      if (existingRSVP.status !== RSVPStatus.CANCELLED) {
        throw new ConflictException('You are already registered for this event');
      }
      // If previously cancelled, allow re-registration
      existingRSVP.status = RSVPStatus.PENDING;
      existingRSVP.registeredAt = new Date();
      if (notes) {
        existingRSVP.notes = notes;
      }

      // Increment attendee count
      event.attendeeCount += 1;
      await this.eventRepository.save(event);

      const savedRSVP = await this.rsvpRepository.save(existingRSVP);

      // Send confirmation email
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        await this.emailService.sendRSVPConfirmation(
          user.email,
          user.name,
          event.title,
          event.slug,
        );
      }

      return savedRSVP;
    }

    // 4. Create RSVP (status: pending)
    const rsvp = this.rsvpRepository.create({
      eventId,
      userId,
      status: RSVPStatus.PENDING,
      registeredAt: new Date(),
      notes,
    });

    const savedRSVP = await this.rsvpRepository.save(rsvp);

    // 5. Send confirmation email
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      await this.emailService.sendRSVPConfirmation(
        user.email,
        user.name,
        event.title,
        event.slug,
      );
    }

    // 6. Increment event.attendeeCount
    event.attendeeCount += 1;
    await this.eventRepository.save(event);

    return savedRSVP;
  }

  async findMyRSVPs(userId: string): Promise<RSVP[]> {
    const rsvps = await this.rsvpRepository.find({
      where: { userId },
      relations: ['event', 'event.organizer'],
      order: { registeredAt: 'DESC' },
    });

    return rsvps;
  }

  async confirm(rsvpId: string, userId: string): Promise<RSVP> {
    const rsvp = await this.rsvpRepository.findOne({
      where: { id: rsvpId },
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    // Verify ownership
    if (rsvp.userId !== userId) {
      throw new ForbiddenException('You are not authorized to confirm this RSVP');
    }

    if (rsvp.status === RSVPStatus.CANCELLED) {
      throw new BadRequestException('Cannot confirm cancelled RSVP');
    }

    if (rsvp.status === RSVPStatus.CONFIRMED) {
      throw new BadRequestException('RSVP is already confirmed');
    }

    // Update status
    rsvp.status = RSVPStatus.CONFIRMED;
    rsvp.confirmedAt = new Date();

    return this.rsvpRepository.save(rsvp);
  }

  async cancel(rsvpId: string, userId: string): Promise<void> {
    const rsvp = await this.rsvpRepository.findOne({
      where: { id: rsvpId },
      relations: ['event'],
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    // Verify ownership
    if (rsvp.userId !== userId) {
      throw new ForbiddenException('You are not authorized to cancel this RSVP');
    }

    if (rsvp.status === RSVPStatus.CANCELLED) {
      throw new BadRequestException('RSVP is already cancelled');
    }

    if (rsvp.status === RSVPStatus.ATTENDED) {
      throw new BadRequestException('Cannot cancel RSVP after attending event');
    }

    // Update status
    rsvp.status = RSVPStatus.CANCELLED;
    rsvp.cancelledAt = new Date();
    await this.rsvpRepository.save(rsvp);

    // Decrement attendeeCount
    if (rsvp.event) {
      rsvp.event.attendeeCount = Math.max(0, rsvp.event.attendeeCount - 1);
      await this.eventRepository.save(rsvp.event);
    }
  }

  async checkIn(rsvpId: string, organizerId: string): Promise<RSVP> {
    const rsvp = await this.rsvpRepository.findOne({
      where: { id: rsvpId },
      relations: ['event'],
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    // Verify user is organizer
    if (!rsvp.event || rsvp.event.organizerId !== organizerId) {
      throw new ForbiddenException(
        'You are not authorized to check in attendees for this event',
      );
    }

    if (rsvp.status === RSVPStatus.CANCELLED) {
      throw new BadRequestException('Cannot check in cancelled RSVP');
    }

    if (rsvp.status === RSVPStatus.ATTENDED) {
      throw new BadRequestException('Attendee is already checked in');
    }

    // Update status
    rsvp.status = RSVPStatus.ATTENDED;
    rsvp.attendedAt = new Date();

    return this.rsvpRepository.save(rsvp);
  }
}

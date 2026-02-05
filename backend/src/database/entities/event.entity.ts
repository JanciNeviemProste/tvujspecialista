import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { RSVP } from './rsvp.entity';

export enum EventType {
  WORKSHOP = 'workshop',
  NETWORKING = 'networking',
  CONFERENCE = 'conference',
  WEBINAR = 'webinar',
  MEETUP = 'meetup',
}

export enum EventFormat {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum EventCategory {
  REAL_ESTATE = 'real_estate',
  FINANCIAL = 'financial',
  BOTH = 'both',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('events')
@Index(['slug'], { unique: true })
@Index(['organizerId'])
@Index(['startDate'])
@Index(['category', 'published'])
@Index(['featured', 'published'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.MEETUP,
  })
  type: EventType;

  @Column({
    type: 'enum',
    enum: EventFormat,
    default: EventFormat.ONLINE,
  })
  format: EventFormat;

  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.BOTH,
  })
  category: EventCategory;

  @Column({ nullable: true })
  bannerImage: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: 'Europe/Prague' })
  timezone: string;

  @Column({ nullable: true })
  location: string; // for offline events

  @Column('text', { nullable: true })
  address: string; // for offline events

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number; // for map

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number; // for map

  @Column({ nullable: true })
  meetingLink: string; // for online events

  @Column({ nullable: true })
  meetingPassword: string; // for online events

  @Column()
  organizerId: string;

  @Column({ type: 'int', nullable: true })
  maxAttendees: number; // null = unlimited

  @Column({ type: 'int', default: 0 })
  attendeeCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number; // 0 = free

  @Column({ default: 'CZK' })
  currency: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ default: false })
  published: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => RSVP, (rsvp) => rsvp.event, { cascade: true })
  rsvps: RSVP[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';

export enum RSVPStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  NONE = 'none',
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('rsvps')
@Index(['eventId', 'userId'], { unique: true })
@Index(['userId'])
@Index(['eventId', 'status'])
export class RSVP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: RSVPStatus,
    default: RSVPStatus.PENDING,
  })
  status: RSVPStatus;

  @Column({ type: 'timestamp' })
  registeredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  attendedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NONE,
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Event, (event) => event.rsvps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum LeadEventType {
  CREATED = 'created',
  STATUS_CHANGED = 'status_changed',
  NOTE_ADDED = 'note_added',
  EMAIL_SENT = 'email_sent',
}

@Entity('lead_events')
@Index(['leadId', 'createdAt']) // Composite index for timeline queries
@Index(['type']) // Index for filtering by event type
@Index(['leadId', 'type']) // Composite index for filtered event queries
export class LeadEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index() // Individual index for lead lookups
  leadId: string;

  @Column({
    type: 'enum',
    enum: LeadEventType,
  })
  type: LeadEventType;

  @Column('jsonb', { nullable: true })
  data: Record<string, any>;

  @ManyToOne(() => Lead, (lead) => lead.events)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @CreateDateColumn()
  @Index() // Index for sorting by date
  createdAt: Date;
}

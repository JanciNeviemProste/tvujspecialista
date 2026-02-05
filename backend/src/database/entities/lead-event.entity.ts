import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lead } from './lead.entity';

export enum LeadEventType {
  CREATED = 'created',
  STATUS_CHANGED = 'status_changed',
  NOTE_ADDED = 'note_added',
  EMAIL_SENT = 'email_sent',
}

@Entity('lead_events')
export class LeadEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
  createdAt: Date;
}

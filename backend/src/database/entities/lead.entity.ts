import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Specialist } from './specialist.entity';
import { LeadEvent } from './lead-event.entity';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

@Entity('leads')
@Index(['specialistId', 'createdAt'])
@Index(['status'])
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialistId: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column('simple-array', { default: '' })
  notes: string[];

  @Column({ default: true })
  gdprConsent: boolean;

  @ManyToOne(() => Specialist, (specialist) => specialist.leads)
  @JoinColumn({ name: 'specialistId' })
  specialist: Specialist;

  @OneToMany(() => LeadEvent, (event) => event.lead)
  events: LeadEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

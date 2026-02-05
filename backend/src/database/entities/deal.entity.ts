import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Specialist } from './specialist.entity';
import { LeadEvent } from './lead-event.entity';
import { Commission } from './commission.entity';

export enum DealStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  IN_PROGRESS = 'in_progress', // NEW status
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

@Entity('leads') // Keep table name for backward compatibility
@Index(['specialistId', 'createdAt'])
@Index(['status'])
export class Deal {
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
    enum: DealStatus,
    default: DealStatus.NEW,
  })
  status: DealStatus;

  @Column('simple-array', { default: '' })
  notes: string[];

  @Column({ default: true })
  gdprConsent: boolean;

  // NEW FIELDS for deal tracking
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  dealValue: number;

  @Column({ type: 'date', nullable: true })
  estimatedCloseDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCloseDate: Date;

  @Column({ nullable: true })
  commissionId: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.leads)
  @JoinColumn({ name: 'specialistId' })
  specialist: Specialist;

  @OneToMany(() => LeadEvent, (event) => event.lead)
  events: LeadEvent[];

  @OneToOne(() => Commission, (commission) => commission.deal, { nullable: true })
  @JoinColumn({ name: 'commissionId' })
  commission: Commission;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

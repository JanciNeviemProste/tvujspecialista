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
import { Deal } from './deal.entity';
import { Specialist } from './specialist.entity';

export enum CommissionStatus {
  PENDING = 'pending',
  INVOICED = 'invoiced',
  PAID = 'paid',
  WAIVED = 'waived',
}

@Entity('commissions')
@Index(['dealId'], { unique: true })
@Index(['specialistId'])
@Index(['status'])
@Index(['dueDate'])
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  dealId: string;

  @Column()
  specialistId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  dealValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  commissionRate: number; // e.g., 0.15 = 15%

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  commissionAmount: number; // calculated

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @Column({ type: 'timestamp' })
  calculatedAt: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date; // typically 30 days after close

  @Column({ type: 'timestamp', nullable: true })
  invoicedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Deal, (deal) => deal.commission)
  @JoinColumn({ name: 'dealId' })
  deal: Deal;

  @ManyToOne(() => Specialist)
  @JoinColumn({ name: 'specialistId' })
  specialist: Specialist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

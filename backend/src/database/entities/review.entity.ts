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
import { Specialist } from './specialist.entity';

@Entity('reviews')
@Index(['specialistId', 'published'])
@Index(['createdAt'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialistId: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  published: boolean;

  @Column('text', { nullable: true })
  specialistResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @ManyToOne(() => Specialist, (specialist) => specialist.reviews)
  @JoinColumn({ name: 'specialistId' })
  specialist: Specialist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

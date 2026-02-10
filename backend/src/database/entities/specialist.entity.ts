import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Review } from './review.entity';
import { Lead } from './lead.entity';
import { Deal } from './deal.entity';
import { User } from './user.entity';

export enum SpecialistCategory {
  FINANCIAL_ADVISOR = 'Finanční poradce',
  REAL_ESTATE_AGENT = 'Realitní makléř',
}

export enum SubscriptionTier {
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
}

@Entity('specialists')
@Index(['category', 'location'])
@Index(['rating'])
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  topSpecialist: boolean;

  @Column({
    type: 'enum',
    enum: SpecialistCategory,
  })
  category: SpecialistCategory;

  @Column()
  location: string;

  @Column('text', { default: '' })
  bio: string;

  @Column('int')
  yearsExperience: number;

  @Column('int', { default: 0 })
  hourlyRate: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewsCount: number;

  @Column('simple-array', { default: '' })
  services: string[];

  @Column('simple-array', { default: '' })
  certifications: string[];

  @Column({ default: '' })
  education: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column('int', { default: 0 })
  leadCount: number;

  @Column('simple-array', { default: '' })
  availability: string[];

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.BASIC,
  })
  subscriptionTier: SubscriptionTier;

  @Column('int', { default: 0 })
  leadsThisMonth: number;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;

  // Commission tracking (NEW)
  @Exclude()
  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.15 })
  commissionRate: number; // default 15%

  @Exclude()
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCommissionPaid: number;

  @OneToMany(() => Review, (review) => review.specialist)
  reviews: Review[];

  @OneToMany(() => Lead, (lead) => lead.specialist)
  leads: Lead[];

  @OneToMany(() => Deal, (deal) => deal.specialist)
  deals: Deal[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

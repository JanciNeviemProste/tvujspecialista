import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { SubscriptionTier } from './specialist.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  TRIALING = 'trialing',
}

export enum SubscriptionType {
  EDUCATION = 'education',
  MARKETPLACE = 'marketplace',
  PREMIUM = 'premium',
}

@Entity('subscriptions')
@Index(['specialistId'])
@Index(['userId'])
@Index(['stripeSubscriptionId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  specialistId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ unique: true })
  stripeCustomerId: string;

  @Column({ unique: true, nullable: true })
  stripeSubscriptionId: string;

  @Column({ nullable: true })
  stripeSubscriptionItemId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    nullable: true,
  })
  tier: SubscriptionTier;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.MARKETPLACE,
  })
  subscriptionType: SubscriptionType;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd: Date;

  @Column({ type: 'timestamp', nullable: true })
  canceledAt: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    nullable: true,
  })
  scheduledDowngradeTo: SubscriptionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

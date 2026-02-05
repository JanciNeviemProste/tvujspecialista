import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  SPECIALIST = 'specialist',
  ADMIN = 'admin',
}

export enum SubscriptionType {
  NONE = 'none',
  EDUCATION = 'education',
  MARKETPLACE = 'marketplace',
  PREMIUM = 'premium',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.NONE,
  })
  subscriptionType: SubscriptionType;

  @Column({ type: 'timestamp', nullable: true })
  educationSubscriptionExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  specialistId?: string;
  subscriptionType: SubscriptionType;
  tier?: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionItemId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt?: string;
  scheduledDowngradeTo?: SubscriptionType;
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionType {
  EDUCATION = 'education',
  MARKETPLACE = 'marketplace',
  PREMIUM = 'premium',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

export interface PricingPlan {
  type: SubscriptionType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  features: string[];
  recommended?: boolean;
  cta: string;
  buttonVariant?: 'default' | 'secondary' | 'outline';
}

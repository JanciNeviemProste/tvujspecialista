import { z } from 'zod';

// ============ Auth Schemas ============

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(['customer', 'provider', 'admin']),
  name: z.string(),
  phone: z.string().optional(),
  verified: z.boolean(),
  twoFactorEnabled: z.boolean().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

// ============ Deal Schemas ============

export const dealStatusSchema = z.enum([
  'new',
  'contacted',
  'qualified',
  'in_progress',
  'closed_won',
  'closed_lost',
]);

export const dealNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({ name: z.string() }),
});

export const dealEventSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  type: z.string(),
  description: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string(),
});

export const dealSchema = z.object({
  id: z.string(),
  specialistId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  message: z.string(),
  status: dealStatusSchema,
  dealValue: z.number().optional(),
  estimatedCloseDate: z.string().optional(),
  actualCloseDate: z.string().optional(),
  events: z.array(dealEventSchema).optional(),
  notes: z.array(dealNoteSchema).optional(),
  crmExternalId: z.string().nullable().optional(),
  crmPushedAt: z.string().nullable().optional(),
  crmPushError: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const dealArraySchema = z.array(dealSchema);

// ============ Subscription Schemas ============

export const subscriptionTypeSchema = z.enum(['education', 'marketplace', 'premium']);
export const subscriptionTierSchema = z.enum(['free', 'basic', 'pro', 'premium']);
export const subscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'past_due',
  'trialing',
  'unpaid',
]);

export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  specialistId: z.string().optional(),
  subscriptionType: subscriptionTypeSchema,
  tier: subscriptionTierSchema.optional(),
  status: subscriptionStatusSchema,
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  stripeSubscriptionItemId: z.string().optional(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  canceledAt: z.string().optional(),
  scheduledDowngradeTo: subscriptionTypeSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const subscriptionArraySchema = z.array(subscriptionSchema);

// ============ Validation Utility ============

export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('[API Validation] Response validation failed:', result.error.issues);
    return data as T;
  }
  return result.data;
}

import type { Deal } from './deals';

export interface Commission {
  id: string;
  dealId: string;
  specialistId: string;
  dealValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  calculatedAt: string;
  dueDate: string;
  invoicedAt?: string;
  paidAt?: string;
  stripePaymentIntentId?: string;
  notes?: string;
  deal?: Deal;
  updatedAt: string;
}

export enum CommissionStatus {
  PENDING = 'pending',
  INVOICED = 'invoiced',
  PAID = 'paid',
  WAIVED = 'waived',
}

export interface CommissionStats {
  pending: Commission[];
  paid: Commission[];
  totalPending: number;
  totalPaid: number;
}

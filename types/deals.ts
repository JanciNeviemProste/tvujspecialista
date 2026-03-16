export interface DealNote {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export interface Deal {
  id: string;
  specialistId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: DealStatus;
  dealValue?: number;
  estimatedCloseDate?: string;
  actualCloseDate?: string;
  events?: DealEvent[];
  notes?: DealNote[];
  crmExternalId?: string;
  crmPushedAt?: string;
  crmPushError?: string;
  createdAt: string;
  updatedAt: string;
}

export enum DealStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  IN_PROGRESS = 'in_progress',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export interface DealEvent {
  id: string;
  dealId: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface UpdateDealStatusDto {
  status: DealStatus;
}

export interface DealFilters {
  search: string;
  status: DealStatus | 'all';
}

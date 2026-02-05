import type { Commission } from './commissions';

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
  commissionId?: string;
  commission?: Commission;
  events?: DealEvent[];
  notes?: DealNote[];
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
  metadata?: any;
  createdAt: string;
}

export interface UpdateDealStatusDto {
  status: DealStatus;
}

export interface UpdateDealValueDto {
  dealValue: number;
  estimatedCloseDate: string;
}

export interface CloseDealDto {
  status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST;
  actualDealValue?: number;
}

export interface DealFilters {
  search: string;
  status: DealStatus | 'all';
  valueRange: [number, number];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  dateType: 'created' | 'estimatedClose';
}

export interface DealAnalyticsData {
  conversionRate: number;
  averageDealValue: number;
  averageTimeToClose: number; // in days
  winRate: number;
  statusDistribution: { status: DealStatus; count: number }[];
  monthlyTrend: { month: string; won: number; lost: number }[];
}

'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { Mail, Phone, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

interface DealCardProps {
  deal: Deal;
  onStatusChange?: (deal: Deal) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
}

const statusClassNames: Record<DealStatus, string> = {
  [DealStatus.NEW]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [DealStatus.CONTACTED]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [DealStatus.QUALIFIED]: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  [DealStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  [DealStatus.CLOSED_WON]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  [DealStatus.CLOSED_LOST]: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
};

// Define the next status in the pipeline flow (without labels)
const nextStatusMap: Partial<Record<DealStatus, { status: DealStatus }>> = {
  [DealStatus.NEW]: { status: DealStatus.CONTACTED },
  [DealStatus.CONTACTED]: { status: DealStatus.QUALIFIED },
  [DealStatus.QUALIFIED]: { status: DealStatus.IN_PROGRESS },
  [DealStatus.IN_PROGRESS]: { status: DealStatus.CLOSED_WON },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function DealCardInner({
  deal,
  onStatusChange,
  onViewDetails,
  className,
}: DealCardProps) {
  const t = useTranslations('dashboard.deals');

  const statusLabels: Record<DealStatus, string> = {
    [DealStatus.NEW]: t('status.new'),
    [DealStatus.CONTACTED]: t('status.contacted'),
    [DealStatus.QUALIFIED]: t('status.qualified'),
    [DealStatus.IN_PROGRESS]: t('status.inProgress'),
    [DealStatus.CLOSED_WON]: t('status.closedWon'),
    [DealStatus.CLOSED_LOST]: t('status.closedLost'),
  };

  const nextStatusLabels: Partial<Record<DealStatus, string>> = {
    [DealStatus.NEW]: t('status.contacted'),
    [DealStatus.CONTACTED]: t('status.qualified'),
    [DealStatus.QUALIFIED]: t('status.inProgress'),
    [DealStatus.IN_PROGRESS]: t('card.closeDeal'),
  };

  const statusClassName = statusClassNames[deal.status];
  const nextStatus = nextStatusMap[deal.status];

  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        className
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header with badge */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">{deal.customerName}</h3>
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ml-2', statusClassName)}>
            {statusLabels[deal.status]}
          </span>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="truncate">{deal.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{deal.customerPhone}</span>
          </div>
        </div>

        {/* Message preview */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{deal.message}</p>

        {/* Deal value and close date */}
        {(deal.dealValue || deal.estimatedCloseDate) && (
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
            {deal.dealValue && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(deal.dealValue)}
                </span>
              </div>
            )}
            {deal.estimatedCloseDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('card.closeDeal')}:{' '}
                  {format(new Date(deal.estimatedCloseDate), 'd. MMM yyyy', { locale: sk })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Created date */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {t('card.created')}:{' '}
          {format(new Date(deal.createdAt), 'd. MMM yyyy, HH:mm', { locale: sk })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-0 flex gap-2">
        {onViewDetails && (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            onClick={() => onViewDetails(deal)}
          >
            {t('card.detail')}
          </button>
        )}
        {onStatusChange && nextStatus && (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={() => onStatusChange(deal)}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {nextStatusLabels[deal.status]}
          </button>
        )}
      </div>
    </div>
  );
}

export const DealCard = memo(DealCardInner);

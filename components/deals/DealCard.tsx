'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { Mail, Phone, ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

interface DealCardProps {
  deal: Deal;
  onStatusChange?: (deal: Deal, nextStatus: DealStatus) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
}

function DealCardInner({
  deal,
  onStatusChange,
  onViewDetails,
  className,
}: DealCardProps) {
  const t = useTranslations('dashboard.deals');

  const isNew = deal.status === DealStatus.NEW;

  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        className
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">{deal.customerName}</h3>
          <span className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ml-2',
            isNew
              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          )}>
            {isNew ? t('status.new') : t('status.contacted')}
          </span>
        </div>

        {/* Contact info — blurred for NEW status */}
        <div className={cn('space-y-2 text-sm text-gray-500 dark:text-gray-400', isNew && 'relative')}>
          {isNew && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white/80 dark:bg-neutral-900/80 px-3 py-1.5 rounded-full border">
                <Lock className="h-3.5 w-3.5" />
                {t('card.contactHidden')}
              </span>
            </div>
          )}
          <div className={cn('flex items-center gap-2', isNew && 'blur-sm select-none')}>
            <Mail className="h-4 w-4" />
            <span className="truncate">{deal.customerEmail}</span>
          </div>
          <div className={cn('flex items-center gap-2', isNew && 'blur-sm select-none')}>
            <Phone className="h-4 w-4" />
            <span>{deal.customerPhone}</span>
          </div>
        </div>

        {/* Message preview */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{deal.message}</p>

        {/* CRM push error */}
        {deal.crmPushError && (
          <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded">
            {t('card.crmError')}: {deal.crmPushError}
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
        {onStatusChange && isNew && (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={() => onStatusChange(deal, DealStatus.CONTACTED)}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {t('card.moveToCrm')}
          </button>
        )}
      </div>
    </div>
  );
}

export const DealCard = memo(DealCardInner);

'use client';

import { memo, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { Mail, Phone, ArrowRight, Lock, Clock, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { cs, sk, enUS, pl } from 'date-fns/locale';

import { EditableText } from '@/components/editor/EditableText';
const dateFnsLocaleMap: Record<string, typeof cs> = { cs, sk, en: enUS, pl };

function getSuccessChance(createdAt: string): { percent: number; color: string; label: string } {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = elapsed / 60000;

  if (minutes < 5) return { percent: 95, color: 'text-green-600 bg-green-50', label: '5 min' };
  if (minutes < 30) return { percent: 85, color: 'text-green-600 bg-green-50', label: '30 min' };
  if (minutes < 60) return { percent: 70, color: 'text-yellow-600 bg-yellow-50', label: '1 h' };
  if (minutes < 180) return { percent: 55, color: 'text-orange-600 bg-orange-50', label: '3 h' };
  if (minutes < 720) return { percent: 35, color: 'text-orange-600 bg-orange-50', label: '12 h' };
  if (minutes < 1440) return { percent: 20, color: 'text-red-600 bg-red-50', label: '24 h' };
  if (minutes < 4320) return { percent: 10, color: 'text-red-600 bg-red-50', label: '3 d' };
  return { percent: 5, color: 'text-red-700 bg-red-100', label: '3+ d' };
}

function formatElapsed(createdAt: string): string {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ${minutes % 60} min`;
  const days = Math.floor(hours / 24);
  return `${days} d ${hours % 24} h`;
}

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
  const locale = useLocale();

  const isNew = deal.status === DealStatus.NEW;

  // Live-updating timer for NEW leads
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isNew) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30000); // update every 30s
    return () => clearInterval(interval);
  }, [isNew]);

  const chance = isNew ? getSuccessChance(deal.createdAt) : null;

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

        {/* Urgency timer — only for NEW leads */}
        {isNew && chance && (
          <div className={cn('flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium', chance.color)}>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatElapsed(deal.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{chance.percent}%</span>
            </div>
          </div>
        )}

        {/* Contact info — blurred for NEW status */}
        <div className={cn('space-y-2 text-sm text-gray-500 dark:text-gray-400', isNew && 'relative')}>
          {isNew && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white/80 dark:bg-neutral-900/80 px-3 py-1.5 rounded-full border">
                <Lock className="h-3.5 w-3.5" />
                <EditableText tKey="dashboard.deals.card.contactHidden">{t('card.contactHidden')}</EditableText>
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
            <EditableText tKey="dashboard.deals.card.crmError">{t('card.crmError')}</EditableText>: {deal.crmPushError}
          </div>
        )}

        {/* Created date */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          <EditableText tKey="dashboard.deals.card.created">{t('card.created')}</EditableText>:{' '}
          {format(new Date(deal.createdAt), 'd. MMM yyyy, HH:mm', { locale: dateFnsLocaleMap[locale] || cs })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-0 flex gap-2">
        {onViewDetails && (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            onClick={() => onViewDetails(deal)}
          >
            <EditableText tKey="dashboard.deals.card.detail">{t('card.detail')}</EditableText>
          </button>
        )}
        {onStatusChange && isNew && (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={() => onStatusChange(deal, DealStatus.CONTACTED)}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <EditableText tKey="dashboard.deals.card.moveToCrm">{t('card.moveToCrm')}</EditableText>
          </button>
        )}
      </div>
    </div>
  );
}

export const DealCard = memo(DealCardInner);

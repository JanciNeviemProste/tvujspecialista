'use client';

import { memo } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

interface DealCardProps {
  deal: Deal;
  onStatusChange?: (deal: Deal) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
  draggable?: boolean;
}

const statusConfig: Record<
  DealStatus,
  { label: string; className: string }
> = {
  [DealStatus.NEW]: { label: 'Nový', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  [DealStatus.CONTACTED]: { label: 'Kontaktovaný', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  [DealStatus.QUALIFIED]: { label: 'Kvalifikovaný', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300' },
  [DealStatus.IN_PROGRESS]: { label: 'V procese', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  [DealStatus.CLOSED_WON]: { label: 'Získaný', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
  [DealStatus.CLOSED_LOST]: { label: 'Stratený', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' },
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
  draggable = false,
}: DealCardProps) {
  const statusInfo = statusConfig[deal.status];

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden', className)}
      draggable={draggable}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with badge */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-base line-clamp-1">{deal.customerName}</h3>
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusInfo.className)}>
            {statusInfo.label}
          </span>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-sm text-muted-foreground">
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
        <p className="text-sm text-muted-foreground line-clamp-2">{deal.message}</p>

        {/* Deal value and close date */}
        {(deal.dealValue || deal.estimatedCloseDate) && (
          <div className="space-y-2 pt-2 border-t">
            {deal.dealValue && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(deal.dealValue)}
                </span>
              </div>
            )}
            {deal.estimatedCloseDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Uzavretie:{' '}
                  {format(new Date(deal.estimatedCloseDate), 'd. MMM yyyy', { locale: sk })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Created date */}
        <div className="text-xs text-muted-foreground">
          Vytvorené:{' '}
          {format(new Date(deal.createdAt), 'd. MMM yyyy, HH:mm', { locale: sk })}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(deal)}
          >
            Detail
          </Button>
        )}
        {onStatusChange &&
          deal.status !== DealStatus.CLOSED_WON &&
          deal.status !== DealStatus.CLOSED_LOST && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(deal)}
            >
              Zmeniť status
            </Button>
          )}
      </CardFooter>
    </Card>
  );
}

export const DealCard = memo(DealCardInner);

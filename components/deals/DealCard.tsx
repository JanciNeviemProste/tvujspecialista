'use client';

import { memo } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }
> = {
  [DealStatus.NEW]: { label: 'Nový', variant: 'default' },
  [DealStatus.CONTACTED]: { label: 'Kontaktovaný', variant: 'secondary' },
  [DealStatus.QUALIFIED]: { label: 'Kvalifikovaný', variant: 'secondary' },
  [DealStatus.IN_PROGRESS]: { label: 'V procese', variant: 'warning' },
  [DealStatus.CLOSED_WON]: { label: 'Uzavretý - Získaný', variant: 'success' },
  [DealStatus.CLOSED_LOST]: { label: 'Uzavretý - Stratený', variant: 'destructive' },
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
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
                <DollarSign className="h-4 w-4 text-success" />
                <span className="font-medium text-success">
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

'use client';

import { Commission, CommissionStatus } from '@/types/commissions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format, isPast } from 'date-fns';
import { sk } from 'date-fns/locale';

interface CommissionCardProps {
  commission: Commission;
  onPay?: (commission: Commission) => void;
  className?: string;
}

const statusConfig: Record<CommissionStatus, { label: string; variant: 'default' | 'warning' | 'success' | 'secondary' }> = {
  [CommissionStatus.PENDING]: { label: 'Čaká na úhradu', variant: 'warning' },
  [CommissionStatus.INVOICED]: { label: 'Vyfakturované', variant: 'default' },
  [CommissionStatus.PAID]: { label: 'Zaplatené', variant: 'success' },
  [CommissionStatus.WAIVED]: { label: 'Zrušené', variant: 'secondary' },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function CommissionCard({ commission, onPay, className }: CommissionCardProps) {
  const statusInfo = statusConfig[commission.status];
  const dueDate = new Date(commission.dueDate);
  const isOverdue = isPast(dueDate) && commission.status === CommissionStatus.PENDING;

  return (
    <Card
      variant="elevated"
      className={cn('overflow-hidden', className)}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header with status badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Provízia z dealu
            </h3>
            {commission.deal && (
              <p className="text-sm text-muted-foreground">
                {commission.deal.customerName}
              </p>
            )}
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Financial details */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Hodnota dealu:</span>
            <span className="font-medium">{formatCurrency(commission.dealValue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sazba provízií:</span>
            <span className="font-medium">{commission.commissionRate}%</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-semibold">Provízia:</span>
            <span className="font-bold text-lg text-success">
              {formatCurrency(commission.commissionAmount)}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Splatnosť:</span>
            <span className={cn(
              'font-medium',
              isOverdue && 'text-destructive'
            )}>
              {format(dueDate, 'd. MMM yyyy', { locale: sk })}
            </span>
            {isOverdue && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>

          {commission.paidAt && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">Zaplatené:</span>
              <span className="font-medium">
                {format(new Date(commission.paidAt), 'd. MMM yyyy', { locale: sk })}
              </span>
            </div>
          )}

          {commission.invoicedAt && !commission.paidAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Vyfakturované:</span>
              <span className="font-medium">
                {format(new Date(commission.invoicedAt), 'd. MMM yyyy', { locale: sk })}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {commission.notes && (
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground">{commission.notes}</p>
          </div>
        )}
      </CardContent>

      {onPay && commission.status === CommissionStatus.PENDING && (
        <CardFooter className="p-6 pt-0">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onPay(commission)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Zaplatiť províziu
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

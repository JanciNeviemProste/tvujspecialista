'use client';

import { memo } from 'react';
import { CommissionStats as CommissionStatsType } from '@/types/commissions';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CommissionStatsProps {
  stats: CommissionStatsType;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function CommissionStatsInner({ stats, className }: CommissionStatsProps) {
  const statCards = [
    {
      title: 'Čakajúce provízne',
      value: stats.pending.length,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Zaplatené provízne',
      value: stats.paid.length,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Čakajúca suma',
      value: formatCurrency(stats.totalPending),
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Zaplatená suma',
      value: formatCurrency(stats.totalPaid),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}
    >
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-full', stat.bgColor)}>
                  <Icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export const CommissionStats = memo(CommissionStatsInner);

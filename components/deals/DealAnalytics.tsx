'use client';

import { DealAnalyticsData, DealStatus } from '@/types/deals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealAnalyticsProps {
  analytics: DealAnalyticsData | null;
  isLoading?: boolean;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function DealAnalytics({ analytics, isLoading, className }: DealAnalyticsProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={cn('text-center py-8', className)}>
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Žiadne dáta pre analytiku
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Konverzný pomer',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Priemerná hodnota',
      value: formatCurrency(analytics.averageDealValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Priemerný čas uzavretia',
      value: `${analytics.averageTimeToClose} dní`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Úspešnosť',
      value: `${analytics.winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const getStatusLabel = (status: DealStatus) => {
    const labels: Record<DealStatus, string> = {
      [DealStatus.NEW]: 'Nový',
      [DealStatus.CONTACTED]: 'Kontaktovaný',
      [DealStatus.QUALIFIED]: 'Kvalifikovaný',
      [DealStatus.IN_PROGRESS]: 'V procese',
      [DealStatus.CLOSED_WON]: 'Získaný',
      [DealStatus.CLOSED_LOST]: 'Stratený',
    };
    return labels[status] || status;
  };

  const totalDeals = analytics.statusDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className={cn('space-y-6', className)} role="region" aria-label="Deal analytics">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground" id={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}-label`}>
                      {stat.title}
                    </p>
                    <p
                      className="text-2xl font-bold"
                      aria-labelledby={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}-label`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn('p-3 rounded-full', stat.bgColor)} aria-hidden="true">
                    <Icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rozdelenie podľa statusu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.statusDistribution
            .filter((item) => item.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((item) => {
              const percentage = totalDeals > 0 ? (item.count / totalDeals) * 100 : 0;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{getStatusLabel(item.status)}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full bg-muted overflow-hidden"
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${getStatusLabel(item.status)}: ${percentage.toFixed(0)}%`}
                  >
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      {analytics.monthlyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mesačný trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyTrend.map((month) => {
                const total = month.won + month.lost;
                const wonPercentage = total > 0 ? (month.won / total) * 100 : 0;
                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-muted-foreground">
                        {month.won} získaných / {month.lost} stratených
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-red-500/20 overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${wonPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

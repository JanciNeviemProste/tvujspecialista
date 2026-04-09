'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useMyLeads } from '@/lib/hooks/useMyLeads';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api/reviews';
import type { Lead } from '@/types/lead';
import type { Review } from '@/types/review';
import { EditableText } from '@/components/editor/EditableText';

// ── helpers ──────────────────────────────────────────────────────────

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(key: string, locale: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(
    locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ',
    { month: 'short' },
  );
}

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(getMonthKey(d));
  }
  return months;
}

// ── status config ────────────────────────────────────────────────────

const STATUS_CONFIG = [
  { key: 'new' as const, tKey: 'new', color: 'bg-blue-500' },
  { key: 'contacted' as const, tKey: 'contacted', color: 'bg-yellow-500' },
  { key: 'qualified' as const, tKey: 'qualified', color: 'bg-purple-500' },
  { key: 'closedWon' as const, tKey: 'closedWon', color: 'bg-green-500' },
  { key: 'closedLost' as const, tKey: 'closedLost', color: 'bg-red-500' },
] as const;

// ── skeleton ─────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-white dark:bg-card p-6 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded mb-4" />
      <div className="h-8 w-16 bg-gray-200 dark:bg-muted rounded mb-2" />
      <div className="h-3 w-32 bg-gray-100 dark:bg-muted/50 rounded" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="rounded-lg border bg-white dark:bg-card p-6 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 dark:bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-20 bg-gray-200 dark:bg-muted rounded" />
            <div className="h-4 flex-1 bg-gray-100 dark:bg-muted/50 rounded" />
            <div className="h-3 w-8 bg-gray-200 dark:bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────

export default function StatisticsPage() {
  const t = useTranslations('dashboard.statistics');
  const tStatus = useTranslations('common.status');
  const locale = useLocale();

  const { data: leadsData, isLoading: leadsLoading } = useMyLeads();
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['myReviews'],
    queryFn: () => reviewsApi.getMyReviews().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  });

  // Normalize leads — handles both raw array and structured object
  const normalized = useMemo(() => {
    if (!leadsData) return null;
    if (Array.isArray(leadsData)) {
      const leads = leadsData as Lead[];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      return {
        leads,
        total: leads.length,
        newThisMonth: leads.filter((l) => new Date(l.createdAt) >= monthStart).length,
        stats: {
          new: leads.filter((l) => l.status === 'new').length,
          contacted: leads.filter((l) => l.status === 'contacted').length,
          qualified: leads.filter((l) => l.status === 'qualified').length,
          closedWon: leads.filter((l) => l.status === 'closed_won').length,
          closedLost: leads.filter((l) => l.status === 'closed_lost').length,
        },
      };
    }
    return leadsData;
  }, [leadsData]);

  // Review stats
  const reviewStats = useMemo(() => {
    if (!reviewsData || reviewsData.length === 0) {
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    }
    const distribution = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
    let sum = 0;
    for (const review of reviewsData) {
      const rating = Math.max(1, Math.min(5, Math.round(review.rating)));
      distribution[rating - 1]++;
      sum += review.rating;
    }
    return {
      average: Math.round((sum / reviewsData.length) * 10) / 10,
      total: reviewsData.length,
      distribution,
    };
  }, [reviewsData]);

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months = getLast6Months();
    const counts: Record<string, number> = {};
    for (const m of months) counts[m] = 0;

    if (normalized?.leads) {
      for (const lead of normalized.leads) {
        const key = getMonthKey(new Date(lead.createdAt));
        if (key in counts) counts[key]++;
      }
    }

    const maxCount = Math.max(1, ...Object.values(counts));
    return months.map((m) => ({
      key: m,
      label: getMonthLabel(m, locale),
      count: counts[m],
      pct: (counts[m] / maxCount) * 100,
    }));
  }, [normalized, locale]);

  const total = normalized?.total ?? 0;
  const successRate = total > 0
    ? Math.round(((normalized?.stats?.closedWon ?? 0) / total) * 100)
    : 0;

  const isLoading = leadsLoading || reviewsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
            <EditableText tKey="dashboard.statistics.title">{t('title')}</EditableText>
          </h1>
        </div>

        {/* ── Stats cards ────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-2 text-sm font-medium text-gray-600 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.totalLeads">{t('totalLeads')}</EditableText>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground">
                  {total}
                </div>
              </div>

              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-2 text-sm font-medium text-gray-600 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.leadsThisMonth">{t('leadsThisMonth')}</EditableText>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground">
                  {normalized?.newThisMonth ?? 0}
                </div>
              </div>

              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-2 text-sm font-medium text-gray-600 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.successRate">{t('successRate')}</EditableText>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground">
                  {successRate}%
                </div>
              </div>

              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-2 text-sm font-medium text-gray-600 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.averageRating">{t('averageRating')}</EditableText>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-foreground">
                    {reviewStats.average || '—'}
                  </span>
                  {reviewStats.average > 0 && (
                    <span className="text-xl text-yellow-400">&#9733;</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Two-column section: Status + Reviews ───────── */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Lead status breakdown */}
          {isLoading ? (
            <SectionSkeleton />
          ) : (
            <div className="rounded-lg border bg-white dark:bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-foreground">
                <EditableText tKey="dashboard.statistics.leadsByStatus">{t('leadsByStatus')}</EditableText>
              </h2>
              {total === 0 ? (
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.noData">{t('noData')}</EditableText>
                </p>
              ) : (
                <div className="space-y-4">
                  {STATUS_CONFIG.map(({ key, tKey, color }) => {
                    const count = normalized?.stats?.[key] ?? 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {tStatus(tKey)}
                          </span>
                          <span className="text-gray-500 dark:text-muted-foreground">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-muted">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Review distribution */}
          {isLoading ? (
            <SectionSkeleton />
          ) : (
            <div className="rounded-lg border bg-white dark:bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-foreground">
                <EditableText tKey="dashboard.statistics.reviewDistribution">{t('reviewDistribution')}</EditableText>
              </h2>
              {reviewStats.total === 0 ? (
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  <EditableText tKey="dashboard.statistics.noData">{t('noData')}</EditableText>
                </p>
              ) : (
                <>
                  {/* Average prominently */}
                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-foreground">
                      {reviewStats.average}
                    </span>
                    <span className="text-2xl text-yellow-400">&#9733;</span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-muted-foreground">
                      {t('reviews', { count: reviewStats.total })}
                    </span>
                  </div>

                  {/* 5-star down to 1-star */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewStats.distribution[star - 1];
                      const pct =
                        reviewStats.total > 0
                          ? Math.round((count / reviewStats.total) * 100)
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                            {star} &#9733;
                          </span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-muted">
                            <div
                              className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-sm text-gray-500 dark:text-muted-foreground">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Monthly trend ──────────────────────────────── */}
        {isLoading ? (
          <SectionSkeleton />
        ) : (
          <div className="rounded-lg border bg-white dark:bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-foreground">
              <EditableText tKey="dashboard.statistics.monthlyTrend">{t('monthlyTrend')}</EditableText>
            </h2>
            {total === 0 ? (
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                <EditableText tKey="dashboard.statistics.noData">{t('noData')}</EditableText>
              </p>
            ) : (
              <div className="flex items-end gap-4">
                {monthlyTrend.map(({ key, label, count, pct }) => (
                  <div key={key} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                      {count}
                    </span>
                    <div className="relative w-full" style={{ height: '160px' }}>
                      <div
                        className="absolute bottom-0 w-full rounded-t-md bg-blue-500 transition-all duration-500"
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-muted-foreground capitalize">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

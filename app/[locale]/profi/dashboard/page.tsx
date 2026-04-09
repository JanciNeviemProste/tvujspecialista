'use client';

import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import { useMyLeads } from '@/lib/hooks/useMyLeads';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';
import { specialistsApi } from '@/lib/api/specialists';
import { adminApi } from '@/lib/api/admin';
import React, { useMemo, useCallback } from 'react';
import { BookOpen, MessageSquare, Calendar, Users, Shield, TrendingUp, CreditCard, Crown, Home, Landmark, GraduationCap } from 'lucide-react';
import type { Lead } from '@/types/lead';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { EditableText } from '@/components/editor/EditableText';

export default function DashboardPage() {
  const t = useTranslations('dashboard.main');
  const tStatus = useTranslations('common.status');
  const tActions = useTranslations('common.actions');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: leadsData, isLoading: leadsLoading } = useMyLeads();
  const { data: subscription } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: () => paymentsApi.getMySubscription().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
  const { data: specialistProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['mySpecialistProfile'],
    queryFn: () => specialistsApi.getMyProfile().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  });
  const { data: adminStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats().then((res) => res.data),
    enabled: user?.role === 'admin',
  });

  // Normalize leads response — handles both raw array and structured object
  const normalizedLeads = React.useMemo(() => {
    if (!leadsData) return null;
    if (Array.isArray(leadsData)) {
      const leads = leadsData as Lead[];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      return {
        leads,
        total: leads.length,
        newThisMonth: leads.filter(l => new Date(l.createdAt) >= monthStart).length,
        stats: {
          new: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status === 'contacted').length,
          qualified: leads.filter(l => l.status === 'qualified').length,
          closedWon: leads.filter(l => l.status === 'closed_won').length,
          closedLost: leads.filter(l => l.status === 'closed_lost').length,
        },
      };
    }
    return leadsData;
  }, [leadsData]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <p className="text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.loading">{t('loading')}</EditableText></p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  // Show onboarding wizard for specialists who haven't completed onboarding
  // Don't show onboarding while profile is still loading
  if (!isProfileLoading && specialistProfile && specialistProfile.onboardingCompleted === false && user.role !== 'admin') {
    return <OnboardingWizard onComplete={() => window.location.reload()} />;
  }

  const isAdmin = user.role === 'admin';

  const stats = useMemo(() => ({
    newLeads: normalizedLeads?.newThisMonth ?? 0,
    totalLeads: normalizedLeads?.total || 0,
    rating: specialistProfile?.rating ?? 0,
    successRate: normalizedLeads?.total
      ? Math.round(((normalizedLeads?.stats?.closedWon || 0) / normalizedLeads.total) * 100)
      : 0,
  }), [normalizedLeads, specialistProfile?.rating]);

  const getStatusBadge = useCallback((status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: tStatus('new'), className: 'bg-blue-100 text-blue-700' },
      contacted: { label: tStatus('contacted'), className: 'bg-yellow-100 text-yellow-700' },
      qualified: { label: tStatus('qualified'), className: 'bg-purple-100 text-purple-700' },
      closed_won: { label: tStatus('closedWon'), className: 'bg-green-100 text-green-700' },
      closed_lost: { label: tStatus('closedLost'), className: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || statusMap.new;
  }, [tStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{t('welcome', { name: user.name })}</h1>
          <p className="text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.overview">{t('overview')}</EditableText></p>
        </div>

        {/* Stats Cards - only for specialists */}
        {!isAdmin && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {leadsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border bg-white dark:bg-card p-6 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded mb-4" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-muted rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.stats.newLeads">{t('stats.newLeads')}</EditableText></span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                      <EditableText tKey="dashboard.main.stats.thisMonth">{t('stats.thisMonth')}</EditableText>
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.newLeads}</div>
                  <p className="mt-2 text-sm text-gray-500">
                    {subscription && subscription.tier && (
                      t('stats.remaining', { count: subscription.tier === 'premium' ? '∞' : String(subscription.remainingLeads || 0) })
                    )}
                  </p>
                </div>

                <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.stats.totalLeads">{t('stats.totalLeads')}</EditableText></div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</div>
                  <p className="mt-2 text-sm text-gray-500"><EditableText tKey="dashboard.main.stats.sinceStart">{t('stats.sinceStart')}</EditableText></p>
                </div>

                <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.stats.avgRating">{t('stats.avgRating')}</EditableText></div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rating}</div>
                    <div className="text-xl text-yellow-400">★</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500"><EditableText tKey="dashboard.main.stats.yourRating">{t('stats.yourRating')}</EditableText></p>
                </div>

                <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.stats.successRate">{t('stats.successRate')}</EditableText></div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.successRate}%</div>
                  <p className="mt-2 text-sm text-gray-500"><EditableText tKey="dashboard.main.stats.closedDeals">{t('stats.closedDeals')}</EditableText></p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin Panel - inline */}
        {isAdmin && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.customers">{t('admin.customers')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.customersCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Home className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.realEstateAgents">{t('admin.realEstateAgents')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.realEstateAgentsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Landmark className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.financialAdvisors">{t('admin.financialAdvisors')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.financialAdvisorsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.leads">{t('admin.leads')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.leadsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.academyGraduates">{t('admin.academyGraduates')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.academyGraduatesCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.pastEvents">{t('admin.pastEvents')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.pastEventsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.monthlySubscriptions">{t('admin.monthlySubscriptions')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.monthlySubscriptions ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.yearlySubscriptions">{t('admin.yearlySubscriptions')}</EditableText></span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.yearlySubscriptions ?? 0}</div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4"><EditableText tKey="dashboard.main.admin.contentManagement">{t('admin.contentManagement')}</EditableText></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/profi/dashboard/admin/kurzy"
                className="rounded-xl border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1"><EditableText tKey="dashboard.main.admin.academy">{t('admin.academy')}</EditableText></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.academyDesc">{t('admin.academyDesc')}</EditableText></p>
              </Link>
              <Link
                href="/profi/dashboard/admin/forum"
                className="rounded-xl border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <MessageSquare className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1"><EditableText tKey="dashboard.main.admin.forum">{t('admin.forum')}</EditableText></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.forumDesc">{t('admin.forumDesc')}</EditableText></p>
              </Link>
              <Link
                href="/profi/dashboard/admin/komunita"
                className="rounded-xl border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <Calendar className="h-8 w-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1"><EditableText tKey="dashboard.main.admin.community">{t('admin.community')}</EditableText></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.communityDesc">{t('admin.communityDesc')}</EditableText></p>
              </Link>
              <Link
                href="/profi/dashboard/admin/pouzivatelia"
                className="rounded-xl border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <Users className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1"><EditableText tKey="dashboard.main.admin.users">{t('admin.users')}</EditableText></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.main.admin.usersDesc">{t('admin.usersDesc')}</EditableText></p>
              </Link>
            </div>
          </>
        )}

        {/* Specialist sections */}
        {!isAdmin && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Leads */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white dark:bg-card">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white"><EditableText tKey="dashboard.main.recentLeads">{t('recentLeads')}</EditableText></h2>
                    <Link href="/profi/dashboard/deals" className="text-sm font-medium text-blue-600 hover:underline">
                      <EditableText tKey="common.actions.showAll">{tActions('showAll')}</EditableText>
                    </Link>
                  </div>
                </div>

                {leadsLoading ? (
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 animate-pulse">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-muted rounded" />
                            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-40 bg-gray-100 dark:bg-gray-700 rounded" />
                          </div>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-muted rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : normalizedLeads && normalizedLeads.leads && normalizedLeads.leads.length > 0 ? (
                  <div className="divide-y">
                    {normalizedLeads.leads.slice(0, 5).map((lead: Lead) => {
                      const statusInfo = getStatusBadge(lead.status);
                      const isNew = lead.status === 'new';
                      return (
                        <div key={lead.id} className="p-6 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-gray-900 dark:text-foreground ${isNew ? 'blur-sm select-none' : ''}`}>{lead.customerName}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(lead.createdAt).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ')}
                              </p>
                              <div className={isNew ? 'blur-sm select-none' : ''}>
                                <p className="mt-1 text-sm text-gray-600 dark:text-muted-foreground">{lead.customerEmail}</p>
                                <p className="text-sm text-gray-600 dark:text-muted-foreground">{lead.customerPhone}</p>
                              </div>
                              {lead.message && (
                                <p className="mt-2 text-sm text-gray-700 dark:text-muted-foreground">
                                  &quot;{lead.message.substring(0, 100)}
                                  {lead.message.length > 100 ? '...' : ''}&quot;
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="mb-4 text-5xl">📭</div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white"><EditableText tKey="dashboard.main.emptyLeads.title">{t('emptyLeads.title')}</EditableText></h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      <EditableText tKey="dashboard.main.emptyLeads.description">{t('emptyLeads.description')}</EditableText>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-white dark:bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white"><EditableText tKey="dashboard.main.quickActions.title">{t('quickActions.title')}</EditableText></h2>
                <div className="space-y-3">
                  <Link
                    href="/profi/dashboard/deals"
                    className="block rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-800"
                  >
                    🤝 <EditableText tKey="dashboard.main.quickActions.dealPipeline">{t('quickActions.dealPipeline')}</EditableText>
                  </Link>
                  <Link
                    href="/profi/dashboard/profil"
                    className="block rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-800"
                  >
                    📝 <EditableText tKey="dashboard.main.quickActions.editProfile">{t('quickActions.editProfile')}</EditableText>
                  </Link>
                  <Link
                    href="/profi/dashboard/recenze"
                    className="block rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-800"
                  >
                    💬 <EditableText tKey="dashboard.main.quickActions.manageReviews">{t('quickActions.manageReviews')}</EditableText>
                  </Link>
                  <Link
                    href="/profi/dashboard/ceny"
                    className="block rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-800"
                  >
                    💳 <EditableText tKey="dashboard.main.quickActions.upgradePlan">{t('quickActions.upgradePlan')}</EditableText>
                  </Link>
                </div>
              </div>

              {/* Subscription Status */}
              {subscription && (
                <div className="mt-6 rounded-lg border bg-blue-50 p-6">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    {t('subscription.yourPlan', { plan: subscription.tier === 'basic' ? 'Basic' : subscription.tier === 'pro' ? 'Pro' : 'Premium' })}
                  </h3>
                  <p className="mb-4 text-sm text-blue-700">
                    {subscription.tier === 'premium' ? (
                      t('subscription.unlimitedLeads')
                    ) : (
                      t('subscription.remainingLeads', { count: subscription.remainingLeads || 0 })
                    )}
                  </p>
                  {subscription.tier !== 'premium' && (
                    <button
                      onClick={async () => {
                        const { data } = await paymentsApi.createCheckout('premium');
                        window.location.href = data.checkoutUrl;
                      }}
                      className="block w-full rounded-md bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <EditableText tKey="dashboard.main.subscription.upgrade">{t('subscription.upgrade')}</EditableText>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

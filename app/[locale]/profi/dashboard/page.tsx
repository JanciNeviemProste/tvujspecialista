'use client';

import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useMyLeads } from '@/lib/hooks/useMyLeads';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';
import { specialistsApi } from '@/lib/api/specialists';
import { adminApi } from '@/lib/api/admin';
import React from 'react';
import { BookOpen, MessageSquare, Calendar, Users, Shield, TrendingUp, CreditCard, Crown, Home, Landmark } from 'lucide-react';
import type { Lead } from '@/types/lead';

export default function DashboardPage() {
  const t = useTranslations('dashboard.main');
  const tStatus = useTranslations('common.status');
  const tActions = useTranslations('common.actions');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: leadsData, isLoading: leadsLoading } = useMyLeads();
  const { data: subscription } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: () => paymentsApi.getMySubscription().then((res) => res.data),
  });
  const { data: specialistProfile } = useQuery({
    queryKey: ['mySpecialistProfile'],
    queryFn: () => specialistsApi.getMyProfile().then((res) => res.data),
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
      return {
        leads,
        total: leads.length,
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const isAdmin = user.role === 'admin';

  const stats = {
    newLeads: normalizedLeads?.stats?.new || 0,
    totalLeads: normalizedLeads?.total || 0,
    rating: specialistProfile?.rating ?? 0,
    successRate: normalizedLeads?.total
      ? Math.round(((normalizedLeads?.stats?.closedWon || 0) / normalizedLeads.total) * 100)
      : 0,
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: tStatus('new'), className: 'bg-blue-100 text-blue-700' },
      contacted: { label: tStatus('contacted'), className: 'bg-yellow-100 text-yellow-700' },
      qualified: { label: tStatus('qualified'), className: 'bg-purple-100 text-purple-700' },
      closed_won: { label: tStatus('closedWon'), className: 'bg-green-100 text-green-700' },
      closed_lost: { label: tStatus('closedLost'), className: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || statusMap.new;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('welcome', { name: user.name })}</h1>
          <p className="text-gray-600">{t('overview')}</p>
        </div>

        {/* Stats Cards - only for specialists */}
        {!isAdmin && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {leadsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border bg-white p-6 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                    <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="rounded-lg border bg-white p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{t('stats.newLeads')}</span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                      {t('stats.thisMonth')}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.newLeads}</div>
                  <p className="mt-2 text-sm text-gray-500">
                    {subscription && subscription.tier && (
                      t('stats.remaining', { count: subscription.tier === 'premium' ? '∞' : String(subscription.remainingLeads || 0) })
                    )}
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-6">
                  <div className="mb-2 text-sm font-medium text-gray-600">{t('stats.totalLeads')}</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalLeads}</div>
                  <p className="mt-2 text-sm text-gray-500">{t('stats.sinceStart')}</p>
                </div>

                <div className="rounded-lg border bg-white p-6">
                  <div className="mb-2 text-sm font-medium text-gray-600">{t('stats.avgRating')}</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-gray-900">{stats.rating}</div>
                    <div className="text-xl text-yellow-400">★</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{t('stats.yourRating')}</p>
                </div>

                <div className="rounded-lg border bg-white p-6">
                  <div className="mb-2 text-sm font-medium text-gray-600">{t('stats.successRate')}</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.successRate}%</div>
                  <p className="mt-2 text-sm text-gray-500">{t('stats.closedDeals')}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin Panel - inline */}
        {isAdmin && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.customers')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.customersCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Home className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.realEstateAgents')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.realEstateAgentsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Landmark className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.financialAdvisors')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.financialAdvisorsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.leads')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.leadsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.pastEvents')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.pastEventsCount ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.monthlySubscriptions')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.monthlySubscriptions ?? 0}</div>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium text-gray-600">{t('admin.yearlySubscriptions')}</span>
                </div>
                <div className="text-3xl font-bold">{adminStats?.yearlySubscriptions ?? 0}</div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">{t('admin.contentManagement')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/profi/dashboard/admin/kurzy"
                className="rounded-lg border bg-white p-6 hover:shadow-md transition-shadow group"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1">{t('admin.academy')}</h3>
                <p className="text-sm text-gray-600">{t('admin.academyDesc')}</p>
              </Link>
              <Link
                href="/profi/dashboard/admin/forum"
                className="rounded-lg border bg-white p-6 hover:shadow-md transition-shadow group"
              >
                <MessageSquare className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1">{t('admin.forum')}</h3>
                <p className="text-sm text-gray-600">{t('admin.forumDesc')}</p>
              </Link>
              <Link
                href="/profi/dashboard/admin/komunita"
                className="rounded-lg border bg-white p-6 hover:shadow-md transition-shadow group"
              >
                <Calendar className="h-8 w-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1">{t('admin.community')}</h3>
                <p className="text-sm text-gray-600">{t('admin.communityDesc')}</p>
              </Link>
            </div>
          </>
        )}

        {/* Specialist sections */}
        {!isAdmin && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Leads */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{t('recentLeads')}</h2>
                    <Link href="/profi/dashboard/deals" className="text-sm font-medium text-blue-600 hover:underline">
                      {tActions('showAll')}
                    </Link>
                  </div>
                </div>

                {leadsLoading ? (
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 animate-pulse">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                            <div className="h-3 w-40 bg-gray-100 rounded" />
                          </div>
                          <div className="h-6 w-16 bg-gray-200 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : normalizedLeads && normalizedLeads.leads && normalizedLeads.leads.length > 0 ? (
                  <div className="divide-y">
                    {normalizedLeads.leads.slice(0, 5).map((lead: Lead) => {
                      const statusInfo = getStatusBadge(lead.status);
                      return (
                        <div key={lead.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{lead.customerName}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(lead.createdAt).toLocaleDateString('cs-CZ')}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">{lead.customerEmail}</p>
                              <p className="text-sm text-gray-600">{lead.customerPhone}</p>
                              {lead.message && (
                                <p className="mt-2 text-sm text-gray-700">
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
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('emptyLeads.title')}</h3>
                    <p className="text-gray-600">
                      {t('emptyLeads.description')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('quickActions.title')}</h2>
                <div className="space-y-3">
                  <a
                    href="/profi/dashboard/deals"
                    className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    🤝 {t('quickActions.dealPipeline')}
                  </a>
                  <a
                    href="/profi/dashboard/commissions"
                    className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    💰 {t('quickActions.commissions')}
                  </a>
                  <a
                    href="/profi/dashboard/profil"
                    className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    📝 {t('quickActions.editProfile')}
                  </a>
                  <a
                    href="/profi/dashboard/recenze"
                    className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    💬 {t('quickActions.manageReviews')}
                  </a>
                  <a
                    href="/ceny"
                    className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    💳 {t('quickActions.upgradePlan')}
                  </a>
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
                      {t('subscription.upgrade')}
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

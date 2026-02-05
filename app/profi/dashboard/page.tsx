'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyLeads } from '@/lib/hooks/useMyLeads';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';
import { leadsApi } from '@/lib/api/leads';
import type { Lead } from '@/types/lead';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { data: leadsData, isLoading: leadsLoading } = useMyLeads();
  const { data: subscription } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: () => paymentsApi.getMySubscription().then((res) => res.data),
  });

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await leadsApi.updateStatus(leadId, newStatus as any);
      // React Query will automatically refetch
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  if (authLoading || leadsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              tvujspecialista.cz
            </a>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <p className="text-gray-600">Načítání...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const stats = {
    newLeads: leadsData?.stats?.new || 0,
    totalLeads: leadsData?.total || 0,
    rating: 4.8, // This should come from specialist profile
    successRate: 72, // This should be calculated from leads
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      NEW: { label: 'Nový', className: 'bg-blue-100 text-blue-700' },
      CONTACTED: { label: 'Kontaktován', className: 'bg-yellow-100 text-yellow-700' },
      QUALIFIED: { label: 'Kvalifikován', className: 'bg-purple-100 text-purple-700' },
      CLOSED_WON: { label: 'Uzavřeno', className: 'bg-green-100 text-green-700' },
      CLOSED_LOST: { label: 'Ztraceno', className: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || statusMap.NEW;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/profi/dashboard" className="text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Odhlásit se
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Vítejte zpět, {user.name}!</h1>
          <p className="text-gray-600">Zde je přehled vaší aktivity</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nové leady</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                Tento měsíc
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.newLeads}</div>
            <p className="mt-2 text-sm text-gray-500">
              {subscription && subscription.tier && (
                <>
                  Zbývá{' '}
                  {subscription.tier === 'premium'
                    ? '∞'
                    : subscription.remainingLeads || 0}{' '}
                  leadů
                </>
              )}
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Celkem leadů</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalLeads}</div>
            <p className="mt-2 text-sm text-gray-500">Od začátku spolupráce</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Průměrné hodnocení</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">{stats.rating}</div>
              <div className="text-xl text-yellow-400">★</div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Vaše hodnocení</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Úspěšnost</div>
            <div className="text-3xl font-bold text-gray-900">{stats.successRate}%</div>
            <p className="mt-2 text-sm text-gray-500">Úspěšně uzavřené leady</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white">
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Poslední leady</h2>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                    Zobrazit vše
                  </a>
                </div>
              </div>

              {leadsData && leadsData.leads && leadsData.leads.length > 0 ? (
                <div className="divide-y">
                  {leadsData.leads.slice(0, 5).map((lead: Lead) => {
                    const statusInfo = getStatusBadge(lead.status);
                    return (
                      <div key={lead.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{lead.customerName}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(lead.createdAt).toLocaleDateString('cs-CZ')}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">{lead.email}</p>
                            <p className="text-sm text-gray-600">{lead.phone}</p>
                            {lead.message && (
                              <p className="mt-2 text-sm text-gray-700">
                                "{lead.message.substring(0, 100)}
                                {lead.message.length > 100 ? '...' : ''}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                            >
                              {statusInfo.label}
                            </span>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                            >
                              <option value="NEW">Nový</option>
                              <option value="CONTACTED">Kontaktován</option>
                              <option value="QUALIFIED">Kvalifikován</option>
                              <option value="CLOSED_WON">Uzavřeno</option>
                              <option value="CLOSED_LOST">Ztraceno</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="mb-4 text-5xl">📭</div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Zatím žádné leady</h3>
                  <p className="text-gray-600">
                    Jakmile dostanete první poptávku, zobrazí se zde.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Rychlé akce</h2>
              <div className="space-y-3">
                <a
                  href="/profi/dashboard/deals"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  🤝 Deal Pipeline
                </a>
                <a
                  href="/profi/dashboard/commissions"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  💰 Provízie
                </a>
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  📝 Upravit profil
                </a>
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  💬 Správa recenzí
                </a>
                <a
                  href="/ceny"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  💳 Upgrade plánu
                </a>
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  📊 Statistiky
                </a>
              </div>
            </div>

            {/* Subscription Status */}
            {subscription && (
              <div className="mt-6 rounded-lg border bg-blue-50 p-6">
                <h3 className="mb-2 font-semibold text-blue-900">
                  Váš plán: {subscription.tier === 'basic' ? 'Basic' : subscription.tier === 'pro' ? 'Pro' : 'Premium'}
                </h3>
                <p className="mb-4 text-sm text-blue-700">
                  {subscription.tier === 'premium' ? (
                    'Neomezené leady'
                  ) : (
                    <>
                      Zbývá {subscription.remainingLeads || 0} leadů do konce měsíce
                    </>
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
                    Upgradovat na Premium
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

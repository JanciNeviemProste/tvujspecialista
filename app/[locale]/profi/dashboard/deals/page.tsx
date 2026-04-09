'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useMyDeals, useUpdateDealStatus } from '@/lib/hooks/useDeals';
import { Deal, DealStatus, DealFilters as DealFiltersType } from '@/types/deals';
import { DealKanban } from '@/components/deals/DealKanban';
import { DealCard } from '@/components/deals/DealCard';
import { DealFilters } from '@/components/deals/DealFilters';
import { KanbanSkeleton, DealCardSkeleton } from '@/components/deals/LoadingStates';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { EditableText } from '@/components/editor/EditableText';

const DealDetailModal = dynamic(
  () => import('@/components/deals/DealDetailModal').then(mod => mod.DealDetailModal),
  { ssr: false }
);

type ViewMode = 'kanban' | 'list';

export default function DealsPage() {
  const t = useTranslations('dashboard.deals');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: deals, isLoading: dealsLoading } = useMyDeals();
  const updateStatus = useUpdateDealStatus();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<DealFiltersType>({
    search: '',
    status: 'all',
  });

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals?.filter((deal) => {
      const matchesSearch =
        deal.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        deal.customerEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        deal.customerPhone.includes(filters.search);

      const matchesStatus = filters.status === 'all' || deal.status === filters.status;

      return matchesSearch && matchesStatus;
    }) || [];
  }, [deals, filters]);

  // Stats
  const stats = useMemo(() => ({
    total: filteredDeals.length,
    new: filteredDeals.filter((d) => d.status === DealStatus.NEW).length,
    accepted: filteredDeals.filter((d) => d.status !== DealStatus.NEW).length,
  }), [filteredDeals]);

  // Handlers
  const handleStatusChange = useCallback((deal: Deal, newStatus: DealStatus) => {
    updateStatus.mutate({ id: deal.id, data: { status: newStatus } });
  }, [updateStatus]);

  const handleViewDetails = useCallback((deal: Deal) => {
    setSelectedDeal(deal);
    setDetailModalOpen(true);
  }, []);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  // Loading state
  if (authLoading || dealsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-muted rounded animate-pulse" />
          </div>
          {viewMode === 'kanban' ? <KanbanSkeleton /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <DealCardSkeleton key={i} />)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2"><EditableText tKey="dashboard.deals.title">{t('title')}</EditableText></h1>
          <p className="text-gray-500"><EditableText tKey="dashboard.deals.subtitle">{t('subtitle')}</EditableText></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card">
            <p className="text-sm text-gray-500"><EditableText tKey="dashboard.deals.stats.total">{t('stats.total')}</EditableText></p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card">
            <p className="text-sm text-gray-500"><EditableText tKey="dashboard.deals.stats.new">{t('stats.new')}</EditableText></p>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card">
            <p className="text-sm text-gray-500"><EditableText tKey="dashboard.deals.stats.accepted">{t('stats.accepted')}</EditableText></p>
            <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
          </div>
        </div>

        {/* Filters & View toggle */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="flex-1">
            <DealFilters
              filters={filters}
              onFiltersChange={setFilters}
              deals={deals || []}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2"><EditableText tKey="dashboard.deals.empty.title">{t('empty.title')}</EditableText></h3>
            <p className="text-gray-500">
              {filters.search || filters.status !== 'all'
                ? t('empty.tryFilters')
                : t('empty.noDeals')}
            </p>
          </div>
        ) : viewMode === 'kanban' ? (
          <DealKanban
            deals={filteredDeals}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedDeal(null);
        }}
        onChangeStatus={handleStatusChange}
      />
    </div>
  );
}

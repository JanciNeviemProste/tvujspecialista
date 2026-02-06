'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyDeals, useUpdateDealStatus, useUpdateDealValue, useCloseDeal, useReopenDeal, useDealAnalytics } from '@/lib/hooks/useDeals';
import { Deal, DealStatus, DealFilters as DealFiltersType } from '@/types/deals';
import { DealKanban } from '@/components/deals/DealKanban';
import { DealCard } from '@/components/deals/DealCard';
import { DealValueModal } from '@/components/deals/DealValueModal';
import { CloseDealModal } from '@/components/deals/CloseDealModal';
import { DealFilters } from '@/components/deals/DealFilters';
import { KanbanSkeleton, DealCardSkeleton, DealAnalyticsSkeleton } from '@/components/deals/LoadingStates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, List, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { exportDealsToCSV } from '@/lib/utils/exportDeals';
import { getErrorMessage } from '@/lib/utils/error';
import { measureExportPerformance } from '@/lib/utils/performance';

// Dynamic imports for code splitting
const DealAnalytics = dynamic(
  () => import('@/components/deals/DealAnalytics').then(mod => mod.DealAnalytics),
  {
    loading: () => <DealAnalyticsSkeleton />,
    ssr: false,
  }
);

const DealDetailModal = dynamic(
  () => import('@/components/deals/DealDetailModal').then(mod => mod.DealDetailModal),
  {
    ssr: false,
  }
);

type ViewMode = 'kanban' | 'list';

export default function DealsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: deals, isLoading: dealsLoading } = useMyDeals();
  const { data: analytics, isLoading: analyticsLoading } = useDealAnalytics();
  const updateStatus = useUpdateDealStatus();
  const updateValue = useUpdateDealValue();
  const closeDeal = useCloseDeal();
  const reopenDeal = useReopenDeal();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<DealFiltersType>({
    search: '',
    status: 'all',
    valueRange: [0, 100000],
    dateRange: { from: null, to: null },
    dateType: 'created',
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Modal states
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Update max value after deals load
  React.useEffect(() => {
    if (deals && deals.length > 0) {
      const maxValue = Math.max(
        ...deals.filter((d) => d.dealValue).map((d) => d.dealValue!),
        10000
      );
      setFilters((prev) => ({
        ...prev,
        valueRange: [0, maxValue],
      }));
    }
  }, [deals]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  // Loading state
  if (authLoading || dealsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
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

  // Filter deals with memoization
  const filteredDeals = useMemo(() => {
    return deals?.filter((deal) => {
      // Search filter
      const matchesSearch =
        deal.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        deal.customerEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        deal.customerPhone.includes(filters.search);

      // Status filter
      const matchesStatus = filters.status === 'all' || deal.status === filters.status;

      // Value range filter
      const dealValue = deal.dealValue || 0;
      const matchesValue =
        dealValue >= filters.valueRange[0] && dealValue <= filters.valueRange[1];

      // Date range filter
      let matchesDate = true;
      if (filters.dateRange.from || filters.dateRange.to) {
        const dateToCheck =
          filters.dateType === 'created'
            ? new Date(deal.createdAt)
            : deal.estimatedCloseDate
            ? new Date(deal.estimatedCloseDate)
            : null;

        if (dateToCheck) {
          if (filters.dateRange.from) {
            const fromDate = new Date(filters.dateRange.from);
            matchesDate = matchesDate && dateToCheck >= fromDate;
          }
          if (filters.dateRange.to) {
            const toDate = new Date(filters.dateRange.to);
            toDate.setHours(23, 59, 59, 999); // End of day
            matchesDate = matchesDate && dateToCheck <= toDate;
          }
        } else if (filters.dateType === 'estimatedClose') {
          matchesDate = false; // No estimated close date
        }
      }

      return matchesSearch && matchesStatus && matchesValue && matchesDate;
    }) || [];
  }, [deals, filters]);

  // Handlers with useCallback
  const handleStatusChange = useCallback((deal: Deal) => {
    setSelectedDeal(deal);
    if (deal.status === DealStatus.IN_PROGRESS) {
      setCloseModalOpen(true);
    } else {
      // Show value modal for other statuses
      setValueModalOpen(true);
    }
  }, []);

  const handleViewDetails = useCallback((deal: Deal) => {
    setSelectedDeal(deal);
    setDetailModalOpen(true);
  }, []);

  const handleValueSubmit = useCallback(async (dealId: string, data: { dealValue: number; estimatedCloseDate: string }) => {
    try {
      await updateValue.mutateAsync({ id: dealId, data });
      toast.success('Hodnota dealu bola úspešne nastavená');
      setValueModalOpen(false);
      setSelectedDeal(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  }, [updateValue]);

  const handleCloseDeal = useCallback(async (
    dealId: string,
    data: { status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST; actualDealValue?: number }
  ) => {
    try {
      await closeDeal.mutateAsync({ id: dealId, data });
      toast.success(
        data.status === DealStatus.CLOSED_WON
          ? 'Deal bol úspešne uzavretý! Provízia bola vytvorená.'
          : 'Deal bol označený ako stratený.'
      );
      setCloseModalOpen(false);
      setSelectedDeal(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  }, [closeDeal]);

  const handleExport = useCallback(async () => {
    await measureExportPerformance('CSV', () => {
      exportDealsToCSV(filteredDeals);
    }, { dealsCount: filteredDeals.length });
    toast.success(`Exportovaných ${filteredDeals.length} dealov`);
  }, [filteredDeals]);

  // Stats with memoization
  const stats = useMemo(() => ({
    total: filteredDeals.length,
    new: filteredDeals.filter((d) => d.status === DealStatus.NEW).length,
    inProgress: filteredDeals.filter((d) => d.status === DealStatus.IN_PROGRESS).length,
    won: filteredDeals.filter((d) => d.status === DealStatus.CLOSED_WON).length,
    totalValue: filteredDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0),
  }), [filteredDeals]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deal Pipeline</h1>
          <p className="text-muted-foreground">Spravujte svoje obchodné príležitosti</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Celkom</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Nové</p>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">V procese</p>
            <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Získané</p>
            <p className="text-2xl font-bold text-green-600">{stats.won}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Hodnota</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(stats.totalValue)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <DealFilters
          filters={filters}
          onFiltersChange={setFilters}
          deals={deals || []}
        />

        {/* Analytics Toggle & Export */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="gap-2"
          >
            {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showAnalytics ? 'Skryť analytiku' : 'Zobraziť analytiku'}
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredDeals.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportovať CSV
          </Button>

          {/* View toggle */}
          <div className="flex gap-2 ml-auto">
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

        {/* Analytics Section */}
        {showAnalytics && (
          <DealAnalytics
            analytics={analytics || null}
            isLoading={analyticsLoading}
            className="mb-6"
          />
        )}

        {/* Content */}
        {filteredDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">Žiadne dealy</h3>
            <p className="text-muted-foreground">
              {filters.search || filters.status !== 'all' || filters.dateRange.from || filters.dateRange.to
                ? 'Skúste zmeniť filtre'
                : 'Zatiaľ nemáte žiadne obchodné príležitosti'}
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

      {/* Modals */}
      <DealValueModal
        deal={selectedDeal}
        isOpen={valueModalOpen}
        onClose={() => {
          setValueModalOpen(false);
          setSelectedDeal(null);
        }}
        onSubmit={handleValueSubmit}
        isLoading={updateValue.isPending}
      />

      <CloseDealModal
        deal={selectedDeal}
        isOpen={closeModalOpen}
        onClose={() => {
          setCloseModalOpen(false);
          setSelectedDeal(null);
        }}
        onSubmit={handleCloseDeal}
        isLoading={closeDeal.isPending}
      />

      <DealDetailModal
        deal={selectedDeal}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedDeal(null);
        }}
        onEditValue={(deal) => {
          setSelectedDeal(deal);
          setValueModalOpen(true);
        }}
        onCloseDeal={(deal) => {
          setSelectedDeal(deal);
          setCloseModalOpen(true);
        }}
        onReopen={(deal) => {
          reopenDeal.mutate(deal.id);
        }}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyDeals, useUpdateDealStatus, useUpdateDealValue, useCloseDeal, useReopenDeal } from '@/lib/hooks/useDeals';
import { Deal, DealStatus } from '@/types/deals';
import { DealKanban } from '@/components/deals/DealKanban';
import { DealCard } from '@/components/deals/DealCard';
import { DealValueModal } from '@/components/deals/DealValueModal';
import { CloseDealModal } from '@/components/deals/CloseDealModal';
import { DealDetailModal } from '@/components/deals/DealDetailModal';
import { KanbanSkeleton, DealCardSkeleton } from '@/components/deals/LoadingStates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, List, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

type ViewMode = 'kanban' | 'list';

export default function DealsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: deals, isLoading: dealsLoading } = useMyDeals();
  const updateStatus = useUpdateDealStatus();
  const updateValue = useUpdateDealValue();
  const closeDeal = useCloseDeal();
  const reopenDeal = useReopenDeal();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all');

  // Modal states
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

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

  // Filter deals
  const filteredDeals = deals?.filter((deal) => {
    const matchesSearch =
      deal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Handlers
  const handleStatusChange = (deal: Deal) => {
    setSelectedDeal(deal);
    if (deal.status === DealStatus.IN_PROGRESS) {
      setCloseModalOpen(true);
    } else {
      // Show value modal for other statuses
      setValueModalOpen(true);
    }
  };

  const handleViewDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setDetailModalOpen(true);
  };

  const handleValueSubmit = async (dealId: string, data: { dealValue: number; estimatedCloseDate: string }) => {
    try {
      await updateValue.mutateAsync({ id: dealId, data });
      toast.success('Hodnota dealu bola úspešne nastavená');
      setValueModalOpen(false);
      setSelectedDeal(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Chyba pri nastavovaní hodnoty dealu');
    }
  };

  const handleCloseDeal = async (
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Chyba pri uzatváraní dealu');
    }
  };

  // Stats
  const stats = {
    total: filteredDeals.length,
    new: filteredDeals.filter((d) => d.status === DealStatus.NEW).length,
    inProgress: filteredDeals.filter((d) => d.status === DealStatus.IN_PROGRESS).length,
    won: filteredDeals.filter((d) => d.status === DealStatus.CLOSED_WON).length,
    totalValue: filteredDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0),
  };

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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Hľadať dealy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 rounded-lg border bg-card text-sm"
          >
            <option value="all">Všetky statusy</option>
            <option value={DealStatus.NEW}>Nový</option>
            <option value={DealStatus.CONTACTED}>Kontaktovaný</option>
            <option value={DealStatus.QUALIFIED}>Kvalifikovaný</option>
            <option value={DealStatus.IN_PROGRESS}>V procese</option>
            <option value={DealStatus.CLOSED_WON}>Získaný</option>
            <option value={DealStatus.CLOSED_LOST}>Stratený</option>
          </select>

          {/* View toggle */}
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
            <h3 className="text-xl font-semibold mb-2">Žiadne dealy</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
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

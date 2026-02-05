'use client';

import { Deal, DealStatus } from '@/types/deals';
import { DealCard } from './DealCard';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';

interface DealKanbanProps {
  deals: Deal[];
  onStatusChange?: (deal: Deal) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
}

const columns: { status: DealStatus; label: string; color: string }[] = [
  { status: DealStatus.NEW, label: 'Nový', color: 'bg-gray-100 dark:bg-gray-800' },
  { status: DealStatus.CONTACTED, label: 'Kontaktovaný', color: 'bg-blue-50 dark:bg-blue-950' },
  { status: DealStatus.QUALIFIED, label: 'Kvalifikovaný', color: 'bg-cyan-50 dark:bg-cyan-950' },
  { status: DealStatus.IN_PROGRESS, label: 'V procese', color: 'bg-orange-50 dark:bg-orange-950' },
  { status: DealStatus.CLOSED_WON, label: 'Získaný', color: 'bg-green-50 dark:bg-green-950' },
  { status: DealStatus.CLOSED_LOST, label: 'Stratený', color: 'bg-red-50 dark:bg-red-950' },
];

export function DealKanban({ deals, onStatusChange, onViewDetails, className }: DealKanbanProps) {
  const getDealsByStatus = (status: DealStatus) => {
    return deals.filter((deal) => deal.status === status);
  };

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => {
        const columnDeals = getDealsByStatus(column.status);
        const totalValue = columnDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);

        return (
          <div
            key={column.status}
            className={cn(
              'flex-shrink-0 w-80 rounded-lg p-4 space-y-4',
              column.color
            )}
          >
            {/* Column header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{column.label}</h3>
                <Badge variant="outline">{columnDeals.length}</Badge>
              </div>
              {totalValue > 0 && (
                <p className="text-sm text-muted-foreground">
                  Hodnota:{' '}
                  {new Intl.NumberFormat('sk-SK', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(totalValue)}
                </p>
              )}
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {columnDeals.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  Žiadne dealy
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onStatusChange={onStatusChange}
                    onViewDetails={onViewDetails}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

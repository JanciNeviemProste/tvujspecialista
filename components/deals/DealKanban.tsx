'use client';

import { Deal, DealStatus } from '@/types/deals';
import { DealCard } from './DealCard';
import { cn } from '@/lib/utils/cn';

interface DealKanbanProps {
  deals: Deal[];
  onStatusChange?: (deal: Deal) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
}

const columns: { status: DealStatus; label: string; bgColor: string; borderColor: string }[] = [
  { status: DealStatus.NEW, label: 'Nový', bgColor: 'bg-slate-50 dark:bg-slate-900/50', borderColor: 'border-t-slate-400' },
  { status: DealStatus.CONTACTED, label: 'Kontaktovaný', bgColor: 'bg-blue-50 dark:bg-blue-950/50', borderColor: 'border-t-blue-500' },
  { status: DealStatus.QUALIFIED, label: 'Kvalifikovaný', bgColor: 'bg-violet-50 dark:bg-violet-950/50', borderColor: 'border-t-violet-500' },
  { status: DealStatus.IN_PROGRESS, label: 'V procese', bgColor: 'bg-amber-50 dark:bg-amber-950/50', borderColor: 'border-t-amber-500' },
  { status: DealStatus.CLOSED_WON, label: 'Získaný', bgColor: 'bg-emerald-50 dark:bg-emerald-950/50', borderColor: 'border-t-emerald-500' },
  { status: DealStatus.CLOSED_LOST, label: 'Stratený', bgColor: 'bg-rose-50 dark:bg-rose-950/50', borderColor: 'border-t-rose-500' },
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
              'flex-shrink-0 w-80 rounded-lg border-t-4 p-4 space-y-4',
              column.bgColor,
              column.borderColor
            )}
          >
            {/* Column header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{column.label}</h3>
                <span className="inline-flex items-center rounded-full border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {columnDeals.length}
                </span>
              </div>
              {totalValue > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                <div className="flex items-center justify-center h-32 text-sm text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg">
                  Žiadne leady
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

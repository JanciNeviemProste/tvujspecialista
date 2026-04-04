'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { DealCard } from './DealCard';
import { cn } from '@/lib/utils/cn';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useDraggable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';

interface DealKanbanProps {
  deals: Deal[];
  onStatusChange?: (deal: Deal, newStatus: DealStatus) => void;
  onViewDetails?: (deal: Deal) => void;
  className?: string;
}

const columns: { status: DealStatus; labelKey: string; bgColor: string; borderColor: string }[] = [
  { status: DealStatus.NEW, labelKey: 'kanban.columnNew', bgColor: 'bg-slate-50', borderColor: 'border-t-slate-400' },
  { status: DealStatus.CONTACTED, labelKey: 'kanban.columnCrm', bgColor: 'bg-blue-50', borderColor: 'border-t-blue-500' },
];

// Draggable card wrapper
function DraggableDealCard({
  deal,
  onStatusChange,
  onViewDetails,
}: {
  deal: Deal;
  onStatusChange?: (deal: Deal, nextStatus: DealStatus) => void;
  onViewDetails?: (deal: Deal) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn('touch-none', isDragging && 'opacity-30')}
    >
      <DealCard
        deal={deal}
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}

// Droppable column wrapper
function DroppableColumn({
  status,
  label,
  bgColor,
  borderColor,
  dealCount,
  children,
}: {
  status: DealStatus;
  label: string;
  bgColor: string;
  borderColor: string;
  dealCount: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 min-w-[320px] rounded-lg border-t-4 p-4 space-y-4 transition-all',
        bgColor,
        borderColor,
        isOver && 'ring-2 ring-blue-500 ring-offset-2 scale-[1.01]'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{label}</h3>
        <span className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-card px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          {dealCount}
        </span>
      </div>

      {/* Cards area */}
      <div className="space-y-3 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}

/**
 * Maps any legacy status to one of the 2 pipeline columns.
 * NEW stays as NEW, everything else goes to CONTACTED ("Akceptovaný").
 */
function getColumnStatus(status: DealStatus): DealStatus {
  return status === DealStatus.NEW ? DealStatus.NEW : DealStatus.CONTACTED;
}

export function DealKanban({ deals, onStatusChange, onViewDetails, className }: DealKanbanProps) {
  const t = useTranslations('dashboard.deals');
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const getDealsByColumn = useCallback(
    (columnStatus: DealStatus) =>
      deals.filter((deal) => getColumnStatus(deal.status) === columnStatus),
    [deals]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const deal = deals.find((d) => d.id === event.active.id);
      setActiveDeal(deal || null);
    },
    [deals]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDeal(null);
      const { active, over } = event;
      if (!over) return;

      const dealId = active.id as string;
      const newStatus = over.id as DealStatus;
      const deal = deals.find((d) => d.id === dealId);

      if (!deal || getColumnStatus(deal.status) === newStatus) return;

      onStatusChange?.(deal, newStatus);
    },
    [deals, onStatusChange]
  );

  const handleDragCancel = useCallback(() => {
    setActiveDeal(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {columns.map((column) => {
          const columnDeals = getDealsByColumn(column.status);

          return (
            <DroppableColumn
              key={column.status}
              status={column.status}
              label={t(column.labelKey)}
              bgColor={column.bgColor}
              borderColor={column.borderColor}
              dealCount={columnDeals.length}
            >
              {columnDeals.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  {t('empty.noDeals')}
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <DraggableDealCard
                    key={deal.id}
                    deal={deal}
                    onStatusChange={onStatusChange}
                    onViewDetails={onViewDetails}
                  />
                ))
              )}
            </DroppableColumn>
          );
        })}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDeal ? (
          <div className="w-80 opacity-90 rotate-2 shadow-2xl">
            <DealCard deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

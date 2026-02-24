'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { useAddDealNote, useDealEvents } from '@/lib/hooks/useDeals';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { DealInfo } from '@/components/deals/DealInfo';
import { DealNotes } from '@/components/deals/DealNotes';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onEditValue: (deal: Deal) => void;
  onCloseDeal: (deal: Deal) => void;
  onReopen: (deal: Deal) => void;
  onChangeStatus?: (deal: Deal, newStatus: DealStatus) => void;
}

const statusColors: Record<DealStatus, { bar: string; badge: string; badgeText: string }> = {
  [DealStatus.NEW]: { bar: 'bg-slate-400', badge: 'bg-slate-100 dark:bg-slate-800', badgeText: 'text-slate-700 dark:text-slate-300' },
  [DealStatus.CONTACTED]: { bar: 'bg-blue-500', badge: 'bg-blue-100 dark:bg-blue-900', badgeText: 'text-blue-700 dark:text-blue-300' },
  [DealStatus.QUALIFIED]: { bar: 'bg-violet-500', badge: 'bg-violet-100 dark:bg-violet-900', badgeText: 'text-violet-700 dark:text-violet-300' },
  [DealStatus.IN_PROGRESS]: { bar: 'bg-amber-500', badge: 'bg-amber-100 dark:bg-amber-900', badgeText: 'text-amber-700 dark:text-amber-300' },
  [DealStatus.CLOSED_WON]: { bar: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-900', badgeText: 'text-emerald-700 dark:text-emerald-300' },
  [DealStatus.CLOSED_LOST]: { bar: 'bg-rose-500', badge: 'bg-rose-100 dark:bg-rose-900', badgeText: 'text-rose-700 dark:text-rose-300' },
};

export function DealDetailModal({
  deal,
  isOpen,
  onClose,
  onEditValue,
  onCloseDeal,
  onReopen,
  onChangeStatus,
}: DealDetailModalProps) {
  const t = useTranslations('dashboard.deals');
  const [newNote, setNewNote] = useState('');
  const addNote = useAddDealNote();
  const { data: events, isLoading: eventsLoading, error: eventsError } = useDealEvents(deal?.id || '');
  const modalRef = useRef<HTMLDivElement>(null);

  const statusLabels: Record<DealStatus, string> = {
    [DealStatus.NEW]: t('status.new'),
    [DealStatus.CONTACTED]: t('status.contacted'),
    [DealStatus.QUALIFIED]: t('status.qualified'),
    [DealStatus.IN_PROGRESS]: t('status.inProgress'),
    [DealStatus.CLOSED_WON]: t('status.closedWon'),
    [DealStatus.CLOSED_LOST]: t('status.closedLost'),
  };

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !deal) return null;

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote.mutateAsync({ id: deal.id, note: newNote.trim() });
      setNewNote('');
    } catch {
      // Error is handled by the hook
    }
  };

  const colors = statusColors[deal.status] || statusColors[DealStatus.NEW];
  const isClosed =
    deal.status === DealStatus.CLOSED_WON || deal.status === DealStatus.CLOSED_LOST;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-neutral-700 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Status color strip */}
        <div className={cn('h-1.5 rounded-t-2xl', colors.bar)} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 id="deal-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
              {t('detail.title')}
            </h2>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors.badge, colors.badgeText)}>
              {statusLabels[deal.status] || deal.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('detail.close')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6 border-t border-gray-100 dark:border-neutral-800">
          <DealInfo deal={deal} />

          <DealNotes
            deal={deal}
            isClosed={isClosed}
            newNote={newNote}
            onNewNoteChange={setNewNote}
            onAddNote={handleAddNote}
            isAddingNote={addNote.isPending}
          />

          {/* Timeline/Events */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              {t('detail.eventHistory')}
            </h3>
            {eventsError ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                {t('detail.eventsError')}
              </p>
            ) : (
              <DealTimeline events={events || []} isLoading={eventsLoading} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-neutral-800 space-y-3">
          {/* Status change dropdown */}
          {onChangeStatus && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {t('detail.changeStatus')}:
              </label>
              <select
                value={deal.status}
                onChange={(e) => {
                  const newStatus = e.target.value as DealStatus;
                  if (newStatus !== deal.status) {
                    onChangeStatus(deal, newStatus);
                    onClose();
                  }
                }}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                {Object.values(DealStatus).map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {!isClosed ? (
              <button
                onClick={() => {
                  onEditValue(deal);
                  onClose();
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-200"
              >
                Upraviť hodnotu
              </button>
            ) : (
              <button
                onClick={() => {
                  onReopen(deal);
                  onClose();
                }}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
                Znovu otvoriť
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              {t('detail.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

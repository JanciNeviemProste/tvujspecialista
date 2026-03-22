'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { useAddDealNote, useDealEvents } from '@/lib/hooks/useDeals';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { DealInfo } from '@/components/deals/DealInfo';
import { DealNotes } from '@/components/deals/DealNotes';
import { X, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus?: (deal: Deal, newStatus: DealStatus) => void;
}

export function DealDetailModal({
  deal,
  isOpen,
  onClose,
  onChangeStatus,
}: DealDetailModalProps) {
  const t = useTranslations('dashboard.deals');
  const [newNote, setNewNote] = useState('');
  const addNote = useAddDealNote();
  const { data: events, isLoading: eventsLoading, error: eventsError } = useDealEvents(deal?.id || '');
  const modalRef = useRef<HTMLDivElement>(null);

  const isNew = deal?.status === DealStatus.NEW;

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
        <div className={cn('h-1.5 rounded-t-2xl', isNew ? 'bg-slate-400' : 'bg-blue-500')} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 id="deal-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
              {t('detail.title')}
            </h2>
            <span className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              isNew
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            )}>
              {isNew ? t('status.new') : t('status.contacted')}
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
          {/* Contact info blur notice for NEW */}
          {isNew && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{t('detail.contactHiddenNoticeCrm')}</span>
            </div>
          )}

          {deal.crmPushedAt && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
              <span>{t('detail.crmPushSuccess')}</span>
            </div>
          )}

          <DealInfo deal={deal} />

          <DealNotes
            deal={deal}
            isClosed={false}
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
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3 flex-wrap">
            {isNew && onChangeStatus && (
              <button
                onClick={() => {
                  onChangeStatus(deal, DealStatus.CONTACTED);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                {t('card.moveToCrm')}
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

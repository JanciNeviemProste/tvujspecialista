'use client';

import { useEffect, useRef, useState } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { useAddDealNote, useDealEvents } from '@/lib/hooks/useDeals';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { DealInfo } from '@/components/deals/DealInfo';
import { DealNotes } from '@/components/deals/DealNotes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onEditValue: (deal: Deal) => void;
  onCloseDeal: (deal: Deal) => void;
  onReopen: (deal: Deal) => void;
}

const statusColors: Record<DealStatus, { bar: string; badge: string; badgeText: string }> = {
  [DealStatus.NEW]: { bar: 'bg-slate-400', badge: 'bg-slate-100 dark:bg-slate-800', badgeText: 'text-slate-700 dark:text-slate-300' },
  [DealStatus.CONTACTED]: { bar: 'bg-blue-500', badge: 'bg-blue-100 dark:bg-blue-900', badgeText: 'text-blue-700 dark:text-blue-300' },
  [DealStatus.QUALIFIED]: { bar: 'bg-violet-500', badge: 'bg-violet-100 dark:bg-violet-900', badgeText: 'text-violet-700 dark:text-violet-300' },
  [DealStatus.IN_PROGRESS]: { bar: 'bg-amber-500', badge: 'bg-amber-100 dark:bg-amber-900', badgeText: 'text-amber-700 dark:text-amber-300' },
  [DealStatus.CLOSED_WON]: { bar: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-900', badgeText: 'text-emerald-700 dark:text-emerald-300' },
  [DealStatus.CLOSED_LOST]: { bar: 'bg-rose-500', badge: 'bg-rose-100 dark:bg-rose-900', badgeText: 'text-rose-700 dark:text-rose-300' },
};

const statusLabels: Record<DealStatus, string> = {
  [DealStatus.NEW]: 'Nový',
  [DealStatus.CONTACTED]: 'Kontaktovaný',
  [DealStatus.QUALIFIED]: 'Kvalifikovaný',
  [DealStatus.IN_PROGRESS]: 'V procese',
  [DealStatus.CLOSED_WON]: 'Získaný',
  [DealStatus.CLOSED_LOST]: 'Stratený',
};

export function DealDetailModal({
  deal,
  isOpen,
  onClose,
  onEditValue,
  onCloseDeal,
  onReopen,
}: DealDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const addNote = useAddDealNote();
  const { data: events, isLoading: eventsLoading } = useDealEvents(deal?.id || '');
  const cardRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Auto-focus modal card
  useEffect(() => {
    if (isOpen && cardRef.current) {
      cardRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !deal) return null;

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote.mutateAsync({ id: deal.id, note: newNote.trim() });
      setNewNote('');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const colors = statusColors[deal.status] || statusColors[DealStatus.NEW];
  const isClosed =
    deal.status === DealStatus.CLOSED_WON || deal.status === DealStatus.CLOSED_LOST;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-modal-title"
    >
      <Card
        ref={cardRef}
        tabIndex={-1}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Status color strip */}
        <div className={cn('h-1.5 rounded-t-lg', colors.bar)} />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle id="deal-modal-title">Detail leadu</CardTitle>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors.badge, colors.badgeText)}>
              {statusLabels[deal.status] || deal.status}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
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
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              História udalostí
            </h3>
            <DealTimeline events={events || []} isLoading={eventsLoading} />
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-wrap">
          {!isClosed ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onEditValue(deal);
                  onClose();
                }}
              >
                Upraviť hodnotu
              </Button>
              <Button
                onClick={() => {
                  onCloseDeal(deal);
                  onClose();
                }}
              >
                Uzavrieť lead
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                onReopen(deal);
                onClose();
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Znovu otvoriť
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="ml-auto">
            Zavrieť
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

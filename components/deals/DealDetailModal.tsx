'use client';

import { useEffect, useRef, useState } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { useAddDealNote, useDealEvents } from '@/lib/hooks/useDeals';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { DealInfo } from '@/components/deals/DealInfo';
import { DealNotes } from '@/components/deals/DealNotes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case DealStatus.NEW:
        return 'bg-blue-500';
      case DealStatus.CONTACTED:
        return 'bg-cyan-500';
      case DealStatus.QUALIFIED:
        return 'bg-purple-500';
      case DealStatus.IN_PROGRESS:
        return 'bg-orange-500';
      case DealStatus.CLOSED_WON:
        return 'bg-green-500';
      case DealStatus.CLOSED_LOST:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: DealStatus) => {
    switch (status) {
      case DealStatus.NEW:
        return 'Nový';
      case DealStatus.CONTACTED:
        return 'Kontaktovaný';
      case DealStatus.QUALIFIED:
        return 'Kvalifikovaný';
      case DealStatus.IN_PROGRESS:
        return 'V procese';
      case DealStatus.CLOSED_WON:
        return 'Získaný';
      case DealStatus.CLOSED_LOST:
        return 'Stratený';
      default:
        return status;
    }
  };

  const isClosed =
    deal.status === DealStatus.CLOSED_WON || deal.status === DealStatus.CLOSED_LOST;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-modal-title"
    >
      <Card
        ref={cardRef}
        tabIndex={-1}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle id="deal-modal-title">Detail dealu</CardTitle>
            <Badge className={cn('text-white', getStatusColor(deal.status))}>
              {getStatusLabel(deal.status)}
            </Badge>
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
                Uzavrieť deal
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

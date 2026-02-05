'use client';

import { useState } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { useAddDealNote, useReopenDeal, useDealEvents } from '@/lib/hooks/useDeals';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Phone, Calendar, DollarSign, MessageSquare, Plus, RotateCcw } from 'lucide-react';
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

  const isClosed = deal.status === DealStatus.CLOSED_WON || deal.status === DealStatus.CLOSED_LOST;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle>Detail dealu</CardTitle>
            <Badge className={cn('text-white', getStatusColor(deal.status))}>
              {getStatusLabel(deal.status)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informácie o zákazníkovi</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{deal.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${deal.customerEmail}`} className="hover:underline">
                  {deal.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${deal.customerPhone}`} className="hover:underline">
                  {deal.customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Initial Message */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pôvodná správa</h3>
            <p className="text-sm bg-muted p-3 rounded-lg">{deal.message}</p>
          </div>

          {/* Deal Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informácie o deale</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hodnota dealu</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {deal.dealValue
                      ? new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(deal.dealValue)
                      : 'Nenastavené'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Predpokladané uzavretie</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {deal.estimatedCloseDate
                      ? new Date(deal.estimatedCloseDate).toLocaleDateString('sk-SK')
                      : 'Nenastavené'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Poznámky</h3>

            {/* Existing Notes */}
            {deal.notes && deal.notes.length > 0 ? (
              <div className="space-y-2 mb-4">
                {deal.notes.map((note, index) => (
                  <div key={index} className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm flex-1">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">Zatiaľ žiadne poznámky</p>
            )}

            {/* Add Note Form */}
            {!isClosed && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Pridať poznámku..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || addNote.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addNote.isPending ? 'Pridávam...' : 'Pridať poznámku'}
                </Button>
              </div>
            )}
          </div>

          {/* Timeline/Events */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">História udalostí</h3>
            <DealTimeline
              events={events || []}
              isLoading={eventsLoading}
            />
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

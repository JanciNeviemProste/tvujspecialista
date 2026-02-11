'use client';

import { Deal } from '@/types/deals';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus } from 'lucide-react';

interface DealNotesProps {
  deal: Deal;
  isClosed: boolean;
  newNote: string;
  onNewNoteChange: (value: string) => void;
  onAddNote: () => void;
  isAddingNote: boolean;
}

export function DealNotes({
  deal,
  isClosed,
  newNote,
  onNewNoteChange,
  onAddNote,
  isAddingNote,
}: DealNotesProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Poznámky</h3>

      {/* Existing Notes */}
      {deal.notes && deal.notes.length > 0 ? (
        <div className="space-y-2 mb-4">
          {deal.notes.map((note, index) => (
            <div key={note.id || index} className="bg-muted p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {note.author.name} &bull; {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
            onChange={(e) => onNewNoteChange(e.target.value)}
            className="min-h-[80px]"
            aria-label="New note"
          />
          <Button
            size="sm"
            onClick={onAddNote}
            disabled={!newNote.trim() || isAddingNote}
            aria-label="Add note to deal"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {isAddingNote ? 'Pridávam...' : 'Pridať poznámku'}
          </Button>
        </div>
      )}
    </div>
  );
}

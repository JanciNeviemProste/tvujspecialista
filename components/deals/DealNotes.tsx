'use client';

import { Deal } from '@/types/deals';
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
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Poznamky</h3>

      {/* Existing Notes */}
      {deal.notes && deal.notes.length > 0 ? (
        <div className="space-y-2 mb-4">
          {deal.notes.map((note, index) => (
            <div key={note.id || index} className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {note.author.name} &bull; {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Zatial ziadne poznamky</p>
      )}

      {/* Add Note Form */}
      {!isClosed && (
        <div className="space-y-2">
          <textarea
            placeholder="Pridat poznamku..."
            value={newNote}
            onChange={(e) => onNewNoteChange(e.target.value)}
            className="w-full min-h-[80px] rounded-xl border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors resize-none"
            aria-label="New note"
          />
          <button
            onClick={onAddNote}
            disabled={!newNote.trim() || isAddingNote}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            aria-label="Add note to deal"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAddingNote ? 'Pridavam...' : 'Pridat poznamku'}
          </button>
        </div>
      )}
    </div>
  );
}

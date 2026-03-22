'use client';

import { Calendar, Plus } from 'lucide-react';

export interface EventsEmptyStateProps {
  onCreateNew: () => void;
  t: (key: string) => string;
}

export default function EventsEmptyState({ onCreateNew }: EventsEmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Žiadne eventy</h3>
      <p className="text-gray-500 mb-4">Zatiaľ neboli vytvorené žiadne eventy.</p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Vytvoriť prvý event
      </button>
    </div>
  );
}

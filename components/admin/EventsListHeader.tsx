'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';

export interface EventsListHeaderProps {
  count: number;
  onCreateNew: () => void;
  t: (key: string) => string;
}

export default function EventsListHeader({ count, onCreateNew, t }: EventsListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/community" className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            {t('title')}
          </h1>
          <p className="text-gray-500 mt-1">{count} eventov</p>
        </div>
      </div>
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nový event
      </button>
    </div>
  );
}

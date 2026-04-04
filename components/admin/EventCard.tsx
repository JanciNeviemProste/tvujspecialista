'use client';

import { Pencil, Eye, RotateCcw, XCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import AttendeesPanel from './AttendeesPanel';

export interface AdminEventCardProps {
  event: any;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onPublish: () => void;
  onCancel: () => void;
  onDelete: () => void;
  actionLoading: boolean;
  locale: string;
}

function getLocaleDateString(locale: string): string {
  switch (locale) {
    case 'sk': return 'sk-SK';
    case 'en': return 'en-US';
    case 'pl': return 'pl-PL';
    default: return 'cs-CZ';
  }
}

export default function EventCard({
  event,
  expanded,
  onToggleExpand,
  onEdit,
  onPublish,
  onCancel,
  onDelete,
  actionLoading,
  locale,
}: AdminEventCardProps) {
  return (
    <div className="rounded-lg border bg-white dark:bg-card overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <button
          className="flex-1 text-left"
          onClick={onToggleExpand}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{event.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              event.status === 'published' ? 'bg-green-100 text-green-700' :
              event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {event.status === 'published' ? 'Publikovaný' :
               event.status === 'cancelled' ? 'Zrušený' :
               event.status === 'draft' ? 'Návrh' : event.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {event.type}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {event.startDate ? new Date(event.startDate).toLocaleDateString(getLocaleDateString(locale)) : 'Bez dátumu'} &middot;
            {event.attendeeCount ?? 0}/{event.maxAttendees ?? '\u221e'} účastníkov
          </p>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={actionLoading}
            className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title="Upraviť"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {event.status === 'draft' && (
            <button
              onClick={onPublish}
              disabled={actionLoading}
              className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700 transition-colors text-green-600"
              title="Publikovať"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {event.status === 'cancelled' && (
            <button
              onClick={onPublish}
              disabled={actionLoading}
              className="p-2 rounded-md hover:bg-green-50 transition-colors text-green-600"
              title="Obnoviť"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          {event.status !== 'cancelled' && (
            <button
              onClick={onCancel}
              disabled={actionLoading}
              className="p-2 rounded-md hover:bg-red-50 transition-colors text-orange-500"
              title="Zrušiť"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={actionLoading}
            className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-500"
            title="Zmazať"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700 transition-colors text-gray-400"
            title="Zobraziť účastníkov"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <AttendeesPanel eventId={event.id} />
      )}
    </div>
  );
}

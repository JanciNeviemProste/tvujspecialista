'use client';

import { DealEvent } from '@/types/deals';
import { formatDateTime } from '@/lib/utils/format';
import {
  Circle,
  ArrowRight,
  DollarSign,
  MessageSquare,
  Mail,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealTimelineProps {
  events: DealEvent[];
  isLoading?: boolean;
  className?: string;
}

export function DealTimeline({ events, isLoading, className }: DealTimelineProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Zatiaľ žiadne udalosti
        </p>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    // Map event types to icons
    if (type.includes('created')) return Circle;
    if (type.includes('status')) return ArrowRight;
    if (type.includes('value')) return DollarSign;
    if (type.includes('note')) return MessageSquare;
    if (type.includes('email')) return Mail;
    return Circle;
  };

  const getEventColor = (type: string) => {
    // Map event types to colors
    if (type.includes('created')) return 'text-blue-500 bg-blue-500/10';
    if (type.includes('status')) return 'text-green-500 bg-green-500/10';
    if (type.includes('value')) return 'text-purple-500 bg-purple-500/10';
    if (type.includes('note')) return 'text-purple-500 bg-purple-500/10';
    if (type.includes('email')) return 'text-orange-500 bg-orange-500/10';
    return 'text-gray-500 bg-gray-500/10';
  };

  return (
    <ol className={cn('space-y-4', className)} role="list" aria-label="Deal timeline">
      {events.map((event, index) => {
        const Icon = getEventIcon(event.type);
        const colorClass = getEventColor(event.type);
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-4">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-4 top-10 bottom-0 w-px bg-border" aria-hidden="true" />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                colorClass
              )}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 pt-1">
              <p className="text-sm font-medium leading-none">
                {event.description}
              </p>
              <p className="text-xs text-muted-foreground">
                <time dateTime={event.createdAt}>
                  {formatDateTime(event.createdAt, 'sk')}
                </time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

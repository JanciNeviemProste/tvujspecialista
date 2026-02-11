'use client';

import { forwardRef } from 'react';
import { Play, CheckCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format';
import type { LessonProgress, LessonType } from '@/types/academy';

interface LessonItemProps {
  lessonId: string;
  title: string;
  type: LessonType;
  duration: number;
  position: number;
  free: boolean;
  isCurrent: boolean;
  progress: LessonProgress | undefined;
  onSelect: (lessonId: string) => void;
}

function getLessonIcon(type: LessonType) {
  switch (type) {
    case 'video':
      return Play;
    case 'quiz':
      return CheckCircle;
    case 'reading':
      return FileText;
    default:
      return FileText;
  }
}

function getLessonStatusIcon(
  isCurrent: boolean,
  completed: boolean | undefined,
  position: number,
) {
  if (completed) {
    return (
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle className="h-4 w-4 text-green-500" />
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
        <Play className="h-4 w-4 text-primary fill-current" />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
      <span className="text-xs text-muted-foreground font-medium">{position}</span>
    </div>
  );
}

export const LessonItem = forwardRef<HTMLDivElement, LessonItemProps>(function LessonItem(
  { lessonId, title, type, duration, position, free, isCurrent, progress, onSelect },
  ref,
) {
  const LessonIcon = getLessonIcon(type);

  return (
    <div ref={ref}>
      <button
        onClick={() => onSelect(lessonId)}
        className={cn(
          'w-full px-4 py-3 pl-12 flex items-center gap-3 hover:bg-muted/50 transition-colors',
          isCurrent && 'bg-primary/10 border-l-2 border-primary',
        )}
      >
        {/* Status indicator */}
        {getLessonStatusIcon(isCurrent, progress?.completed, position)}

        {/* Lesson info */}
        <div className="flex-1 text-left space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                'font-medium text-sm truncate',
                isCurrent && 'text-primary',
              )}
            >
              {title}
            </h4>
            {free && (
              <Badge variant="outline" className="text-xs">
                Free
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LessonIcon className="h-3 w-3" />
            <span>{formatDuration(duration)}</span>
            {progress && !progress.completed && progress.watchTimeSeconds > 0 && (
              <>
                <span>&bull;</span>
                <span className="text-primary">
                  {Math.floor((progress.watchTimeSeconds / (duration * 60)) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>
      </button>
    </div>
  );
});

'use client';

import { useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatDuration } from '@/lib/utils/format';
import { LessonItem } from '@/components/academy/LessonItem';
import type { Module, LessonProgress } from '@/types/academy';

interface ModuleSectionProps {
  module: Module;
  isExpanded: boolean;
  currentLessonId: string;
  lessonProgress: LessonProgress[];
  onToggle: (moduleId: string) => void;
  onLessonSelect: (lessonId: string) => void;
}

export function ModuleSection({
  module,
  isExpanded,
  currentLessonId,
  lessonProgress,
  onToggle,
  onLessonSelect,
}: ModuleSectionProps) {
  const currentLessonRef = useRef<HTMLDivElement>(null);

  const completedLessons =
    module.lessons?.filter((lesson) => {
      const progress = lessonProgress.find((p) => p.lessonId === lesson.id);
      return progress?.completed;
    }).length || 0;
  const totalLessons = module.lessons?.length || 0;

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.find((p) => p.lessonId === lessonId);
  };

  return (
    <div className="border-b last:border-b-0">
      {/* Module header */}
      <button
        onClick={() => onToggle(module.id)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 text-left space-y-1">
          <h3 className="font-medium text-sm">{module.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {completedLessons}/{totalLessons} dokončených
            </span>
            <span>&bull;</span>
            <span>{formatDuration(module.duration)}</span>
          </div>
        </div>
      </button>

      {/* Lessons list */}
      {isExpanded && module.lessons && (
        <div className="bg-muted/20">
          {module.lessons
            .sort((a, b) => a.position - b.position)
            .map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;

              return (
                <LessonItem
                  key={lesson.id}
                  ref={isCurrent ? currentLessonRef : null}
                  lessonId={lesson.id}
                  title={lesson.title}
                  type={lesson.type}
                  duration={lesson.duration}
                  position={lesson.position}
                  free={lesson.free}
                  isCurrent={isCurrent}
                  progress={getLessonProgress(lesson.id)}
                  onSelect={onLessonSelect}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

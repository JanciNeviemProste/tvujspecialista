'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Play, CheckCircle, FileText, Circle, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format';
import type { Module, LessonProgress, LessonType } from '@/types/academy';

interface LessonSidebarProps {
  modules: Module[];
  currentLessonId: string;
  lessonProgress: LessonProgress[];
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

export function LessonSidebar({
  modules,
  currentLessonId,
  lessonProgress,
  onLessonSelect,
  className,
}: LessonSidebarProps) {
  const currentLessonRef = useRef<HTMLDivElement>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Find which module contains current lesson
  const currentModuleId = modules.find(module =>
    module.lessons?.some(lesson => lesson.id === currentLessonId)
  )?.id;

  const [expandedModules, setExpandedModules] = useState<string[]>(
    currentModuleId ? [currentModuleId] : []
  );

  // Scroll to current lesson on mount
  useEffect(() => {
    if (currentLessonRef.current) {
      currentLessonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLessonId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  const getLessonIcon = (type: LessonType) => {
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
  };

  const getLessonStatusIcon = (lessonId: string, position: number) => {
    const progress = getLessonProgress(lessonId);
    const isCurrent = lessonId === currentLessonId;

    if (progress?.completed) {
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
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'w-80 flex flex-col bg-card border-l',
        // Mobile: fixed overlay that slides in from right
        'lg:relative lg:translate-x-0',
        'fixed right-0 top-0 bottom-0 z-40 transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        className
      )}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Obsah kurzu</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
        {modules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const completedLessons = module.lessons?.filter(lesson => {
            const progress = getLessonProgress(lesson.id);
            return progress?.completed;
          }).length || 0;
          const totalLessons = module.lessons?.length || 0;

          return (
            <div key={module.id} className="border-b last:border-b-0">
              {/* Module header */}
              <button
                onClick={() => toggleModule(module.id)}
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
                    <span>{completedLessons}/{totalLessons} dokončených</span>
                    <span>•</span>
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
                      const progress = getLessonProgress(lesson.id);
                      const LessonIcon = getLessonIcon(lesson.type);

                      return (
                        <div
                          key={lesson.id}
                          ref={isCurrent ? currentLessonRef : null}
                        >
                          <button
                            onClick={() => {
                              onLessonSelect(lesson.id);
                              setIsMobileOpen(false); // Close on mobile after selection
                            }}
                            className={cn(
                              'w-full px-4 py-3 pl-12 flex items-center gap-3 hover:bg-muted/50 transition-colors',
                              isCurrent && 'bg-primary/10 border-l-2 border-primary'
                            )}
                          >
                            {/* Status indicator */}
                            {getLessonStatusIcon(lesson.id, lesson.position)}

                            {/* Lesson info */}
                            <div className="flex-1 text-left space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4
                                  className={cn(
                                    'font-medium text-sm truncate',
                                    isCurrent && 'text-primary'
                                  )}
                                >
                                  {lesson.title}
                                </h4>
                                {lesson.free && (
                                  <Badge variant="outline" className="text-xs">
                                    Free
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <LessonIcon className="h-3 w-3" />
                                <span>{formatDuration(lesson.duration)}</span>
                                {progress && !progress.completed && progress.watchTimeSeconds > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary">
                                      {Math.floor((progress.watchTimeSeconds / (lesson.duration * 60)) * 100)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </>
  );
}

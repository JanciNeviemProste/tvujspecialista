'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { ModuleSection } from '@/components/academy/ModuleSection';
import type { Module, LessonProgress } from '@/types/academy';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Find which module contains current lesson
  const currentModuleId = modules.find((module) =>
    module.lessons?.some((lesson) => lesson.id === currentLessonId),
  )?.id;

  const [expandedModules, setExpandedModules] = useState<string[]>(
    currentModuleId ? [currentModuleId] : [],
  );

  // Escape key handler for mobile overlay
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleLessonSelect = (lessonId: string) => {
    onLessonSelect(lessonId);
    setIsMobileOpen(false); // Close on mobile after selection
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
      <div
        className={cn(
          'w-80 flex flex-col bg-card border-l',
          // Mobile: fixed overlay that slides in from right
          'lg:relative lg:translate-x-0',
          'fixed right-0 top-0 bottom-0 z-40 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          className,
        )}
      >
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
          {modules.map((module) => (
            <ModuleSection
              key={module.id}
              module={module}
              isExpanded={expandedModules.includes(module.id)}
              currentLessonId={currentLessonId}
              lessonProgress={lessonProgress}
              onToggle={toggleModule}
              onLessonSelect={handleLessonSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/academy/VideoPlayer';
import { LessonSidebar } from '@/components/academy/LessonSidebar';
import { useCourse, useEnrollmentProgress, useUpdateProgress, useEnrollmentByCourse } from '@/lib/hooks/useAcademy';
import { cn } from '@/lib/utils/cn';
import type { Lesson } from '@/types/academy';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = params.courseSlug as string;

  // Query params
  const lessonIdParam = searchParams.get('lessonId');

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useCourse(courseSlug);

  // Fetch user's enrollment for this course
  const { data: enrollment } = useEnrollmentByCourse(course?.id || '');

  // Fetch progress
  const { data: progressData = [] } = useEnrollmentProgress(enrollment?.id || '');

  // Update progress mutation
  const updateProgress = useUpdateProgress();

  // Get all lessons in order
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules
      .sort((a, b) => a.position - b.position)
      .flatMap(module =>
        (module.lessons || [])
          .sort((a, b) => a.position - b.position)
          .map(lesson => ({ ...lesson, moduleId: module.id }))
      );
  }, [course]);

  // Current lesson state
  const [currentLessonId, setCurrentLessonId] = useState<string>('');

  // Initialize current lesson
  useEffect(() => {
    if (allLessons.length === 0) return;

    if (lessonIdParam && allLessons.find(l => l.id === lessonIdParam)) {
      setCurrentLessonId(lessonIdParam);
    } else {
      // Find first incomplete lesson or first lesson
      const lastProgress = progressData
        .filter(p => !p.completed)
        .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())[0];

      if (lastProgress) {
        setCurrentLessonId(lastProgress.lessonId);
      } else {
        setCurrentLessonId(allLessons[0].id);
      }
    }
  }, [lessonIdParam, allLessons, progressData]);

  // Update URL when lesson changes
  useEffect(() => {
    if (currentLessonId && currentLessonId !== lessonIdParam) {
      router.replace(`/academy/learn/${courseSlug}?lessonId=${currentLessonId}`, {
        scroll: false,
      });
    }
  }, [currentLessonId, courseSlug, lessonIdParam, router]);

  const currentLesson = useMemo(() => {
    return allLessons.find(l => l.id === currentLessonId);
  }, [allLessons, currentLessonId]);

  const currentLessonIndex = useMemo(() => {
    return allLessons.findIndex(l => l.id === currentLessonId);
  }, [allLessons, currentLessonId]);

  const currentProgress = useMemo(() => {
    return progressData.find(p => p.lessonId === currentLessonId);
  }, [progressData, currentLessonId]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (allLessons.length === 0) return 0;
    const completedCount = progressData.filter(p => p.completed).length;
    return Math.round((completedCount / allLessons.length) * 100);
  }, [allLessons, progressData]);

  // Navigation handlers
  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  // Progress tracking
  const handleProgressUpdate = (watchTimeSeconds: number) => {
    if (!enrollment || !currentLessonId) return;

    updateProgress.mutate({
      enrollmentId: enrollment.id,
      lessonId: currentLessonId,
      watchTimeSeconds,
      completed: currentProgress?.completed || false,
    });
  };

  const handleVideoComplete = () => {
    if (!enrollment || !currentLessonId) return;

    const currentSeconds = currentLesson?.duration ? currentLesson.duration * 60 : 0;

    updateProgress.mutate(
      {
        enrollmentId: enrollment.id,
        lessonId: currentLessonId,
        watchTimeSeconds: currentSeconds,
        completed: true,
      },
      {
        onSuccess: () => {
          // Auto-advance to next lesson if available
          if (currentLessonIndex < allLessons.length - 1) {
            setTimeout(() => {
              goToNextLesson();
            }, 1000);
          }
        },
      }
    );
  };

  const handleMarkComplete = () => {
    if (!enrollment || !currentLessonId || !currentLesson) return;

    const currentSeconds = currentProgress?.watchTimeSeconds || currentLesson.duration * 60;

    updateProgress.mutate(
      {
        enrollmentId: enrollment.id,
        lessonId: currentLessonId,
        watchTimeSeconds: currentSeconds,
        completed: true,
      },
      {
        onSuccess: () => {
          // Auto-advance to next lesson
          if (currentLessonIndex < allLessons.length - 1) {
            setTimeout(() => {
              goToNextLesson();
            }, 1000);
          }
        },
      }
    );
  };

  // Check enrollment status
  useEffect(() => {
    if (!course || courseLoading) return;

    // Allow access to free lessons
    if (currentLesson?.free) return;

    // Check if enrolled with active status
    if (!enrollment || enrollment.status !== 'active') {
      router.push(`/academy/courses/${courseSlug}`);
    }
  }, [enrollment, course, courseLoading, currentLesson, courseSlug, router]);

  // Loading state
  if (courseLoading || !course || !currentLesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-white text-lg">Načítavam kurz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-black text-white">
      {/* Top bar */}
      <div className="h-16 border-b border-white/10 flex items-center px-4 lg:px-6 flex-shrink-0">
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/10"
          onClick={() => router.push(`/academy/courses/${courseSlug}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Späť na kurz
        </Button>

        <div className="flex-1 text-center overflow-hidden">
          <h1 className="font-semibold text-sm lg:text-lg truncate px-2 lg:px-4">{course.title}</h1>
        </div>

        <div className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
          {overallProgress}%
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left side - Video & content */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          {/* Video player */}
          {currentLesson.video && (
            <div className="w-full bg-black">
              <VideoPlayer
                video={currentLesson.video}
                lessonId={currentLessonId}
                onProgressUpdate={handleProgressUpdate}
                onComplete={handleVideoComplete}
              />
            </div>
          )}

          {/* Lesson content */}
          <div className="flex-1 p-6 space-y-6 bg-background text-foreground">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="text-muted-foreground">{currentLesson.description}</p>
              )}
            </div>

            {/* Additional content could go here */}
            {currentLesson.content && (
              <div className="prose dark:prose-invert max-w-none">
                {/* Render content - could use markdown renderer */}
                <div className="text-sm">{JSON.stringify(currentLesson.content)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Sidebar */}
        <LessonSidebar
          modules={course.modules || []}
          currentLessonId={currentLessonId}
          lessonProgress={progressData}
          onLessonSelect={setCurrentLessonId}
          className="flex-shrink-0"
        />
      </div>

      {/* Bottom bar */}
      <div className="h-16 border-t border-white/10 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 bg-card gap-2">
        <Button
          variant="ghost"
          disabled={currentLessonIndex === 0}
          onClick={goToPreviousLesson}
          className="text-foreground hover:text-foreground text-xs lg:text-sm"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 lg:mr-2" />
          <span className="hidden sm:inline">Predchádzajúca lekcia</span>
        </Button>

        <Button
          variant="default"
          disabled={currentProgress?.completed || updateProgress.isPending}
          onClick={handleMarkComplete}
          className="gap-1 lg:gap-2 text-xs lg:text-sm"
          size="sm"
        >
          {updateProgress.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Označujem...</span>
            </>
          ) : currentProgress?.completed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Dokončené</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="hidden md:inline">Označiť ako dokončené</span>
              <span className="md:hidden">Dokončiť</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          disabled={currentLessonIndex === allLessons.length - 1}
          onClick={goToNextLesson}
          className="text-foreground hover:text-foreground text-xs lg:text-sm"
          size="sm"
        >
          <span className="hidden sm:inline">Ďalšia lekcia</span>
          <ChevronRight className="h-4 w-4 lg:ml-2" />
        </Button>
      </div>
    </div>
  );
}

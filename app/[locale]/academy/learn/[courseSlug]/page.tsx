'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/academy/VideoPlayer';
import { LessonSidebar } from '@/components/academy/LessonSidebar';
import { useCourse, useEnrollmentProgress, useUpdateProgress, useEnrollmentByCourse } from '@/lib/hooks/useAcademy';
import { cn } from '@/lib/utils/cn';
import type { Lesson } from '@/types/academy';

export default function LearnPage() {
  const t = useTranslations('academy');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = params.courseSlug as string;

  // Query params
  const lessonIdParam = searchParams.get('lessonId');

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useCourse(courseSlug);

  // Fetch user's enrollment for this course
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollmentByCourse(course?.id || '');

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
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  // Initialize current lesson — runs ONCE, then never overrides user navigation
  useEffect(() => {
    if (allLessons.length === 0) return;
    if (initializedRef.current) return;

    if (lessonIdParam && allLessons.find(l => l.id === lessonIdParam)) {
      setCurrentLessonId(lessonIdParam);
    } else {
      // Find first incomplete lesson or first lesson
      const lastProgress = progressData
        .filter(p => !p.completed)
        .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())[0];

      if (lastProgress && allLessons.find(l => l.id === lastProgress.lessonId)) {
        setCurrentLessonId(lastProgress.lessonId);
      } else {
        setCurrentLessonId(allLessons[0].id);
      }
    }
    initializedRef.current = true;
  }, [lessonIdParam, allLessons, progressData]);

  // Cancel pending auto-advance when lesson changes
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [currentLessonId]);

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

    const currentSeconds = currentLesson?.duration != null ? currentLesson.duration * 60 : 0;

    updateProgress.mutate(
      {
        enrollmentId: enrollment.id,
        lessonId: currentLessonId,
        watchTimeSeconds: currentSeconds,
        completed: true,
      },
      {
        onSuccess: () => {
          // Auto-advance to next lesson if available (cancellable via ref)
          if (currentLessonIndex < allLessons.length - 1) {
            autoAdvanceTimerRef.current = setTimeout(() => {
              goToNextLesson();
            }, 1000);
          }
        },
      }
    );
  };

  const handleMarkComplete = () => {
    if (!currentLessonId || !currentLesson) return;

    if (!enrollment) {
      setProgressError(t('learn.enrollRequired'));
      return;
    }

    setProgressError(null);
    const currentSeconds = currentProgress?.watchTimeSeconds ?? (currentLesson.duration != null ? currentLesson.duration * 60 : 0);

    updateProgress.mutate(
      {
        enrollmentId: enrollment.id,
        lessonId: currentLessonId,
        watchTimeSeconds: currentSeconds,
        completed: true,
      },
      {
        onError: () => {
          setProgressError(t('learn.markCompleteError'));
        },
      }
    );
  };

  // Check enrollment status
  useEffect(() => {
    if (!course || courseLoading) return;
    if (!currentLesson) return;
    if (currentLesson.free) return;
    if (enrollmentLoading) return;

    if (!enrollment || enrollment.status !== 'active') {
      router.push(`/academy/courses/${courseSlug}`);
    }
  }, [enrollment, enrollmentLoading, course, courseLoading, currentLesson, courseSlug, router]);

  // Loading state
  if (courseLoading || !course || !currentLesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-white text-lg">{t('learn.loading')}</p>
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
          {t('learn.backToCourse')}
        </Button>

        <div className="flex-1 text-center overflow-hidden">
          <h1 className="font-semibold text-sm lg:text-lg truncate px-2 lg:px-4">{course.title}</h1>
        </div>

        <div className="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
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
                key={currentLessonId}
                video={currentLesson.video}
                lessonId={currentLessonId}
                onProgressUpdate={handleProgressUpdate}
                onComplete={handleVideoComplete}
              />
            </div>
          )}

          {/* Lesson content */}
          <div className="flex-1 p-6 space-y-6 bg-white text-gray-900">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="text-gray-500">{currentLesson.description}</p>
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

      {/* Error feedback */}
      {progressError && (
        <div className="px-4 py-2 bg-red-900/80 text-red-200 text-sm text-center flex-shrink-0">
          {progressError}
        </div>
      )}

      {/* Bottom bar */}
      <div className="h-16 border-t border-white/10 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 bg-gray-900 gap-2">
        <Button
          variant="ghost"
          disabled={currentLessonIndex === 0}
          onClick={goToPreviousLesson}
          className="text-gray-300 hover:text-white text-xs lg:text-sm"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 lg:mr-2" />
          <span className="hidden sm:inline">{t('learn.prevLesson')}</span>
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
              <span className="hidden sm:inline">{t('learn.markingComplete')}</span>
            </>
          ) : currentProgress?.completed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('learn.completed')}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="hidden md:inline">{t('learn.markComplete')}</span>
              <span className="md:hidden">{t('learn.complete')}</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          disabled={currentLessonIndex === allLessons.length - 1}
          onClick={goToNextLesson}
          className="text-gray-300 hover:text-white text-xs lg:text-sm"
          size="sm"
        >
          <span className="hidden sm:inline">{t('learn.nextLesson')}</span>
          <ChevronRight className="h-4 w-4 lg:ml-2" />
        </Button>
      </div>
    </div>
  );
}

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Course } from '@/types/academy';
import { Clock, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
  className?: string;
}

function formatDuration(minutes: number): string {
  if (!minutes || minutes < 1) return '0min';
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

function CourseCardInner({
  course,
  enrolled = false,
  progress,
  className,
}: CourseCardProps) {
  const t = useTranslations('academy');

  const levelLabels: Record<string, string> = {
    beginner: t('course.beginner'),
    intermediate: t('course.intermediate'),
    advanced: t('course.advanced'),
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  const href = enrolled
    ? `/academy/learn/${course.slug}`
    : `/academy/courses/${course.slug}`;

  const rating = Number(course.rating || 0);
  const reviewCount = Number(course.reviewCount || 0);

  return (
    <Link href={href} className={cn('block h-full', className)}>
      <div className="overflow-hidden h-full flex flex-col group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white/30" />
              </div>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-sm', levelColors[course.level] || 'bg-gray-100 text-gray-700')}>
              {levelLabels[course.level] || course.level}
            </span>
            {course.featured && (
              <span className="inline-flex items-center rounded-full bg-amber-400/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-5 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessonCount} {t('course.lessons')}</span>
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({reviewCount})</span>
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-2">
            {course.instructorPhoto ? (
              <img
                src={course.instructorPhoto}
                alt={course.instructorName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                {course.instructorName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            )}
            <span className="text-sm text-gray-500">{course.instructorName}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>

          {/* Progress bar (if enrolled) */}
          {enrolled && progress !== undefined && (
            <div className="space-y-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-right">
                {Math.round(progress)}% {t('course.completed')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-0">
          <span className="inline-flex items-center justify-center w-full rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium group-hover:bg-blue-700 transition-colors">
            {enrolled ? t('course.continue') : t('course.viewCourse')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export const CourseCard = memo(CourseCardInner);

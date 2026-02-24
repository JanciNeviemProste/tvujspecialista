'use client'

import { useTranslations } from 'next-intl'
import { CourseCard } from '@/components/academy/CourseCard'
import { CoursesGridSkeleton } from '@/components/academy/LoadingStates'
import { useCourses } from '@/lib/hooks/useAcademy'
import { GraduationCap, Clock, Award } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function AcademyLandingPage() {
  const t = useTranslations('academy')
  const { data: featuredCourses, isLoading, error } = useCourses({ featured: true, limit: 3 })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Featured Courses Section — FIRST */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{t('featured.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('featured.subtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <CoursesGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                {t('featured.loadError')}
              </p>
            </div>
          )}

          {/* Featured Courses Grid */}
          {!isLoading && !error && featuredCourses && (
            <>
              {featuredCourses.courses.length === 0 ? (
                <div className="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('featured.empty')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCourses.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Hero Text Section — SECOND */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mb-4 text-xl lg:text-2xl opacity-90">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </section>

      {/* Benefits Section — THIRD */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.quality.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.quality.description')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.flexible.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.flexible.description')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.certificates.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.certificates.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* View All Courses Button — LAST */}
      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/academy/courses"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
          >
            {t('viewAllCourses')}
          </Link>
        </div>
      </section>
    </div>
  )
}

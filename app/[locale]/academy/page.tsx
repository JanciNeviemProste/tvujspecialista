'use client'

import { useTranslations } from 'next-intl'
import { CourseCard } from '@/components/academy/CourseCard'
import { CoursesGridSkeleton } from '@/components/academy/LoadingStates'
import { useCourses } from '@/lib/hooks/useAcademy'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Clock, Award } from 'lucide-react'

export default function AcademyLandingPage() {
  const t = useTranslations('academy')
  const { data: featuredCourses, isLoading, error } = useCourses({ featured: true, limit: 3 })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 py-20 text-white">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Benefit 1 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.quality.title')}</h3>
                <p className="text-muted-foreground">
                  {t('benefits.quality.description')}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.flexible.title')}</h3>
                <p className="text-muted-foreground">
                  {t('benefits.flexible.description')}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.certificates.title')}</h3>
                <p className="text-muted-foreground">
                  {t('benefits.certificates.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">{t('featured.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('featured.subtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <CoursesGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
              <p className="text-destructive">
                {t('featured.loadError')}
              </p>
            </div>
          )}

          {/* Featured Courses Grid */}
          {!isLoading && !error && featuredCourses && (
            <>
              {featuredCourses.courses.length === 0 ? (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <p className="text-muted-foreground">
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

    </div>
  )
}

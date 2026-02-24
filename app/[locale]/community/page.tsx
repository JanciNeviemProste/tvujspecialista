'use client'

import { useTranslations } from 'next-intl'
import { EventCard } from '@/components/community/EventCard'
import { EventsGridSkeleton } from '@/components/community/LoadingStates'
import { useUpcomingEvents } from '@/lib/hooks/useCommunity'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Calendar, TrendingUp, Settings } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'

export default function CommunityLandingPage() {
  const t = useTranslations('community')
  const { data: featuredEvents, isLoading, error } = useUpcomingEvents()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Take only first 3 events
  const displayEvents = featuredEvents?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-500 to-primary-500 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mb-8 text-xl lg:text-2xl opacity-90">
              {t('hero.subtitle')}
            </p>
            {isAdmin ? (
              <Link
                href="/profi/dashboard/admin/komunita"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
                {t('hero.manageButton')}
              </Link>
            ) : (
              <Link
                href="/community/events"
                className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-colors"
              >
                {t('hero.exploreButton')}
              </Link>
            )}
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
                  <div className="rounded-full bg-accent-500/10 p-4">
                    <Users className="h-8 w-8 text-accent-500" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.networking.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('benefits.networking.description')}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-accent-500/10 p-4">
                    <Calendar className="h-8 w-8 text-accent-500" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.exclusiveEvents.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('benefits.exclusiveEvents.description')}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-accent-500/10 p-4">
                    <TrendingUp className="h-8 w-8 text-accent-500" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{t('benefits.careerGrowth.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('benefits.careerGrowth.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">{t('upcomingEvents.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('upcomingEvents.subtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <EventsGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
              <p className="text-red-600">
                {t('upcomingEvents.loadError')}
              </p>
            </div>
          )}

          {/* Featured Events Grid */}
          {!isLoading && !error && (
            <>
              {displayEvents.length === 0 ? (
                <div className="rounded-lg border bg-white dark:bg-neutral-800 p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('upcomingEvents.empty')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t('upcomingEvents.ctaTitle')}
            </h2>
            <p className="mb-8 text-lg text-white/90">
              {t('upcomingEvents.ctaSubtitle')}
            </p>
            {isAdmin ? (
              <Link
                href="/profi/dashboard/admin/komunita"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
                {t('hero.manageButton')}
              </Link>
            ) : (
              <Link
                href="/community/events"
                className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-colors"
              >
                {t('upcomingEvents.ctaButton')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

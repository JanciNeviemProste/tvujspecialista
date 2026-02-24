'use client'

import { useTranslations } from 'next-intl'
import { EventCard } from '@/components/community/EventCard'
import { EventsGridSkeleton } from '@/components/community/LoadingStates'
import { useUpcomingEvents } from '@/lib/hooks/useCommunity'
import { Users, Calendar, TrendingUp } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CommunityLandingPage() {
  const t = useTranslations('community')
  const { data: featuredEvents, isLoading, error } = useUpcomingEvents()

  // Take only first 3 events
  const displayEvents = featuredEvents?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Upcoming Events Section — FIRST */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{t('upcomingEvents.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('upcomingEvents.subtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <EventsGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                {t('upcomingEvents.loadError')}
              </p>
            </div>
          )}

          {/* Featured Events Grid */}
          {!isLoading && !error && (
            <>
              {displayEvents.length === 0 ? (
                <div className="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-12 text-center">
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

      {/* Benefits Section — SECOND */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.networking.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.networking.description')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.exclusiveEvents.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.exclusiveEvents.description')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t('benefits.careerGrowth.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('benefits.careerGrowth.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Events Button — LAST */}
      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/community/events"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-colors"
          >
            {t('exploreEvents')}
          </Link>
        </div>
      </section>
    </div>
  )
}

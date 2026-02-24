'use client'

import { useTranslations } from 'next-intl'
import { EventCard } from '@/components/community/EventCard'
import { EventsGridSkeleton } from '@/components/community/LoadingStates'
import { useUpcomingEvents } from '@/lib/hooks/useCommunity'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Calendar, TrendingUp } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CommunityLandingPage() {
  const t = useTranslations('community')
  const { data: featuredEvents, isLoading, error } = useUpcomingEvents()

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
            <Link href="/community/events">
              <Button
                size="lg"
                variant="glass"
                className="shadow-lg"
              >
                {t('hero.exploreButton')}
              </Button>
            </Link>
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
                <p className="text-muted-foreground">
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
                <p className="text-muted-foreground">
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
                <p className="text-muted-foreground">
                  {t('benefits.careerGrowth.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">{t('upcomingEvents.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('upcomingEvents.subtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <EventsGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
              <p className="text-destructive">
                {t('upcomingEvents.loadError')}
              </p>
            </div>
          )}

          {/* Featured Events Grid */}
          {!isLoading && !error && (
            <>
              {displayEvents.length === 0 ? (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <p className="text-muted-foreground">
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
          <Card variant="premium" className="overflow-hidden bg-gradient-to-br from-accent-500 to-primary-500">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {t('upcomingEvents.ctaTitle')}
              </h2>
              <p className="mb-8 text-lg text-white/90">
                {t('upcomingEvents.ctaSubtitle')}
              </p>
              <Link href="/community/events">
                <Button
                  size="lg"
                  variant="glass"
                  className="shadow-lg"
                >
                  {t('upcomingEvents.ctaButton')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

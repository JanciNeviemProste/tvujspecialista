'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { EventCard } from '@/components/community/EventCard'
import { EventsGridSkeleton } from '@/components/community/LoadingStates'
import { useEvents } from '@/lib/hooks/useCommunity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EventType, EventFormat, EventCategory } from '@/types/community'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export default function EventsCatalogPage() {
  const t = useTranslations('community.eventsCatalog')
  const [filters, setFilters] = useState({
    search: '',
    type: '' as EventType | '',
    format: '' as EventFormat | '',
    category: '' as EventCategory | '',
    featured: false,
  })

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 300)

  // Build API filters
  const apiFilters = useMemo(() => ({
    type: filters.type || undefined,
    format: filters.format || undefined,
    category: filters.category || undefined,
    featured: filters.featured || undefined,
  }), [filters.type, filters.format, filters.category, filters.featured])

  const { data, isLoading, error } = useEvents(apiFilters)

  // Client-side search filter
  const filteredEvents = useMemo(() => {
    if (!data?.events) return []

    if (!debouncedSearch) return data.events

    const searchLower = debouncedSearch.toLowerCase()
    return data.events.filter(event =>
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
    )
  }, [data?.events, debouncedSearch])

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: '',
      format: '',
      category: '',
      featured: false,
    })
  }

  const hasActiveFilters = filters.search || filters.type || filters.format || filters.category || filters.featured

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-gray-500">
            {isLoading ? (
              t('loading')
            ) : error ? (
              t('loadError')
            ) : (
              <>
                Nájdených <span className="font-semibold">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : filteredEvents.length < 5 ? 'eventy' : 'eventov'}
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('filters.title')}</CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto p-0 text-xs hover:text-red-600"
                      >
                        {t('filters.clear')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('filters.search')}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        type="text"
                        placeholder={t('filters.searchPlaceholder')}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-9"
                      />
                      {filters.search && (
                        <button
                          onClick={() => setFilters({ ...filters, search: '' })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('filters.eventType')}
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value as EventType | '' })}
                    >
                      <option value="">{t('filters.allTypes')}</option>
                      <option value={EventType.WORKSHOP}>{t('filters.typeWorkshop')}</option>
                      <option value={EventType.NETWORKING}>{t('filters.typeNetworking')}</option>
                      <option value={EventType.CONFERENCE}>{t('filters.typeConference')}</option>
                      <option value={EventType.WEBINAR}>{t('filters.typeWebinar')}</option>
                      <option value={EventType.MEETUP}>{t('filters.typeMeetup')}</option>
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('filters.format')}
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.format}
                      onChange={(e) => setFilters({ ...filters, format: e.target.value as EventFormat | '' })}
                    >
                      <option value="">{t('filters.allFormats')}</option>
                      <option value={EventFormat.ONLINE}>{t('filters.formatOnline')}</option>
                      <option value={EventFormat.OFFLINE}>{t('filters.formatOffline')}</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('filters.category')}
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as EventCategory | '' })}
                    >
                      <option value="">{t('filters.allCategories')}</option>
                      <option value={EventCategory.REAL_ESTATE}>{t('filters.catRealEstate')}</option>
                      <option value={EventCategory.FINANCIAL}>{t('filters.catFinancial')}</option>
                      <option value={EventCategory.BOTH}>{t('filters.catBoth')}</option>
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        checked={filters.featured}
                        onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                      />
                      <span className="text-sm font-medium">
                        {t('filters.featuredOnly')}
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && <EventsGridSkeleton count={6} />}

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-12 text-center">
                <p className="text-red-600">
                  {t('loadErrorLong')}
                </p>
              </div>
            )}

            {/* Events Grid */}
            {!isLoading && !error && (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="rounded-lg border bg-white p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {t('empty.title')}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {t('empty.description')}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        {t('empty.clearFilters')}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

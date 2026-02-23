'use client'

import { useState, useMemo, useEffect } from 'react'
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
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
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

  useEffect(() => {
    document.title = 'Katalóg eventov | Komunita | tvujspecialista.cz'
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Katalóg eventov</h1>
          <p className="text-lg text-muted-foreground">
            {isLoading ? (
              'Načítavanie...'
            ) : error ? (
              'Chyba pri načítaní eventov'
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
                    <CardTitle>Filtre</CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto p-0 text-xs hover:text-destructive"
                      >
                        Vymazať
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Hľadať
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Názov, miesto..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-9"
                      />
                      {filters.search && (
                        <button
                          onClick={() => setFilters({ ...filters, search: '' })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Typ eventu
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value as EventType | '' })}
                    >
                      <option value="">Všetky typy</option>
                      <option value={EventType.WORKSHOP}>Workshop</option>
                      <option value={EventType.NETWORKING}>Networking</option>
                      <option value={EventType.CONFERENCE}>Konferencia</option>
                      <option value={EventType.WEBINAR}>Webinár</option>
                      <option value={EventType.MEETUP}>Meetup</option>
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Formát
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={filters.format}
                      onChange={(e) => setFilters({ ...filters, format: e.target.value as EventFormat | '' })}
                    >
                      <option value="">Všetky formáty</option>
                      <option value={EventFormat.ONLINE}>Online</option>
                      <option value={EventFormat.OFFLINE}>Offline</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Kategória
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as EventCategory | '' })}
                    >
                      <option value="">Všetky kategórie</option>
                      <option value={EventCategory.REAL_ESTATE}>Reality</option>
                      <option value={EventCategory.FINANCIAL}>Finance</option>
                      <option value={EventCategory.BOTH}>Reality & Finance</option>
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        checked={filters.featured}
                        onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                      />
                      <span className="text-sm font-medium">
                        Iba featured eventy
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
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
                <p className="text-destructive">
                  Chyba pri načítaní eventov. Skúste to prosím znova.
                </p>
              </div>
            )}

            {/* Events Grid */}
            {!isLoading && !error && (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="rounded-lg border bg-card p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Žiadne eventy
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Skúste zmeniť filtre alebo hľadajte iné kľúčové slová.
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        Vymazať filtre
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

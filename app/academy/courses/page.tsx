'use client'

import { useState, useMemo, useEffect } from 'react'
import { CourseCard } from '@/components/academy/CourseCard'
import { CoursesGridSkeleton } from '@/components/academy/LoadingStates'
import { useCourses } from '@/lib/hooks/useAcademy'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCategory, CourseLevel } from '@/types/academy'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export default function CourseCatalogPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '' as CourseCategory | '',
    level: '' as CourseLevel | '',
    featured: false,
  })

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 300)

  // Build API filters
  const apiFilters = useMemo(() => ({
    category: filters.category || undefined,
    level: filters.level || undefined,
    featured: filters.featured || undefined,
  }), [filters.category, filters.level, filters.featured])

  const { data, isLoading, error } = useCourses(apiFilters)

  // Client-side search filter (if needed)
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return []

    if (!debouncedSearch) return data.courses

    const searchLower = debouncedSearch.toLowerCase()
    return data.courses.filter(course =>
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructorName.toLowerCase().includes(searchLower)
    )
  }, [data?.courses, debouncedSearch])

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      featured: false,
    })
  }

  const hasActiveFilters = filters.search || filters.category || filters.level || filters.featured

  useEffect(() => {
    document.title = 'Katalóg kurzov | Akadémia | tvujspecialista.cz'
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Katalóg kurzov</h1>
          <p className="text-lg text-muted-foreground">
            {isLoading ? (
              'Načítavanie...'
            ) : error ? (
              'Chyba pri načítaní kurzov'
            ) : (
              <>
                Nájdených <span className="font-semibold">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'kurz' : filteredCourses.length < 5 ? 'kurzy' : 'kurzov'}
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
                        placeholder="Názov, lektor..."
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

                  {/* Category Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Kategória
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as CourseCategory | '' })}
                    >
                      <option value="">Všetky kategórie</option>
                      <option value={CourseCategory.REAL_ESTATE}>Reality</option>
                      <option value={CourseCategory.FINANCIAL}>Finance</option>
                      <option value={CourseCategory.BOTH}>Reality & Finance</option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Úroveň
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value as CourseLevel | '' })}
                    >
                      <option value="">Všetky úrovne</option>
                      <option value={CourseLevel.BEGINNER}>Začiatočník</option>
                      <option value={CourseLevel.INTERMEDIATE}>Stredný</option>
                      <option value={CourseLevel.ADVANCED}>Pokročilý</option>
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
                        Iba featured kurzy
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && <CoursesGridSkeleton count={6} />}

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
                <p className="text-destructive">
                  Chyba pri načítaní kurzov. Skúste to prosím znova.
                </p>
              </div>
            )}

            {/* Courses Grid */}
            {!isLoading && !error && (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="rounded-lg border bg-card p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Žiadne kurzy
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
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
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

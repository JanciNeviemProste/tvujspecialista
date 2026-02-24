'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('academy')
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
      course.title?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.instructorName?.toLowerCase().includes(searchLower)
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{t('courses.title')}</h1>
          <p className="text-lg text-gray-500">
            {isLoading ? (
              t('courses.loading')
            ) : error ? (
              t('courses.loadError')
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
                    <CardTitle>{t('courses.filters.title')}</CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto p-0 text-xs hover:text-red-600"
                      >
                        {t('courses.filters.clear')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('courses.filters.search')}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        type="text"
                        placeholder={t('courses.filters.searchPlaceholder')}
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

                  {/* Category Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('courses.filters.category')}
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as CourseCategory | '' })}
                    >
                      <option value="">{t('courses.filters.allCategories')}</option>
                      <option value={CourseCategory.REAL_ESTATE}>{t('courses.filters.catRealEstate')}</option>
                      <option value={CourseCategory.FINANCIAL}>{t('courses.filters.catFinancial')}</option>
                      <option value={CourseCategory.BOTH}>{t('courses.filters.catBoth')}</option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t('courses.filters.level')}
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value as CourseLevel | '' })}
                    >
                      <option value="">{t('courses.filters.allLevels')}</option>
                      <option value={CourseLevel.BEGINNER}>{t('courses.filters.levelBeginner')}</option>
                      <option value={CourseLevel.INTERMEDIATE}>{t('courses.filters.levelIntermediate')}</option>
                      <option value={CourseLevel.ADVANCED}>{t('courses.filters.levelAdvanced')}</option>
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
                        {t('courses.filters.featuredOnly')}
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
              <div className="rounded-lg border border-red-300 bg-red-50 p-12 text-center">
                <p className="text-red-600">
                  {t('courses.loadErrorLong')}
                </p>
              </div>
            )}

            {/* Courses Grid */}
            {!isLoading && !error && (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="rounded-lg border bg-white p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {t('courses.empty.title')}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {t('courses.empty.description')}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        {t('courses.empty.clearFilters')}
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

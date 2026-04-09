import { EditableText } from '@/components/editor/EditableText';
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
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold"><EditableText tKey="academy.courses.title">{t('courses.title')}</EditableText></h1>
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
                    <CardTitle><EditableText tKey="academy.courses.filters.title">{t('courses.filters.title')}</EditableText></CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto p-0 text-xs hover:text-red-600"
                      >
                        <EditableText tKey="academy.courses.filters.clear">{t('courses.filters.clear')}</EditableText>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      <EditableText tKey="academy.courses.filters.search">{t('courses.filters.search')}</EditableText>
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      <EditableText tKey="academy.courses.filters.category">{t('courses.filters.category')}</EditableText>
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as CourseCategory | '' })}
                    >
                      <option value=""><EditableText tKey="academy.courses.filters.allCategories">{t('courses.filters.allCategories')}</EditableText></option>
                      <option value={CourseCategory.REAL_ESTATE}><EditableText tKey="academy.courses.filters.catRealEstate">{t('courses.filters.catRealEstate')}</EditableText></option>
                      <option value={CourseCategory.FINANCIAL}><EditableText tKey="academy.courses.filters.catFinancial">{t('courses.filters.catFinancial')}</EditableText></option>
                      <option value={CourseCategory.BOTH}><EditableText tKey="academy.courses.filters.catBoth">{t('courses.filters.catBoth')}</EditableText></option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      <EditableText tKey="academy.courses.filters.level">{t('courses.filters.level')}</EditableText>
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value as CourseLevel | '' })}
                    >
                      <option value=""><EditableText tKey="academy.courses.filters.allLevels">{t('courses.filters.allLevels')}</EditableText></option>
                      <option value={CourseLevel.BEGINNER}><EditableText tKey="academy.courses.filters.levelBeginner">{t('courses.filters.levelBeginner')}</EditableText></option>
                      <option value={CourseLevel.INTERMEDIATE}><EditableText tKey="academy.courses.filters.levelIntermediate">{t('courses.filters.levelIntermediate')}</EditableText></option>
                      <option value={CourseLevel.ADVANCED}><EditableText tKey="academy.courses.filters.levelAdvanced">{t('courses.filters.levelAdvanced')}</EditableText></option>
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        checked={filters.featured}
                        onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                      />
                      <span className="text-sm font-medium">
                        <EditableText tKey="academy.courses.filters.featuredOnly">{t('courses.filters.featuredOnly')}</EditableText>
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
                  <EditableText tKey="academy.courses.loadErrorLong">{t('courses.loadErrorLong')}</EditableText>
                </p>
              </div>
            )}

            {/* Courses Grid */}
            {!isLoading && !error && (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="rounded-lg border bg-white dark:bg-card p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold">
                      <EditableText tKey="academy.courses.empty.title">{t('courses.empty.title')}</EditableText>
                    </h3>
                    <p className="text-gray-500 mb-4">
                      <EditableText tKey="academy.courses.empty.description">{t('courses.empty.description')}</EditableText>
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        <EditableText tKey="academy.courses.empty.clearFilters">{t('courses.empty.clearFilters')}</EditableText>
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

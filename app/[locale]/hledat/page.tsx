'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SpecialistCard } from '@/components/shared/SpecialistCard';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { useSpecialists } from '@/lib/hooks/useSpecialists';
import { SpecialistCategory, Specialist } from '@/types/specialist';
import { regions } from '@/mocks/regions';
import { EditableText } from '@/components/editor/EditableText';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const t = useTranslations('search');
  const tCommon = useTranslations('common');

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: initialCategory,
    region: '',
    minRating: undefined as number | undefined,
    verified: false,
    sortBy: 'rating' as 'rating' | 'newest',
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const { data, isLoading, error } = useSpecialists({
    category: (filters.category || undefined) as SpecialistCategory | undefined,
    region: filters.region || undefined,
    minRating: filters.minRating,
    verified: filters.verified || undefined,
    sortBy: filters.sortBy,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <PublicHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-foreground"><EditableText tKey="search.title">{t('title')}</EditableText></h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            {isLoading ? (
              t('loading')
            ) : error ? (
              t('loadError')
            ) : (
              <>
                <EditableText tKey="search.found">{t('found')}</EditableText> <span className="font-semibold">{data?.total || 0}</span> <EditableText tKey="search.specialists">{t('specialists')}</EditableText>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border dark:border-border bg-white dark:bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold dark:text-foreground"><EditableText tKey="search.filters.title">{t('filters.title')}</EditableText></h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground"><EditableText tKey="search.filters.category">{t('filters.category')}</EditableText></label>
                <select
                  aria-label={t('filters.selectCategory')}
                  className="w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                >
                  <option value=""><EditableText tKey="search.filters.allCategories">{t('filters.allCategories')}</EditableText></option>
                  <option value="Finanční poradce">Finanční poradce</option>
                  <option value="Realitní makléř">Realitní makléř</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground"><EditableText tKey="search.filters.location">{t('filters.location')}</EditableText></label>
                <select
                  aria-label={t('filters.selectLocation')}
                  className="w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.region || ''}
                  onChange={(e) => updateFilters({ region: e.target.value })}
                >
                  <option value=""><EditableText tKey="search.filters.allLocations">{t('filters.allLocations')}</EditableText></option>
                  {regions.filter(r => r.country === 'CZ').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground">
                  <EditableText tKey="search.filters.minRating">{t('filters.minRating')}</EditableText>
                </label>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating}
                        onChange={(e) =>
                          updateFilters({ minRating: parseInt(e.target.value) })
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground">{t('filters.stars', { count: rating })}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded text-blue-600"
                    checked={filters.verified}
                    onChange={(e) => updateFilters({ verified: e.target.checked })}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground"><EditableText tKey="search.filters.verifiedOnly">{t('filters.verifiedOnly')}</EditableText></span>
                </label>
              </div>

            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-muted-foreground"><EditableText tKey="search.sort.label">{t('sort.label')}</EditableText></p>
              <select
                aria-label={t('sort.sortResults')}
                className="rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({
                    sortBy: e.target.value as 'rating' | 'newest',
                  })
                }
              >
                <option value="rating"><EditableText tKey="search.sort.bestRating">{t('sort.bestRating')}</EditableText></option>
                <option value="newest"><EditableText tKey="search.sort.newest">{t('sort.newest')}</EditableText></option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 text-4xl">⏳</div>
                  <p className="text-gray-600 dark:text-muted-foreground"><EditableText tKey="search.loadingSpecialists">{t('loadingSpecialists')}</EditableText></p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 text-center">
                <p className="text-red-600 dark:text-red-400">
                  <EditableText tKey="search.loadErrorLong">{t('loadErrorLong')}</EditableText>
                </p>
              </div>
            )}

            {/* Specialists Grid */}
            {!isLoading && !error && data && (
              <>
                {data.specialists.length === 0 ? (
                  <div className="rounded-lg border dark:border-border bg-white dark:bg-card p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-foreground">
                      <EditableText tKey="search.empty.title">{t('empty.title')}</EditableText>
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      <EditableText tKey="search.empty.description">{t('empty.description')}</EditableText>
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {data.specialists.map((specialist: Specialist) => (
                      <SpecialistCard key={specialist.id} specialist={specialist} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      className="rounded border dark:border-border px-4 py-2 text-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted dark:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <EditableText tKey="common.actions.previous">{tCommon('actions.previous')}</EditableText>
                    </button>
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`rounded px-4 py-2 text-sm ${
                          p === page
                            ? 'bg-blue-600 text-white'
                            : 'border dark:border-border hover:bg-gray-50 dark:hover:bg-muted dark:text-foreground'
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="rounded border dark:border-border px-4 py-2 text-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-muted dark:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <EditableText tKey="common.actions.next">{tCommon('actions.next')}</EditableText>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

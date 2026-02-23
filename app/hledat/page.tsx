'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SpecialistCard } from '@/components/shared/SpecialistCard';
import { useSpecialists } from '@/lib/hooks/useSpecialists';
import { SpecialistCategory, Specialist } from '@/types/specialist';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: initialCategory,
    location: '',
    minRating: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    verified: false,
    sortBy: 'rating' as 'rating' | 'price-asc' | 'price-desc' | 'newest',
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const { data, isLoading, error } = useSpecialists({
    category: (filters.category || undefined) as SpecialistCategory | undefined,
    location: filters.location || undefined,
    minRating: filters.minRating,
    maxPrice: filters.maxPrice,
    verified: filters.verified || undefined,
    sortBy: filters.sortBy,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-primary">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/hledat" className="text-sm font-medium text-blue-600 dark:text-primary">
              Hledat
            </Link>
            <Link href="/ceny" className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary">
              Ceny
            </Link>
            <Link
              href="/profi/registrace"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Pro specialisty
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-foreground">Najděte svého specialistu</h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            {isLoading ? (
              'Načítání...'
            ) : error ? (
              'Chyba při načítání specialistů'
            ) : (
              <>
                Nalezeno <span className="font-semibold">{data?.total || 0}</span> specialistů
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border dark:border-border bg-white dark:bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold dark:text-foreground">Filtry</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground">Kategorie</label>
                <select
                  aria-label="Vyberte kategorii"
                  className="w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                >
                  <option value="">Všechny kategorie</option>
                  <option value="Finanční poradce">Finanční poradce</option>
                  <option value="Realitní makléř">Realitní makléř</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground">Lokalita</label>
                <select
                  aria-label="Vyberte lokalitu"
                  className="w-full rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                >
                  <option value="">Všechny lokality</option>
                  <option value="Praha">Praha</option>
                  <option value="Brno">Brno</option>
                  <option value="Ostrava">Ostrava</option>
                  <option value="Plzeň">Plzeň</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground">
                  Hodnocení minimálně
                </label>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
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
                      <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground">{rating}+ hvězdiček</span>
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
                  <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground">Pouze ověření specialisté</span>
                </label>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-foreground">
                  Maximální cena (Kč/hod)
                </label>
                <input
                  type="number"
                  placeholder="např. 1000"
                  className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    updateFilters({
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>

            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Seřadit podle:</p>
              <select
                aria-label="Seřadit výsledky"
                className="rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({
                    sortBy: e.target.value as 'rating' | 'price-asc' | 'price-desc' | 'newest',
                  })
                }
              >
                <option value="rating">Nejlepší hodnocení</option>
                <option value="price-asc">Cena: od nejnižší</option>
                <option value="price-desc">Cena: od nejvyšší</option>
                <option value="newest">Nově přidaní</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 text-4xl">⏳</div>
                  <p className="text-gray-600 dark:text-muted-foreground">Načítání specialistů...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 text-center">
                <p className="text-red-600 dark:text-red-400">
                  Chyba při načítání specialistů. Zkuste to prosím znovu.
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
                      Žádní specialisté nenalezeni
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      Zkuste změnit filtry nebo hledejte v jiné lokalitě.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.specialists.map((specialist: Specialist) => (
                      <SpecialistCard key={specialist.id} specialist={specialist} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      className="rounded border dark:border-border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-muted dark:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Předchozí
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
                      className="rounded border dark:border-border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-muted dark:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Další
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

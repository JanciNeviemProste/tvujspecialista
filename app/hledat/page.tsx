'use client';

import { useState } from 'react';
import { SpecialistCard } from '@/components/shared/SpecialistCard';
import { useSpecialists } from '@/lib/hooks/useSpecialists';
import { SpecialistCategory, Specialist } from '@/types/specialist';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minRating: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    verified: false,
    sortBy: 'rating' as 'rating' | 'price-asc' | 'price-desc' | 'newest',
  });

  const { data, isLoading, error } = useSpecialists({
    category: (filters.category || undefined) as SpecialistCategory | undefined,
    location: filters.location || undefined,
    minRating: filters.minRating,
    maxPrice: filters.maxPrice,
    verified: filters.verified || undefined,
    sortBy: filters.sortBy,
    page: 1,
    limit: 20,
  });

  const handleApplyFilters = () => {
    // Filters are already applied via React Query
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium text-blue-600">
              Hledat
            </a>
            <a href="/ceny" className="text-sm font-medium hover:text-blue-600">
              Ceny
            </a>
            <a
              href="/profi/registrace"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Pro specialisty
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Najděte svého specialistu</h1>
          <p className="text-gray-600">
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
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Filtry</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Kategorie</label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">Všechny kategorie</option>
                  <option value="Finanční poradce">Finanční poradce</option>
                  <option value="Realitní makléř">Realitní makléř</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Lokalita</label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                          setFilters({ ...filters, minRating: parseInt(e.target.value) })
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rating}+ hvězdiček</span>
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
                    onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Pouze ověření specialisté</span>
                </label>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Maximální cena (Kč/hod)
                </label>
                <input
                  type="number"
                  placeholder="např. 1000"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Použít filtry
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Seřadit podle:</p>
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
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
                  <p className="text-gray-600">Načítání specialistů...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-600">
                  Chyba při načítání specialistů. Zkuste to prosím znovu.
                </p>
              </div>
            )}

            {/* Specialists Grid */}
            {!isLoading && !error && data && (
              <>
                {data.specialists.length === 0 ? (
                  <div className="rounded-lg border bg-white p-12 text-center">
                    <div className="mb-4 text-5xl">🔍</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      Žádní specialisté nenalezeni
                    </h3>
                    <p className="text-gray-600">
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
                {data.specialists.length > 0 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button className="rounded border px-4 py-2 text-sm hover:bg-gray-50" disabled>
                      Předchozí
                    </button>
                    <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white">1</button>
                    <button className="rounded border px-4 py-2 text-sm hover:bg-gray-50">2</button>
                    <button className="rounded border px-4 py-2 text-sm hover:bg-gray-50">3</button>
                    <button className="rounded border px-4 py-2 text-sm hover:bg-gray-50">
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

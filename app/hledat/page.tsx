import { SpecialistCard } from '@/components/shared/SpecialistCard'

// Mock data - v budúcnosti z API
const mockSpecialists = [
  {
    id: '1',
    slug: 'jan-novak-financni-poradce-praha',
    name: 'Jan Novák',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: true,
    category: 'Finanční poradce',
    location: 'Praha',
    bio: 'Komplexní finanční poradenství přes 10 let. Pomohl jsem stovkám klientů s hypotékami, pojištěním a investicemi...',
    rating: 4.9,
    reviewsCount: 47,
    hourlyRate: 800,
  },
  {
    id: '2',
    slug: 'petra-svobodova-financni-poradce-brno',
    name: 'Petra Svobodová',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Finanční poradce',
    location: 'Brno',
    bio: 'Finanční poradkyně s 8 lety praxe. Pomohu vám s komplexním finančním plánováním...',
    rating: 4.8,
    reviewsCount: 32,
    hourlyRate: 600,
  },
  {
    id: '3',
    slug: 'lucie-novotna-realitni-makler-ostrava',
    name: 'Lucie Novotná',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Realitní makléř',
    location: 'Ostrava',
    bio: 'Realitní makléřka se specializací na prodej bytů a rodinných domů. Za svou kariéru jsem úspěšně zprostředkovala přes 150 transakcí...',
    rating: 4.7,
    reviewsCount: 28,
    hourlyRate: 0,
  },
]

export default function SearchPage() {
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
            Nalezeno <span className="font-semibold">{mockSpecialists.length}</span> specialistů
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
                <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Všechny kategorie</option>
                  <option value="financni-poradce">Finanční poradce</option>
                  <option value="realitni-makler">Realitní makléř</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Lokalita</label>
                <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Všechny lokality</option>
                  <option value="praha">Praha</option>
                  <option value="brno">Brno</option>
                  <option value="ostrava">Ostrava</option>
                  <option value="plzen">Plzeň</option>
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
                  <input type="checkbox" className="h-4 w-4 rounded text-blue-600" />
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
                />
              </div>

              <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Použít filtry
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Seřadit podle:</p>
              <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="rating">Nejlepší hodnocení</option>
                <option value="price-asc">Cena: od nejnižší</option>
                <option value="price-desc">Cena: od nejvyšší</option>
                <option value="newest">Nově přidaní</option>
              </select>
            </div>

            {/* Specialists Grid */}
            <div className="space-y-4">
              {mockSpecialists.map((specialist) => (
                <SpecialistCard key={specialist.id} specialist={specialist} />
              ))}
            </div>

            {/* Pagination */}
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
          </div>
        </div>
      </div>
    </div>
  )
}

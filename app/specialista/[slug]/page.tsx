import { RatingStars } from '@/components/shared/RatingStars'

// Mock data - v budúcnosti z API podle slug
const mockSpecialist = {
  name: 'Jan Novák',
  photo: '/images/placeholder-avatar.png',
  verified: true,
  topSpecialist: true,
  category: 'Finanční poradce',
  location: 'Praha',
  bio: 'Komplexní finanční poradenství přes 10 let. Pomohl jsem stovkám klientů s hypotékami, pojištěním a investicemi. Specializuji se na refinancování, životní pojištění a budování investičního portfolia. Mám mezinárodní certifikace a dlouholeté zkušenosti z velkých finančních institucí.',
  yearsExperience: 10,
  hourlyRate: 800,
  rating: 4.9,
  reviewsCount: 47,
  services: [
    'Hypotéky a refinancování',
    'Životní pojištění',
    'Investiční strategie',
    'Finanční plánování',
  ],
  certifications: ['Certifikovaný finanční poradce', 'Pojišťovací makléř', 'Hypoteční specialista'],
  education: 'VŠE Praha, Finance a účetnictví',
  website: 'https://finance-novak.cz',
  linkedin: 'https://linkedin.com/in/jannovak',
  availability: ['Po', 'Út', 'St', 'Čt', 'Pá'],
}

const mockReviews = [
  {
    id: '1',
    customerName: 'Petr Svoboda',
    rating: 5,
    text: 'Pan Novák mi pomohl najít skvělou hypotéku s nejnižším úrokem na trhu. Velmi profesionální přístup, vše vyřídil rychle a bez problémů. Mohu jen doporučit!',
    verified: true,
    date: '15.12.2024',
  },
  {
    id: '2',
    customerName: 'Marie Nováková',
    rating: 5,
    text: 'Jsem velmi spokojená. Jan byl trpělivý, vysvětlil mi vše srozumitelně a našel mi hypotéku přesně podle mých představ.',
    verified: true,
    date: '20.11.2024',
  },
]

export default function SpecialistDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </a>
            <a href="/ceny" className="text-sm font-medium hover:text-blue-600">
              Ceny
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="rounded-lg border bg-white p-8">
              <div className="flex items-start gap-6">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={mockSpecialist.photo}
                    alt={mockSpecialist.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">{mockSpecialist.name}</h1>
                    {mockSpecialist.verified && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Ověřený
                      </span>
                    )}
                    {mockSpecialist.topSpecialist && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                        Top
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-lg text-gray-600">
                    {mockSpecialist.category} • {mockSpecialist.location}
                  </p>

                  <div className="mb-4">
                    <RatingStars
                      rating={mockSpecialist.rating}
                      count={mockSpecialist.reviewsCount}
                      size="md"
                    />
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">{mockSpecialist.yearsExperience}</span> let
                      praxe
                    </div>
                    {mockSpecialist.hourlyRate > 0 && (
                      <div>
                        <span className="font-semibold">{mockSpecialist.hourlyRate} Kč</span>/hod
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-lg border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">O mně</h2>
              <p className="text-gray-700 leading-relaxed">{mockSpecialist.bio}</p>
            </div>

            {/* Services */}
            <div className="rounded-lg border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Služby</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {mockSpecialist.services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="rounded-lg border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Vzdělání a certifikace</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Vzdělání</h3>
                  <p className="text-gray-700">{mockSpecialist.education}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Certifikace</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {mockSpecialist.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-lg border bg-white p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Recenze ({mockReviews.length})
              </h2>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                        {review.verified && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Ověřená recenze
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="mb-2">
                      <RatingStars rating={review.rating} showCount={false} size="sm" />
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Contact Card */}
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Kontaktovat specialistu</h3>
                <form className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Vaše jméno *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Jan Novák"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="jan@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="+420 777 123 456"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Zpráva *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Popište, s čím potřebujete pomoci..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Odeslat poptávku
                  </button>
                </form>
              </div>

              {/* Info Card */}
              <div className="rounded-lg border bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Další informace</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Dostupnost:</span>
                    <p className="font-medium text-gray-900">
                      {mockSpecialist.availability.join(', ')}
                    </p>
                  </div>
                  {mockSpecialist.website && (
                    <div>
                      <span className="text-gray-600">Web:</span>
                      <a
                        href={mockSpecialist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-blue-600 hover:underline"
                      >
                        {mockSpecialist.website}
                      </a>
                    </div>
                  )}
                  {mockSpecialist.linkedin && (
                    <div>
                      <span className="text-gray-600">LinkedIn:</span>
                      <a
                        href={mockSpecialist.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-blue-600 hover:underline"
                      >
                        Profil na LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

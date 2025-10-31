import { RatingStars } from './RatingStars'

interface SpecialistCardProps {
  specialist: {
    slug: string
    name: string
    photo: string
    verified: boolean
    topSpecialist: boolean
    category: string
    location: string
    rating: number
    reviewsCount: number
    hourlyRate: number
    bio: string
  }
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <a
      href={`/specialista/${specialist.slug}`}
      className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
            <img
              src={specialist.photo}
              alt={specialist.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3E' + specialist.name[0] + '%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{specialist.name}</h3>
            {specialist.verified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                Ověřený
              </span>
            )}
            {specialist.topSpecialist && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Top
              </span>
            )}
          </div>

          <p className="mb-2 text-sm text-gray-600">
            {specialist.category} • {specialist.location}
          </p>

          <div className="mb-2">
            <RatingStars rating={specialist.rating} count={specialist.reviewsCount} size="sm" />
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-700">{specialist.bio}</p>

          {specialist.hourlyRate > 0 && (
            <p className="text-sm font-medium text-gray-900">Od {specialist.hourlyRate} Kč/hod</p>
          )}

          <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Kontaktovat
          </button>
        </div>
      </div>
    </a>
  )
}

import { memo } from 'react'
import Image from 'next/image'
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

export const SpecialistCard = memo(function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <a
      href={`/specialista/${specialist.slug}`}
      className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
            <Image
              src={specialist.photo}
              alt={specialist.name}
              fill
              sizes="80px"
              className="object-cover"
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
})

'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
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
    bio: string
  }
}

export const SpecialistCard = memo(function SpecialistCard({ specialist }: SpecialistCardProps) {
  const tCommon = useTranslations('common')
  return (
    <a
      href={`/specialista/${specialist.slug}`}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-card dark:border-border"
    >
      {/* Photo — dominant, full-width */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={specialist.photo}
          alt={specialist.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges overlaid on photo */}
        <div className="absolute top-3 left-3 flex gap-2">
          {specialist.verified && (
            <span className="rounded-full bg-green-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              {tCommon('status.verified')}
            </span>
          )}
          {specialist.topSpecialist && (
            <span className="rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              {tCommon('status.top')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-foreground">
          {specialist.name}
        </h3>
        <p className="mb-2 text-sm text-gray-500 dark:text-muted-foreground">
          {specialist.category} &middot; {specialist.location}
        </p>
        <div className="mb-3">
          <RatingStars rating={specialist.rating} count={specialist.reviewsCount} size="sm" />
        </div>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-muted-foreground">
          {specialist.bio}
        </p>
        <div className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-blue-700">
          {tCommon('actions.contact')}
        </div>
      </div>
    </a>
  )
})

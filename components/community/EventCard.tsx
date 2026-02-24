import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { Event, EventType, EventFormat } from '@/types/community'
import { MapPin, Video, Calendar, Users, Clock } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/dateFormat'

interface EventCardProps {
  event: Event
  showRSVPButton?: boolean
  className?: string
}

function getEventFormatLabel(format: EventFormat): string {
  return format === EventFormat.ONLINE ? 'Online' : 'Offline'
}

const typeColorMap: Record<EventType, string> = {
  [EventType.WORKSHOP]: 'bg-purple-100 text-purple-700',
  [EventType.NETWORKING]: 'bg-blue-100 text-blue-700',
  [EventType.CONFERENCE]: 'bg-orange-100 text-orange-700',
  [EventType.WEBINAR]: 'bg-green-100 text-green-700',
  [EventType.MEETUP]: 'bg-pink-100 text-pink-700',
}

export const EventCard = memo(function EventCard({ event, showRSVPButton = true, className }: EventCardProps) {
  const t = useTranslations('community')

  const eventTypeLabels: Record<EventType, string> = {
    [EventType.WORKSHOP]: t('event.workshop'),
    [EventType.NETWORKING]: 'Networking',
    [EventType.CONFERENCE]: t('event.conference'),
    [EventType.WEBINAR]: t('event.webinar'),
    [EventType.MEETUP]: t('event.meetup'),
  }

  const href = `/community/events/${event.slug}`
  const isFullyBooked = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false
  const isFree = event.price === 0

  const formattedDate = formatDate(event.startDate, 'd. MMM yyyy')
  const formattedTime = formatDate(event.startDate, 'HH:mm')

  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendeeCount : null

  return (
    <Link href={href} className={cn('block h-full', className)}>
      <div className="overflow-hidden h-full flex flex-col group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Banner */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {event.bannerImage ? (
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-white/30" />
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Date badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          </div>

          {/* Featured badge */}
          {event.featured && (
            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-amber-400/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm">
              Featured
            </span>
          )}

          {/* Type & format badges at bottom of image */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-sm', typeColorMap[event.type])}>
              {eventTypeLabels[event.type]}
            </span>
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
              {event.format === EventFormat.ONLINE ? (
                <><Video className="h-3 w-3 mr-1" />{getEventFormatLabel(event.format)}</>
              ) : (
                <><MapPin className="h-3 w-3 mr-1" />{getEventFormatLabel(event.format)}</>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2">
            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{formattedTime}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {event.format === EventFormat.ONLINE ? (
                <>
                  <Video className="h-4 w-4 shrink-0" />
                  <span>{t('event.onlineMeeting')}</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{event.location || 'TBA'}</span>
                </>
              )}
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4 shrink-0" />
              <span>
                {event.attendeeCount}
                {event.maxAttendees && <span> / {event.maxAttendees}</span>}
              </span>
              {isFullyBooked && (
                <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium">
                  {t('event.full')}
                </span>
              )}
              {!isFullyBooked && spotsLeft !== null && spotsLeft <= 10 && (
                <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium">
                  {spotsLeft} {spotsLeft === 1 ? 'miesto' : spotsLeft < 5 ? 'miesta' : 'miest'}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-0 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {isFree ? t('event.free') : `${event.price} ${event.currency}`}
          </span>
          <span className="inline-flex items-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium group-hover:bg-blue-700 transition-colors">
            {isFullyBooked ? t('event.full') : showRSVPButton ? t('event.register') : t('event.viewDetail')}
          </span>
        </div>
      </div>
    </Link>
  )
})

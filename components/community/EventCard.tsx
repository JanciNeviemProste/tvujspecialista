import { Event, EventType, EventFormat } from '@/types/community'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Video, Calendar, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/dateFormat'

interface EventCardProps {
  event: Event
  showRSVPButton?: boolean
  className?: string
}

function getEventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    [EventType.WORKSHOP]: 'Workshop',
    [EventType.NETWORKING]: 'Networking',
    [EventType.CONFERENCE]: 'Konferencia',
    [EventType.WEBINAR]: 'Webinár',
    [EventType.MEETUP]: 'Meetup',
  }
  return labels[type]
}

function getEventFormatLabel(format: EventFormat): string {
  return format === EventFormat.ONLINE ? 'Online' : 'Offline'
}

export function EventCard({ event, showRSVPButton = true, className }: EventCardProps) {
  const href = `/community/events/${event.slug}`
  const isFullyBooked = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false
  const isFree = event.price === 0

  // Format date
  const formattedDate = formatDate(event.startDate, 'd. MMM yyyy')
  const formattedTime = formatDate(event.startDate, 'HH:mm')

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden h-full flex flex-col group', className)}
    >
      {/* Banner with overlay badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Date badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge variant="gold" className="shadow-lg flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </Badge>
        </div>

        {/* Featured badge */}
        {event.featured && (
          <Badge variant="gold" className="absolute top-2 right-2 shadow-lg">
            Featured
          </Badge>
        )}

        {/* Type badge at bottom */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <Badge variant="default" className="shadow-lg">
            {getEventTypeLabel(event.type)}
          </Badge>
          <Badge
            variant={event.format === EventFormat.ONLINE ? 'default' : 'outline'}
            className="shadow-lg"
          >
            {getEventFormatLabel(event.format)}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formattedTime}</span>
        </div>

        {/* Location or Meeting Link */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {event.format === EventFormat.ONLINE ? (
            <>
              <Video className="h-4 w-4" />
              <span>Online stretnutie</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location || 'TBA'}</span>
            </>
          )}
        </div>

        {/* Attendees count */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {event.attendeeCount}
            {event.maxAttendees && (
              <span> / {event.maxAttendees}</span>
            )}
          </span>
          {isFullyBooked && (
            <Badge variant="destructive" className="text-xs">
              Obsadené
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent-500">
            {isFree ? 'Zadarmo' : `${event.price} ${event.currency}`}
          </span>
        </div>

        {/* Description preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={href}>
          <Button
            variant="premium"
            className="w-full bg-accent-500 hover:bg-accent-600"
            disabled={isFullyBooked}
          >
            {isFullyBooked ? 'Obsadené' : showRSVPButton ? 'Registrovať sa' : 'Zobraziť detail'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

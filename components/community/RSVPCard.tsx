import { RSVP, RSVPStatus } from '@/types/community'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/dateFormat'
import { EventFormat } from '@/types/community'

interface RSVPCardProps {
  rsvp: RSVP
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  className?: string
}

function getRSVPStatusLabel(status: RSVPStatus): string {
  const labels: Record<RSVPStatus, string> = {
    [RSVPStatus.PENDING]: 'Čaká na potvrdenie',
    [RSVPStatus.CONFIRMED]: 'Potvrdené',
    [RSVPStatus.ATTENDED]: 'Zúčastnený',
    [RSVPStatus.CANCELLED]: 'Zrušené',
  }
  return labels[status]
}

function getRSVPStatusVariant(status: RSVPStatus): 'default' | 'success' | 'destructive' | 'outline' {
  const variants: Record<RSVPStatus, 'default' | 'success' | 'destructive' | 'outline'> = {
    [RSVPStatus.PENDING]: 'default',
    [RSVPStatus.CONFIRMED]: 'success',
    [RSVPStatus.ATTENDED]: 'success',
    [RSVPStatus.CANCELLED]: 'destructive',
  }
  return variants[status]
}

export function RSVPCard({ rsvp, onConfirm, onCancel, className }: RSVPCardProps) {
  if (!rsvp.event) {
    return null
  }

  const { event } = rsvp
  const isPending = rsvp.status === RSVPStatus.PENDING
  const isCancelled = rsvp.status === RSVPStatus.CANCELLED
  const isConfirmed = rsvp.status === RSVPStatus.CONFIRMED
  const isAttended = rsvp.status === RSVPStatus.ATTENDED

  // Format date
  const formattedDate = formatDate(event.startDate, 'd. MMMM yyyy')
  const formattedTime = formatDate(event.startDate, 'HH:mm')

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden', className)}
    >
      {/* Event thumbnail */}
      <div className="relative h-32 overflow-hidden bg-muted">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          className="object-cover"
        />

        {/* Status badge overlay */}
        <Badge
          variant={getRSVPStatusVariant(rsvp.status)}
          className="absolute top-2 right-2 shadow-sm"
        >
          {getRSVPStatusLabel(rsvp.status)}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate} o {formattedTime}</span>
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

        {/* Action buttons */}
        <div className="space-y-2">
          {/* View details button */}
          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href={`/community/events/${event.slug}`}>
              Zobraziť detail
            </Link>
          </Button>

          {/* Confirm/Cancel actions */}
          {isPending && onConfirm && (
            <Button
              variant="premium"
              className="w-full bg-accent-500 hover:bg-accent-600"
              onClick={() => onConfirm(rsvp.id)}
            >
              Potvrdiť účasť
            </Button>
          )}

          {(isPending || isConfirmed) && onCancel && !isCancelled && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onCancel(rsvp.id)}
            >
              Zrušiť registráciu
            </Button>
          )}

          {/* Meeting link (for confirmed online events) */}
          {(isConfirmed || isAttended) && event.format === EventFormat.ONLINE && event.meetingLink && (
            <Button
              variant="default"
              className="w-full"
              asChild
            >
              <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                Pripojiť sa
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

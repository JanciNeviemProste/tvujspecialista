import { memo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { RSVP, RSVPStatus } from '@/types/community'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Video } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import { formatDatePattern as formatDate } from '@/lib/utils/format'
import { EventFormat } from '@/types/community'

import { EditableText } from '@/components/editor/EditableText';
interface RSVPCardProps {
  rsvp: RSVP
  onCancel?: (id: string) => void
  className?: string
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

function RSVPCardInner({ rsvp, onCancel, className }: RSVPCardProps) {
  const t = useTranslations('community')
  const locale = useLocale()

  const rsvpStatusLabels: Record<RSVPStatus, string> = {
    [RSVPStatus.PENDING]: t('rsvp.pending'),
    [RSVPStatus.CONFIRMED]: t('rsvp.confirmed'),
    [RSVPStatus.ATTENDED]: t('rsvp.confirmed'),
    [RSVPStatus.CANCELLED]: t('rsvp.cancelled'),
  }

  if (!rsvp.event) {
    return null
  }

  const { event } = rsvp
  const isCancelled = rsvp.status === RSVPStatus.CANCELLED
  const isConfirmed = rsvp.status === RSVPStatus.CONFIRMED
  const isAttended = rsvp.status === RSVPStatus.ATTENDED

  // Format date
  const formattedDate = formatDate(event.startDate, 'd. MMMM yyyy', locale)
  const formattedTime = formatDate(event.startDate, 'HH:mm', locale)

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden', className)}
    >
      {/* Event thumbnail */}
      <div className="relative h-32 overflow-hidden bg-gray-200 dark:bg-muted">
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
          {rsvpStatusLabels[rsvp.status]}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate} o {formattedTime}</span>
        </div>

        {/* Location or Meeting Link */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {event.format === EventFormat.ONLINE ? (
            <>
              <Video className="h-4 w-4" />
              <span><EditableText tKey="community.rsvp.onlineMeeting">{t('rsvp.onlineMeeting')}</EditableText></span>
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
          <Button asChild variant="outline" className="w-full">
            <Link href={`/community/events/${event.slug}`}>
              <EditableText tKey="community.rsvp.viewDetail">{t('rsvp.viewDetail')}</EditableText>
            </Link>
          </Button>

          {/* Cancel action */}
          {isConfirmed && onCancel && !isCancelled && (
            <Button
              variant="ghost"
              className="w-full text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={() => onCancel(rsvp.id)}
            >
              <EditableText tKey="community.rsvp.cancelRegistration">{t('rsvp.cancelRegistration')}</EditableText>
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
                <EditableText tKey="community.rsvp.join">{t('rsvp.join')}</EditableText>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const RSVPCard = memo(RSVPCardInner)

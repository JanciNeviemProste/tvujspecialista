'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useEvent, useRSVP, useMyRSVPs } from '@/lib/hooks/useCommunity'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, MapPin, Video, Users, Clock, Tag, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { EventType, EventFormat, EventCategory } from '@/types/community'
import { formatDate } from '@/lib/utils/dateFormat'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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

function getCategoryLabel(category: EventCategory): string {
  const labels: Record<EventCategory, string> = {
    [EventCategory.REAL_ESTATE]: 'Reality',
    [EventCategory.FINANCIAL]: 'Finance',
    [EventCategory.BOTH]: 'Reality & Finance',
  }
  return labels[category]
}

export default function EventDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: event, isLoading, error } = useEvent(slug)
  const { data: myRSVPs } = useMyRSVPs()
  const rsvpMutation = useRSVP()

  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (event && myRSVPs) {
      const hasRSVP = myRSVPs.some(
        rsvp => rsvp.eventId === event.id && rsvp.status !== 'cancelled'
      )
      setIsRegistered(hasRSVP)
    }
  }, [event, myRSVPs])

  useEffect(() => {
    if (event) {
      document.title = `${event.title} | Komunita | tvujspecialista.cz`
    }
  }, [event])

  const handleRSVP = async () => {
    if (!isAuthenticated) {
      router.push('/profi/prihlaseni')
      return
    }

    if (!event) return

    try {
      await rsvpMutation.mutateAsync(event.id)
      setIsRegistered(true)
    } catch (error) {
      console.error('Failed to RSVP:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
            <p className="text-destructive">
              Event nenájdený alebo došlo k chybe pri načítaní.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isFullyBooked = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false
  const isFree = event.price === 0

  // Format dates
  const formattedStartDate = formatDate(event.startDate, 'd. MMMM yyyy')
  const formattedStartTime = formatDate(event.startDate, 'HH:mm')
  const formattedEndTime = formatDate(event.endDate, 'HH:mm')

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image */}
      <div className="relative h-96 w-full overflow-hidden bg-muted">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex gap-2 mb-4">
              <Badge variant="gold">
                {getEventTypeLabel(event.type)}
              </Badge>
              <Badge variant="default">
                {getEventFormatLabel(event.format)}
              </Badge>
              {event.featured && (
                <Badge variant="gold">Featured</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>O evente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Organizer */}
            {event.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle>Organizátor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {event.organizer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{event.organizer.name}</p>
                      <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tagy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Event Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Informácie o evente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{formattedStartDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedStartTime} - {formattedEndTime}
                      </p>
                    </div>
                  </div>

                  {/* Location or Meeting Link */}
                  {event.format === EventFormat.ONLINE ? (
                    <div className="flex items-start gap-3">
                      <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Online stretnutie</p>
                        {event.meetingLink && isRegistered && (
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            Pripojiť sa
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {!isRegistered && (
                          <p className="text-sm text-muted-foreground">
                            Link dostupný po registrácii
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{event.location || 'TBA'}</p>
                        {event.address && (
                          <p className="text-sm text-muted-foreground">{event.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Attendees */}
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {event.attendeeCount} účastníkov
                        {event.maxAttendees && ` / ${event.maxAttendees}`}
                      </p>
                      {isFullyBooked && (
                        <Badge variant="destructive" className="mt-1">
                          Obsadené
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Kategória</p>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryLabel(event.category)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Cena</p>
                    <p className="text-2xl font-bold text-accent-500">
                      {isFree ? 'Zadarmo' : `${event.price} ${event.currency}`}
                    </p>
                  </div>

                  {/* RSVP Button */}
                  <Button
                    className="w-full bg-accent-500 hover:bg-accent-600"
                    onClick={handleRSVP}
                    disabled={isFullyBooked || isRegistered || rsvpMutation.isPending}
                  >
                    {isRegistered
                      ? 'Už ste registrovaný'
                      : isFullyBooked
                      ? 'Obsadené'
                      : rsvpMutation.isPending
                      ? 'Registrujem...'
                      : 'Registrovať sa'}
                  </Button>

                  {isRegistered && (
                    <p className="text-sm text-center text-muted-foreground">
                      Potvrdzujúci e-mail bol odoslaný
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

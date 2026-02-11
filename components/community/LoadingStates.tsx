import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Banner skeleton */}
      <div className="aspect-[4/3] bg-muted shimmer" />

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-muted shimmer rounded w-3/4" />

        {/* Time skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted shimmer rounded" />
          <div className="h-4 bg-muted shimmer rounded w-20" />
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted shimmer rounded" />
          <div className="h-4 bg-muted shimmer rounded w-32" />
        </div>

        {/* Attendees skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted shimmer rounded" />
          <div className="h-4 bg-muted shimmer rounded w-16" />
        </div>

        {/* Price skeleton */}
        <div className="h-6 bg-muted shimmer rounded w-24" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted shimmer rounded" />
          <div className="h-3 bg-muted shimmer rounded w-5/6" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="h-10 bg-muted shimmer rounded w-full" />
      </CardFooter>
    </Card>
  )
}

interface EventsGridSkeletonProps {
  count?: number
}

export function EventsGridSkeleton({ count = 6 }: EventsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Načítám události" aria-busy="true">
      <span className="sr-only">Načítám...</span>
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function RSVPCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail skeleton */}
      <div className="h-32 bg-muted shimmer" />

      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted shimmer rounded w-3/4" />

        {/* Date skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted shimmer rounded" />
          <div className="h-4 bg-muted shimmer rounded w-40" />
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted shimmer rounded" />
          <div className="h-4 bg-muted shimmer rounded w-32" />
        </div>

        {/* Buttons skeleton */}
        <div className="space-y-2">
          <div className="h-10 bg-muted shimmer rounded" />
          <div className="h-10 bg-muted shimmer rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

interface RSVPsGridSkeletonProps {
  count?: number
}

export function RSVPsGridSkeleton({ count = 3 }: RSVPsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Načítám registrace" aria-busy="true">
      <span className="sr-only">Načítám...</span>
      {Array.from({ length: count }).map((_, i) => (
        <RSVPCardSkeleton key={i} />
      ))}
    </div>
  )
}

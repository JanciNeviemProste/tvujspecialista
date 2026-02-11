import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Thumbnail skeleton */}
      <div className="h-48 bg-muted shimmer" />

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-muted shimmer rounded w-3/4" />

        {/* Stats row skeleton */}
        <div className="flex gap-4">
          <div className="h-4 bg-muted shimmer rounded w-20" />
          <div className="h-4 bg-muted shimmer rounded w-24" />
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted shimmer rounded w-24" />
          <div className="h-4 bg-muted shimmer rounded w-12" />
        </div>

        {/* Instructor skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted shimmer rounded-full" />
          <div className="h-4 bg-muted shimmer rounded w-32" />
        </div>

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

interface CoursesGridSkeletonProps {
  count?: number
}

export function CoursesGridSkeleton({ count = 6 }: CoursesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Načítám kurzy" aria-busy="true">
      <span className="sr-only">Načítám...</span>
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}

interface CurriculumSkeletonProps {
  moduleCount?: number
}

export function CurriculumSkeleton({ moduleCount = 3 }: CurriculumSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: moduleCount }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted shimmer rounded w-20" />
                <div className="h-5 bg-muted shimmer rounded w-16" />
                <div className="h-4 bg-muted shimmer rounded w-12" />
              </div>
              <div className="h-5 bg-muted shimmer rounded w-2/3" />
              <div className="h-4 bg-muted shimmer rounded w-full" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export function EnrollmentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail skeleton */}
      <div className="h-32 bg-muted shimmer" />

      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted shimmer rounded w-3/4" />

        {/* Progress skeleton */}
        <div className="space-y-1">
          <div className="h-2 bg-muted shimmer rounded" />
          <div className="h-3 bg-muted shimmer rounded w-20" />
        </div>

        {/* Last accessed skeleton */}
        <div className="h-3 bg-muted shimmer rounded w-32" />

        {/* Button skeleton */}
        <div className="h-10 bg-muted shimmer rounded" />
      </CardContent>
    </Card>
  )
}

interface EnrollmentsGridSkeletonProps {
  count?: number
}

export function EnrollmentsGridSkeleton({ count = 3 }: EnrollmentsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Načítám zápisy" aria-busy="true">
      <span className="sr-only">Načítám...</span>
      {Array.from({ length: count }).map((_, i) => (
        <EnrollmentCardSkeleton key={i} />
      ))}
    </div>
  )
}

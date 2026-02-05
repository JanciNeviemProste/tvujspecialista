import { Enrollment } from '@/types/academy'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface EnrollmentCardProps {
  enrollment: Enrollment
  className?: string
}

function formatRelativeTime(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) {
    return 'práve teraz'
  } else if (diffInMins < 60) {
    return `pred ${diffInMins} ${diffInMins === 1 ? 'minútou' : diffInMins < 5 ? 'minútami' : 'minútami'}`
  } else if (diffInHours < 24) {
    return `pred ${diffInHours} ${diffInHours === 1 ? 'hodinou' : diffInHours < 5 ? 'hodinami' : 'hodinami'}`
  } else if (diffInDays === 1) {
    return 'včera'
  } else if (diffInDays < 7) {
    return `pred ${diffInDays} dňami`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `pred ${weeks} ${weeks === 1 ? 'týždňom' : 'týždňami'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `pred ${months} ${months === 1 ? 'mesiacom' : 'mesiacmi'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `pred ${years} ${years === 1 ? 'rokom' : 'rokmi'}`
  }
}

export function EnrollmentCard({ enrollment, className }: EnrollmentCardProps) {
  const isCompleted = enrollment.status === 'completed'
  const buttonText = isCompleted ? 'Opakovať' : 'Pokračovať'
  const buttonVariant = isCompleted ? 'outline' : 'premium'

  if (!enrollment.course) {
    return null
  }

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden', className)}
    >
      {/* Course thumbnail */}
      <div className="relative h-32 overflow-hidden bg-muted">
        <Image
          src={enrollment.course.thumbnailUrl}
          alt={enrollment.course.title}
          fill
          className="object-cover"
        />

        {/* Status badge overlay */}
        <Badge
          variant={isCompleted ? 'success' : 'default'}
          className="absolute top-2 right-2 shadow-sm"
        >
          {isCompleted ? 'Dokončené' : 'Aktívny'}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">
          {enrollment.course.title}
        </h3>

        {/* Progress */}
        <div className="space-y-1">
          <Progress value={enrollment.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {Math.round(enrollment.progress)}% dokončené
          </p>
        </div>

        {/* Last accessed */}
        <p className="text-xs text-muted-foreground">
          Naposledy: {formatRelativeTime(enrollment.lastAccessedAt)}
        </p>

        {/* Action buttons */}
        <div className="space-y-2">
          <Button
            variant={buttonVariant as any}
            className="w-full"
            asChild
          >
            <Link href={`/academy/learn/${enrollment.course.slug}`}>
              {buttonText}
            </Link>
          </Button>

          {enrollment.certificateIssued && (
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href={`/academy/certificates/${enrollment.id}`}>
                <Award className="h-4 w-4 mr-2" />
                Stiahnuť certifikát
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

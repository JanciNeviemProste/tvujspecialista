import { useTranslations } from 'next-intl'
import { Enrollment } from '@/types/academy'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'

interface EnrollmentCardProps {
  enrollment: Enrollment
  className?: string
}

function formatRelativeTime(date: string, t: ReturnType<typeof useTranslations>): string {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) {
    return t('enrollment.timeJustNow')
  } else if (diffInMins < 60) {
    return t('enrollment.timeMinutesAgo', { count: diffInMins })
  } else if (diffInHours < 24) {
    return t('enrollment.timeHoursAgo', { count: diffInHours })
  } else if (diffInDays === 1) {
    return t('enrollment.timeYesterday')
  } else if (diffInDays < 7) {
    return t('enrollment.timeDaysAgo', { count: diffInDays })
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return t('enrollment.timeWeeksAgo', { count: weeks })
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return t('enrollment.timeMonthsAgo', { count: months })
  } else {
    const years = Math.floor(diffInDays / 365)
    return t('enrollment.timeYearsAgo', { count: years })
  }
}

export function EnrollmentCard({ enrollment, className }: EnrollmentCardProps) {
  const t = useTranslations('academy')
  const isCompleted = enrollment.status === 'completed'
  const buttonText = isCompleted ? t('enrollment.repeat') : t('enrollment.continue')
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
          {isCompleted ? t('enrollment.completed') : t('enrollment.active')}
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
            {t('enrollment.percentComplete', { percent: Math.round(enrollment.progress) })}
          </p>
        </div>

        {/* Last accessed */}
        <p className="text-xs text-muted-foreground">
          {t('enrollment.lastAccessed')} {formatRelativeTime(enrollment.lastAccessedAt, t)}
        </p>

        {/* Action buttons */}
        <div className="space-y-2">
          <Link href={`/academy/learn/${enrollment.course.slug}`}>
            <Button
              variant={buttonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium" | "glass" | null | undefined}
              className="w-full"
            >
              {buttonText}
            </Button>
          </Link>

          {enrollment.certificateIssued && (
            <Link href={`/academy/certificates/${enrollment.id}`}>
              <Button
                variant="outline"
                className="w-full"
              >
                <Award className="h-4 w-4 mr-2" />
                {t('enrollment.downloadCertificate')}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

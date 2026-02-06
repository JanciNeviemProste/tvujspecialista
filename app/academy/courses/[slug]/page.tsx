'use client'

import { useEffect, useState } from 'react'
import { CourseCurriculum } from '@/components/academy/CourseCurriculum'
import { CourseCardSkeleton, CurriculumSkeleton } from '@/components/academy/LoadingStates'
import { useCourse, useEnroll, useMyEnrollments, useEnrollmentProgress } from '@/lib/hooks/useAcademy'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, BookOpen, Star, Users, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CourseLevel, CourseCategory } from '@/types/academy'
import { getErrorMessage } from '@/lib/utils/error'

interface CourseDetailPageProps {
  params: { slug: string }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

function getLevelLabel(level: CourseLevel): string {
  switch (level) {
    case CourseLevel.BEGINNER:
      return 'Začiatočník'
    case CourseLevel.INTERMEDIATE:
      return 'Stredný'
    case CourseLevel.ADVANCED:
      return 'Pokročilý'
    default:
      return level
  }
}

function getCategoryLabel(category: CourseCategory): string {
  switch (category) {
    case CourseCategory.REAL_ESTATE:
      return 'Reality'
    case CourseCategory.FINANCIAL:
      return 'Finance'
    case CourseCategory.BOTH:
      return 'Reality & Finance'
    default:
      return category
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(params.slug)

  // Get all user enrollments and find the one for this course
  const { data: enrollmentsData } = useMyEnrollments()
  const enrollment = enrollmentsData?.enrollments.find(e => e.courseId === course?.id)

  // Get progress if enrolled
  const { data: lessonProgress } = useEnrollmentProgress(enrollment?.id || '')

  const enrollMutation = useEnroll()
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/profi/prihlaseni')
      return
    }

    if (!course?.id) return

    try {
      await enrollMutation.mutateAsync(course.id)
      setToastMessage({
        type: 'success',
        message: 'Úspešne ste sa zapísali do kurzu!'
      })
    } catch (error: unknown) {
      setToastMessage({
        type: 'error',
        message: getErrorMessage(error)
      })
    }
  }

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <CourseCardSkeleton />
              <CurriculumSkeleton />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <CourseCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-destructive">
              Kurz nenájdený
            </h2>
            <p className="mb-4 text-muted-foreground">
              Ospravedlňujeme sa, ale tento kurz neexistuje alebo bol odstránený.
            </p>
            <Link href="/academy/courses">
              <Button variant="outline">
                Späť na katalóg
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isEnrolled = !!enrollment

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | Akadémia | tvujspecialista.cz`
    }
  }, [course])

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`rounded-lg border p-4 shadow-lg ${
            toastMessage.type === 'success'
              ? 'border-verified/50 bg-verified/10 text-verified'
              : 'border-destructive/50 bg-destructive/10 text-destructive'
          }`}>
            <p className="font-medium">{toastMessage.message}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="default">{getLevelLabel(course.level)}</Badge>
                {course.featured && (
                  <Badge variant="gold">Featured</Badge>
                )}
              </div>

              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {course.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs lg:text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.reviewCount} hodnotení)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.enrollmentCount} študentov</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{course.lessonCount} lekcií</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Lektor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructorPhoto} alt={course.instructorName} />
                    <AvatarFallback>
                      {course.instructorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{course.instructorName}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Obsah kurzu</h2>
                <CourseCurriculum
                  modules={course.modules}
                  enrollmentId={enrollment?.id}
                  lessonProgress={lessonProgress || []}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Enrollment Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  {!isAuthenticated ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Pre prístup ku kurzu sa musíte prihlásiť
                      </p>
                      <Link href="/profi/prihlaseni" className="w-full">
                        <Button variant="default" className="w-full">
                          Prihlásiť sa
                        </Button>
                      </Link>
                    </>
                  ) : isEnrolled ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Váš pokrok</p>
                        <Progress value={enrollment.progress} className="h-3" />
                        <p className="text-xs text-muted-foreground text-right">
                          {Math.round(enrollment.progress)}% dokončené
                        </p>
                      </div>
                      <Link href={`/academy/learn/${course.slug}`} className="w-full">
                        <Button variant="premium" className="w-full">
                          Pokračovať v učení
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Získajte prístup k tomuto kurzu
                      </p>
                      <Button
                        variant="premium"
                        className="w-full"
                        onClick={handleEnroll}
                        loading={enrollMutation.isPending}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? 'Zapisujem...' : 'Zapísať sa do kurzu'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Course Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Informácie o kurze</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trvanie:</span>
                    <span className="font-medium">{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Počet lekcií:</span>
                    <span className="font-medium">{course.lessonCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Úroveň:</span>
                    <span className="font-medium">{getLevelLabel(course.level)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kategória:</span>
                    <span className="font-medium">{getCategoryLabel(course.category)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

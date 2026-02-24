'use client'

import { use, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CourseCurriculum } from '@/components/academy/CourseCurriculum'
import { CourseCardSkeleton, CurriculumSkeleton } from '@/components/academy/LoadingStates'
import { useCourse, useEnroll, useMyEnrollments, useEnrollmentProgress } from '@/lib/hooks/useAcademy'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, BookOpen, Star, Users, GraduationCap, Play } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useRouter } from '@/i18n/routing'
import { CourseLevel, CourseCategory } from '@/types/academy'
import { getErrorMessage } from '@/lib/utils/error'

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

function getLevelLabel(level: CourseLevel, t: (key: string) => string): string {
  switch (level) {
    case CourseLevel.BEGINNER:
      return t('courseDetail.levelBeginner')
    case CourseLevel.INTERMEDIATE:
      return t('courseDetail.levelIntermediate')
    case CourseLevel.ADVANCED:
      return t('courseDetail.levelAdvanced')
    default:
      return level
  }
}

function getCategoryLabel(category: CourseCategory, t: (key: string) => string): string {
  switch (category) {
    case CourseCategory.REAL_ESTATE:
      return t('courseDetail.catRealEstate')
    case CourseCategory.FINANCIAL:
      return t('courseDetail.catFinancial')
    case CourseCategory.BOTH:
      return t('courseDetail.catBoth')
    default:
      return category
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const t = useTranslations('academy')
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(slug)

  // Get all user enrollments and find the one for this course
  const { data: enrollmentsData } = useMyEnrollments()
  const enrollment = enrollmentsData?.enrollments?.find(e => e.courseId === course?.id)

  // Get progress if enrolled
  const { data: lessonProgress } = useEnrollmentProgress(enrollment?.id || '')

  const enrollMutation = useEnroll()
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const translateEnrollError = (msg: string): string => {
    if (msg.includes('Active subscription required')) return t('courseDetail.errorSubscriptionRequired')
    if (msg.includes('Education or Premium subscription')) return t('courseDetail.errorEducationRequired')
    if (msg.includes('subscription has expired')) return t('courseDetail.errorSubscriptionExpired')
    return msg
  }

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
        message: t('courseDetail.enrollSuccess')
      })
    } catch (error: unknown) {
      setToastMessage({
        type: 'error',
        message: translateEnrollError(getErrorMessage(error))
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
      <div className="min-h-screen bg-white">
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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">
              {t('courseDetail.notFound')}
            </h2>
            <p className="mb-4 text-gray-500">
              {t('courseDetail.notFoundDesc')}
            </p>
            <Link href="/academy/courses">
              <Button variant="outline">
                {t('courseDetail.backToCatalog')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isEnrolled = !!enrollment

  // Compute real duration and lesson count from loaded modules/lessons
  const totalDuration = course.modules?.reduce(
    (sum, m) => sum + (m.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || m.duration || 0),
    0,
  ) || course.duration;
  const totalLessons = course.modules?.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0,
  ) || course.lessonCount;

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`rounded-lg border p-4 shadow-lg ${
            toastMessage.type === 'success'
              ? 'border-green-300 bg-green-50 text-green-600'
              : 'border-red-300 bg-red-50 text-red-600'
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
                <Badge variant="default">{getLevelLabel(course.level, t)}</Badge>
                {course.featured && (
                  <Badge variant="gold">Featured</Badge>
                )}
              </div>

              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>

              <p className="mb-6 text-lg text-gray-500">
                {course.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs lg:text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{Number(course.rating ?? 0).toFixed(1)}</span>
                  <span className="text-gray-500">({course.reviewCount} {t('courseDetail.ratings')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{course.enrollmentCount} {t('courseDetail.students')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span>{totalLessons} lekcií</span>
                </div>
              </div>
            </div>

            {/* Thumbnail with play overlay */}
            <Link href={`/academy/learn/${course.slug}`}>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200 group cursor-pointer">
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-current ml-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t('courseDetail.instructor')}
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
                    <p className="text-sm text-gray-500">{course.instructorBio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile enrollment CTA — visible only on mobile before curriculum */}
            {!isEnrolled && isAuthenticated && (
              <div className="lg:hidden">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 flex-1">
                      {t('courseDetail.getAccess')}
                    </p>
                    <Button
                      variant="premium"
                      onClick={handleEnroll}
                      loading={enrollMutation.isPending}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? t('courseDetail.enrolling') : t('courseDetail.enroll')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Course Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">{t('courseDetail.curriculum')}</h2>
                <CourseCurriculum
                  modules={course.modules}
                  courseSlug={course.slug}
                  isEnrolled={isEnrolled}
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
                      <p className="text-sm text-gray-500">
                        {t('courseDetail.loginRequired')}
                      </p>
                      <Link href="/profi/prihlaseni" className="w-full">
                        <Button variant="default" className="w-full">
                          {t('courseDetail.login')}
                        </Button>
                      </Link>
                    </>
                  ) : isEnrolled ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{t('courseDetail.yourProgress')}</p>
                        <Progress value={enrollment.progress} className="h-3" />
                        <p className="text-xs text-gray-500 text-right">
                          {Math.round(enrollment.progress)}% {t('courseDetail.completed')}
                        </p>
                      </div>
                      <Link href={`/academy/learn/${course.slug}`} className="w-full">
                        <Button variant="premium" className="w-full">
                          {t('courseDetail.continueLearning')}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        {t('courseDetail.getAccess')}
                      </p>
                      <Button
                        variant="premium"
                        className="w-full"
                        onClick={handleEnroll}
                        loading={enrollMutation.isPending}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? t('courseDetail.enrolling') : t('courseDetail.enroll')}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Course Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('courseDetail.courseInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('courseDetail.duration')}</span>
                    <span className="font-medium">{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('courseDetail.lessonCount')}</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('courseDetail.level')}</span>
                    <span className="font-medium">{getLevelLabel(course.level, t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('courseDetail.category')}</span>
                    <span className="font-medium">{getCategoryLabel(course.category, t)}</span>
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

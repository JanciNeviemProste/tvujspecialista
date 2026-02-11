import { memo } from 'react';
import { Course } from '@/types/academy';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RatingStars } from '@/components/shared/RatingStars';
import { Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
  className?: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

function CourseCardInner({
  course,
  enrolled = false,
  progress,
  className,
}: CourseCardProps) {
  const href = enrolled
    ? `/academy/learn/${course.slug}`
    : `/academy/courses/${course.slug}`;
  const buttonText = enrolled ? 'Pokračovať' : 'Zobraziť kurz';
  const buttonVariant = enrolled ? 'outline' : 'premium';

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden h-full flex flex-col group', className)}
    >
      {/* Thumbnail with hover scale */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <Badge variant="default" className="shadow-sm">
            {course.level === 'beginner' && 'Začiatočník'}
            {course.level === 'intermediate' && 'Stredný'}
            {course.level === 'advanced' && 'Pokročilý'}
          </Badge>
          {course.featured && (
            <Badge variant="gold" className="shadow-sm">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">{course.title}</h3>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessonCount} lekcií</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <RatingStars rating={course.rating} size="sm" showCount={false} />
          <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({course.reviewCount})</span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={course.instructorPhoto} alt={course.instructorName} />
            <AvatarFallback>
              {course.instructorName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{course.instructorName}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

        {/* Progress bar (if enrolled) */}
        {enrolled && progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(progress)}% dokončené
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={href}>
          <Button
            variant={
              buttonVariant as
                | 'default'
                | 'destructive'
                | 'outline'
                | 'secondary'
                | 'ghost'
                | 'link'
                | 'premium'
                | 'glass'
                | null
                | undefined
            }
            className="w-full"
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export const CourseCard = memo(CourseCardInner);

'use client'

import { useState } from 'react'
import { Module, LessonProgress, LessonType } from '@/types/academy'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronUp, ChevronDown, Check, Play, CheckCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CourseCurriculumProps {
  modules: Module[]
  enrollmentId?: string
  lessonProgress?: LessonProgress[]
  className?: string
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

function getLessonIcon(type: LessonType) {
  switch (type) {
    case 'video':
      return Play
    case 'quiz':
      return CheckCircle
    case 'reading':
      return FileText
    default:
      return FileText
  }
}

export function CourseCurriculum({
  modules,
  enrollmentId,
  lessonProgress = [],
  className
}: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const isLessonCompleted = (lessonId: string): boolean => {
    return lessonProgress.some(p => p.lessonId === lessonId && p.completed)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {modules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.includes(module.id)
        const ChevronIcon = isExpanded ? ChevronUp : ChevronDown

        return (
          <Card key={module.id}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Modul {moduleIndex + 1}
                    </span>
                    <Badge variant="default" className="text-xs">
                      {module.lessonCount} {module.lessonCount === 1 ? 'lekcia' : module.lessonCount < 5 ? 'lekcie' : 'lekcií'}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(module.duration)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {module.title}
                  </CardTitle>
                  {module.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  )}
                </div>
                <ChevronIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
              </div>
            </CardHeader>

            {isExpanded && module.lessons && module.lessons.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const LessonIcon = getLessonIcon(lesson.type)
                    const completed = isLessonCompleted(lesson.id)

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Completion indicator */}
                        <div className="flex-shrink-0 mt-0.5">
                          {completed ? (
                            <div className="h-6 w-6 rounded-full bg-verified flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                {lessonIndex + 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Lesson info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <LessonIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <h4 className="font-medium text-sm truncate">
                              {lesson.title}
                            </h4>
                            {lesson.free && (
                              <Badge variant="success" className="text-xs">
                                Zdarma
                              </Badge>
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

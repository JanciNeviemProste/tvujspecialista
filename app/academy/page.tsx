'use client'

import type { Metadata } from 'next'
import { useEffect } from 'react'
import { CourseCard } from '@/components/academy/CourseCard'
import { CoursesGridSkeleton } from '@/components/academy/LoadingStates'
import { useCourses } from '@/lib/hooks/useAcademy'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Clock, Award } from 'lucide-react'
import Link from 'next/link'

export default function AcademyLandingPage() {
  const { data: featuredCourses, isLoading, error } = useCourses({ featured: true, limit: 3 })

  useEffect(() => {
    document.title = 'Akadémia | tvujspecialista.cz'
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              Rozviňte svoju kariéru s našou akadémiou
            </h1>
            <p className="mb-8 text-xl lg:text-2xl opacity-90">
              Prémiové online kurzy pre realitných agentov a finančných poradcov
            </p>
            <Button
              size="lg"
              variant="glass"
              className="shadow-lg"
              asChild
            >
              <Link href="/academy/courses">
                Preskúmať kurzy
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Benefit 1 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Kvalitné vzdelávanie</h3>
                <p className="text-muted-foreground">
                  Kurzy vytvorené odbornými lektormi s dlhoročnou praxou
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Flexibilné tempo</h3>
                <p className="text-muted-foreground">
                  Študujte kedykoľvek a kdekoľvek podľa vlastného tempa
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Certifikáty</h3>
                <p className="text-muted-foreground">
                  Po úspešnom absolvovaní získate oficiálny certifikát
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Najobľúbenejšie kurzy</h2>
            <p className="text-lg text-muted-foreground">
              Vybrali sme pre vás tie najlepšie kurzy z našej ponuky
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <CoursesGridSkeleton count={3} />}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
              <p className="text-destructive">
                Chyba pri načítaní kurzov. Skúste to prosím znova.
              </p>
            </div>
          )}

          {/* Featured Courses Grid */}
          {!isLoading && !error && featuredCourses && (
            <>
              {featuredCourses.courses.length === 0 ? (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <p className="text-muted-foreground">
                    Zatiaľ nie sú k dispozícii žiadne featured kurzy.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCourses.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card variant="premium" className="overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Pripravení začať?
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Prezrite si náš kompletný katalóg kurzov a nájdite ten správny pre vás
              </p>
              <Button
                size="lg"
                variant="glass"
                className="shadow-lg"
                asChild
              >
                <Link href="/academy/courses">
                  Zobraziť všetky kurzy
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

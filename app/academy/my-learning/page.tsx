'use client';

import { useMyEnrollments } from '@/lib/hooks/useAcademy';
import { useAuth } from '@/lib/hooks/useAuth';
import { EnrollmentCard } from '@/components/academy/EnrollmentCard';
import { EnrollmentsGridSkeleton } from '@/components/academy/LoadingStates';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  gradientFrom: string;
  gradientTo: string;
}

function StatCard({ icon: Icon, value, label, gradientFrom, gradientTo }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />
      <CardContent className="relative p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-full bg-white/20">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-white/80">{label}</div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  heading: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

function EmptyState({ icon: Icon, heading, description, buttonText, buttonHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {buttonText && buttonHref && (
        <Link href={buttonHref}>
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  );
}

export default function MyLearningPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data, isLoading: enrollmentsLoading } = useMyEnrollments();
  const enrollments = data?.enrollments ?? [];

  // Auth guard - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/profi/prihlaseni');
    }
  }, [authLoading, isAuthenticated, router]);

  // Calculate stats from enrollments
  const stats = useMemo(() => {
    if (!enrollments) {
      return {
        activeCount: 0,
        completedCount: 0,
        averageProgress: 0,
        totalWatchTime: 0,
      };
    }

    const activeEnrollments = enrollments.filter(e => e.status === 'active');
    const completedEnrollments = enrollments.filter(e => e.status === 'completed');

    const averageProgress = activeEnrollments.length > 0
      ? activeEnrollments.reduce((sum, e) => sum + e.progress, 0) / activeEnrollments.length
      : 0;

    const totalWatchTime = enrollments
      .flatMap(e => e.lessonProgress || [])
      .reduce((sum, p) => sum + (p.watchTimeSeconds || 0), 0);

    return {
      activeCount: activeEnrollments.length,
      completedCount: completedEnrollments.length,
      averageProgress: Math.round(averageProgress),
      totalWatchTime: (totalWatchTime / 3600).toFixed(1),
    };
  }, [enrollments]);

  // Filter enrollments by status
  const activeEnrollments = useMemo(() => {
    if (!enrollments) return [];
    return enrollments
      .filter(e => e.status === 'active')
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
  }, [enrollments]);

  const completedEnrollments = useMemo(() => {
    if (!enrollments) return [];
    return enrollments
      .filter(e => e.status === 'completed')
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
  }, [enrollments]);

  // Show loading state while checking auth or loading data
  const isLoading = authLoading || enrollmentsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted shimmer rounded w-48 mb-2" />
          <div className="h-4 bg-muted shimmer rounded w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-6">
                <div className="h-full bg-muted shimmer rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <div className="h-6 bg-muted shimmer rounded w-40 mb-6" />
          <EnrollmentsGridSkeleton count={3} />
        </div>

        <div>
          <div className="h-6 bg-muted shimmer rounded w-40 mb-6" />
          <EnrollmentsGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Moje vzdelávanie</h1>
        <p className="text-muted-foreground">Prehľad vašich kurzov a pokroku</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={BookOpen}
          value={stats.activeCount}
          label="Aktívnych kurzov"
          gradientFrom="from-primary-500"
          gradientTo="to-primary-600"
        />
        <StatCard
          icon={Trophy}
          value={stats.completedCount}
          label="Dokončených kurzov"
          gradientFrom="from-accent-500"
          gradientTo="to-accent-600"
        />
        <StatCard
          icon={TrendingUp}
          value={`${stats.averageProgress}%`}
          label="Priemerný pokrok"
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
        />
        <StatCard
          icon={Clock}
          value={`${stats.totalWatchTime}h`}
          label="Celkový čas sledovania"
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
        />
      </div>

      {/* Continue Learning Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Pokračovať v učení</h2>

        {activeEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEnrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            heading="Zatiaľ nemáte žiadne aktívne kurzy"
            description="Začnite sa učiť preskúmaním našej ponuky kurzov"
            buttonText="Preskúmať kurzy"
            buttonHref="/academy/courses"
          />
        )}
      </section>

      {/* Completed Courses Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Dokončené kurzy</h2>

        {completedEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedEnrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            heading="Zatiaľ ste nedokončili žiadny kurz"
            description="Pokračujte v učení a dokončite svoj prvý kurz"
          />
        )}
      </section>
    </div>
  );
}

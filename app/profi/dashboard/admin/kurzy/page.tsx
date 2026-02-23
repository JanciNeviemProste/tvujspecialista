'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/lib/hooks/useAcademy';
import { academyApi } from '@/lib/api/academy';
import { ArrowLeft, BookOpen, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: coursesData, isLoading, refetch } = useCourses({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePublish = async (courseId: string, published: boolean) => {
    setActionLoading(courseId);
    try {
      await academyApi.publishCourse(courseId, !published);
      toast.success(published ? 'Kurz bol skrytý' : 'Kurz bol publikovaný');
      refetch();
    } catch {
      toast.error('Akcia zlyhala');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Naozaj chcete zmazať tento kurz?')) return;
    setActionLoading(courseId);
    try {
      await academyApi.deleteCourse(courseId);
      toast.success('Kurz bol zmazaný');
      refetch();
    } catch {
      toast.error('Nepodarilo sa zmazať kurz');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const courses = coursesData?.courses ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profi/dashboard/admin" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            Správa kurzov
          </h1>
          <p className="text-muted-foreground mt-1">{courses.length} kurzov celkom</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne kurzy</h3>
          <p className="text-muted-foreground">Zatiaľ neboli vytvorené žiadne kurzy.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course: any) => (
            <div key={course.id} className="rounded-lg border bg-white p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {course.published ? 'Publikovaný' : 'Skrytý'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {course.level}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {course.moduleCount ?? 0} modulov &middot; {course.lessonCount ?? 0} lekcií &middot; {course.enrollmentCount ?? 0} zapísaných
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePublish(course.id, course.published)}
                  disabled={actionLoading === course.id}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                  title={course.published ? 'Skryť' : 'Publikovať'}
                >
                  {course.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  disabled={actionLoading === course.id}
                  className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-500"
                  title="Zmazať"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

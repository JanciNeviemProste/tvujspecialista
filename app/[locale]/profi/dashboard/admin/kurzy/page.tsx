'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { academyApi } from '@/lib/api/academy';
import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, BookOpen, Eye, EyeOff, Trash2, Plus, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CourseFormModal, { type CourseFormData } from '@/components/admin/CourseFormModal';
import CourseEnrollments from '@/components/admin/CourseEnrollments';

const emptyForm: CourseFormData = {
  title: '',
  description: '',
  thumbnailUrl: '',
  level: 'beginner',
  category: 'financial',
  instructorName: '',
  instructorBio: '',
  instructorPhoto: '',
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const t = useTranslations('dashboard.admin.courses');
  const tAdmin = useTranslations('dashboard.admin');
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => adminApi.getCourses().then((res) => res.data),
  });
  const refetch = () => queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePublish = async (courseId: string, published: boolean) => {
    setActionLoading(courseId);
    try {
      await adminApi.publishCourse(courseId, !published);
      toast.success(published ? tAdmin('toasts.courseHidden') : tAdmin('toasts.coursePublished'));
      refetch();
    } catch {
      toast.error(tAdmin('toasts.actionFailed'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm(tAdmin('toasts.confirmDeleteCourse'))) return;
    setActionLoading(courseId);
    try {
      await academyApi.deleteCourse(courseId);
      toast.success(tAdmin('toasts.courseDeleted'));
      refetch();
    } catch {
      toast.error(tAdmin('toasts.courseDeleteError'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateCourse = async (data: CourseFormData) => {
    setFormLoading(true);
    try {
      await academyApi.createCourse(data);
      toast.success(tAdmin('toasts.courseCreated'));
      setModalOpen(false);
      refetch();
    } catch {
      toast.error(tAdmin('toasts.courseCreateError'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCourse = async (data: CourseFormData) => {
    if (!editingCourse) return;
    setFormLoading(true);
    try {
      await academyApi.updateCourse(editingCourse.id, data);
      toast.success(tAdmin('toasts.courseUpdated'));
      setEditingCourse(null);
      refetch();
    } catch {
      toast.error(tAdmin('toasts.courseUpdateError'));
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const courses = coursesData?.courses ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/academy" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              {t('title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('totalCourses', { count: courses.length })}</p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('newCourse')}
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('noCourses')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('noCoursesDesc')}</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('createFirstCourse')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course: any) => {
            const isExpanded = expandedCourse === course.id;
            return (
              <div key={course.id} className="rounded-lg border bg-white dark:bg-card overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {course.published ? t('published') : t('hidden')}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('courseStats', { modules: course.moduleCount ?? 0, lessons: course.lessonCount ?? 0, enrolled: course.enrollmentCount ?? 0 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                      title={t('showStudents')}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/academy/admin/${course.id}`}
                      className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors text-blue-600 text-xs font-medium"
                    >
                      {t('content')}
                    </Link>
                    <button
                      onClick={() => openEdit(course)}
                      disabled={actionLoading === course.id}
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                      title={t('editAction')}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePublish(course.id, course.published)}
                      disabled={actionLoading === course.id}
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                      title={course.published ? t('hide') : t('publish')}
                    >
                      {course.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      disabled={actionLoading === course.id}
                      className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-500"
                      title={t('deleteAction')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {isExpanded && <CourseEnrollments courseId={course.id} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateCourse}
        initialData={emptyForm}
        isLoading={formLoading}
        isEdit={false}
      />

      {/* Edit Modal */}
      <CourseFormModal
        key={editingCourse?.id || 'new-course'}
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={handleUpdateCourse}
        initialData={editingCourse ? {
          title: editingCourse.title || '',
          description: editingCourse.description || '',
          thumbnailUrl: editingCourse.thumbnailUrl || '',
          level: editingCourse.level || 'beginner',
          category: editingCourse.category || 'financial',
          instructorName: editingCourse.instructorName || '',
          instructorBio: editingCourse.instructorBio || '',
          instructorPhoto: editingCourse.instructorPhoto || '',
        } : emptyForm}
        isLoading={formLoading}
        isEdit={true}
      />
    </div>
  );
}

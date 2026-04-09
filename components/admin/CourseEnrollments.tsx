'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

import { EditableText } from '@/components/editor/EditableText';
interface CourseEnrollmentsProps {
  courseId: string;
}

export default function CourseEnrollments({ courseId }: CourseEnrollmentsProps) {
  const t = useTranslations('dashboard.admin.courses');
  const locale = useLocale();
  const { data, isLoading } = useQuery({
    queryKey: ['adminCourseEnrollments', courseId],
    queryFn: () => adminApi.getCourseEnrollments(courseId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-muted rounded" />
          <div className="h-8 bg-gray-200 dark:bg-muted rounded" />
          <div className="h-8 bg-gray-200 dark:bg-muted rounded" />
        </div>
      </div>
    );
  }

  const enrollments = Array.isArray(data) ? data : [];

  if (enrollments.length === 0) {
    return (
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 text-center">
        <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500"><EditableText tKey="dashboard.admin.courses.enrollments.noStudents">{t('enrollments.noStudents')}</EditableText></p>
      </div>
    );
  }

  const active = enrollments.filter((e: any) => e.status === 'active');
  const completed = enrollments.filter((e: any) => e.status === 'completed');
  const dropped = enrollments.filter((e: any) => e.status === 'dropped');
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum: number, e: any) => sum + Number(e.progress || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="border-t bg-gray-50 dark:bg-gray-800">
      {/* Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-card rounded-lg p-3 border text-center">
          <div className="text-lg font-bold text-blue-600">{enrollments.length}</div>
          <div className="text-xs text-gray-500"><EditableText tKey="dashboard.admin.courses.enrollments.total">{t('enrollments.total')}</EditableText></div>
        </div>
        <div className="bg-white dark:bg-card rounded-lg p-3 border text-center">
          <div className="text-lg font-bold text-green-600">{active.length}</div>
          <div className="text-xs text-gray-500"><EditableText tKey="dashboard.admin.courses.enrollments.active">{t('enrollments.active')}</EditableText></div>
        </div>
        <div className="bg-white dark:bg-card rounded-lg p-3 border text-center">
          <div className="text-lg font-bold text-purple-600">{completed.length}</div>
          <div className="text-xs text-gray-500"><EditableText tKey="dashboard.admin.courses.enrollments.completed">{t('enrollments.completed')}</EditableText></div>
        </div>
        <div className="bg-white dark:bg-card rounded-lg p-3 border text-center">
          <div className="text-lg font-bold text-amber-600">{avgProgress}%</div>
          <div className="text-xs text-gray-500"><EditableText tKey="dashboard.admin.courses.enrollments.avgProgress">{t('enrollments.avgProgress')}</EditableText></div>
        </div>
      </div>

      {/* Student table */}
      <div className="px-4 pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium"><EditableText tKey="dashboard.admin.courses.enrollments.student">{t('enrollments.student')}</EditableText></th>
              <th className="pb-2 font-medium"><EditableText tKey="dashboard.admin.courses.enrollments.email">{t('enrollments.email')}</EditableText></th>
              <th className="pb-2 font-medium"><EditableText tKey="dashboard.admin.courses.enrollments.status">{t('enrollments.status')}</EditableText></th>
              <th className="pb-2 font-medium text-right"><EditableText tKey="dashboard.admin.courses.enrollments.progress">{t('enrollments.progress')}</EditableText></th>
              <th className="pb-2 font-medium text-right"><EditableText tKey="dashboard.admin.courses.enrollments.lastAccess">{t('enrollments.lastAccess')}</EditableText></th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment: any) => (
              <tr key={enrollment.id} className="border-b last:border-b-0">
                <td className="py-2 font-medium">
                  {enrollment.user?.firstName} {enrollment.user?.lastName}
                </td>
                <td className="py-2 text-gray-500">{enrollment.user?.email}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    enrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                    enrollment.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {enrollment.status === 'active' ? t('enrollments.statusActive') :
                     enrollment.status === 'completed' ? t('enrollments.statusCompleted') : t('enrollments.statusDropped')}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(Number(enrollment.progress || 0), 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 w-10 text-right">{Math.round(Number(enrollment.progress || 0))}%</span>
                  </div>
                </td>
                <td className="py-2 text-right text-gray-500">
                  {enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ') : '\u2014'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

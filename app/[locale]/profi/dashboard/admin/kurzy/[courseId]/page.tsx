'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { academyApi } from '@/lib/api/academy';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Module } from '@/types/academy';
import CourseHeader from '@/components/admin/CourseHeader';
import ModulesContainer from '@/components/admin/ModulesContainer';
import ModuleForm from '@/components/admin/ModuleForm';
import ModuleSection from '@/components/admin/ModuleSection';

export default function CourseBuilderPage() {
  const t = useTranslations('dashboard.admin.courses');
  const tAdmin = useTranslations('dashboard.admin');
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [addingModule, setAddingModule] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);

  // Fetch course info
  const { data: coursesData } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => adminApi.getCourses().then((res) => res.data),
  });

  const course = coursesData?.courses?.find((c: any) => c.id === courseId);

  // Fetch modules with lessons
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => academyApi.getModules(courseId).then((res) => res.data),
    enabled: !!courseId,
  });

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['courseModules', courseId] });
    queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
  };

  const handleCreateModule = async (data: { title: string; description: string }) => {
    setModuleLoading(true);
    try {
      await academyApi.createModule(courseId, data);
      toast.success(t('toasts.moduleCreated'));
      setAddingModule(false);
      refresh();
    } catch {
      toast.error(t('toasts.moduleCreateFailed'));
    } finally {
      setModuleLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    try {
      await adminApi.publishCourse(courseId, !course.published);
      toast.success(course.published ? tAdmin('toasts.courseHidden') : tAdmin('toasts.coursePublished'));
      refresh();
    } catch {
      toast.error(tAdmin('toasts.actionFailed'));
    }
  };

  const sortedModules = (modules || []).slice().sort((a: Module, b: Module) => a.position - b.position);
  const lessonsCount = sortedModules.reduce((sum: number, m: Module) => sum + (m.lessons?.length || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <CourseHeader
        course={course}
        modulesCount={sortedModules.length}
        lessonsCount={lessonsCount}
        onPublishToggle={handlePublish}
        isLoading={!course}
      />

      <ModulesContainer
        modules={sortedModules}
        isLoading={modulesLoading}
        addingModule={addingModule}
        onToggleAddModule={() => setAddingModule(!addingModule)}
        onSaveModule={handleCreateModule}
        moduleLoading={moduleLoading}
        onRefresh={refresh}
        courseId={courseId}
        renderModuleForm={({ onSave, onCancel, loading }) => (
          <ModuleForm
            onSave={onSave}
            onCancel={onCancel}
            loading={loading}
          />
        )}
        renderModuleSection={({ module: mod, index, total, onRefresh: onRefreshMod }) => (
          <ModuleSection
            key={mod.id}
            module={mod}
            index={index}
            total={total}
            onRefresh={onRefreshMod}
          />
        )}
      />
    </div>
  );
}

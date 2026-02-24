'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/lib/hooks/useAcademy';
import { academyApi } from '@/lib/api/academy';
import { ArrowLeft, BookOpen, Eye, EyeOff, Trash2, Plus, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  category: string;
  instructorName: string;
  instructorBio: string;
  instructorPhoto: string;
}

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

function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void;
  initialData: CourseFormData;
  isLoading: boolean;
  isEdit: boolean;
}) {
  const tAdmin = useTranslations('dashboard.admin');
  const [form, setForm] = useState<CourseFormData>(initialData);

  if (!isOpen) return null;

  const handleChange = (field: keyof CourseFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error(tAdmin('toasts.fillRequiredFields'));
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Upraviť kurz' : 'Nový kurz'}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Názov kurzu *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="napr. Základy hypotekárneho poradenstva"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Popis *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Podrobný popis kurzu..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL náhľadového obrázku *</label>
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Úroveň</label>
              <select
                value={form.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="beginner">Začiatočník</option>
                <option value="intermediate">Pokročilý</option>
                <option value="advanced">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategória</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="financial">Financie</option>
                <option value="real_estate">Reality</option>
                <option value="both">Oboje</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Inštruktor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meno inštruktora *</label>
                <input
                  type="text"
                  value={form.instructorName}
                  onChange={(e) => handleChange('instructorName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ing. Ján Novák"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio inštruktora *</label>
                <textarea
                  value={form.instructorBio}
                  onChange={(e) => handleChange('instructorBio', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Krátky popis inštruktora..."
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL fotky inštruktora *</label>
                <input
                  type="url"
                  value={form.instructorPhoto}
                  onChange={(e) => handleChange('instructorPhoto', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="https://example.com/photo.jpg"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ukladám...' : isEdit ? 'Uložiť zmeny' : 'Vytvoriť kurz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const t = useTranslations('dashboard.admin.courses');
  const tAdmin = useTranslations('dashboard.admin');
  const { user, isLoading: authLoading } = useAuth();
  const { data: coursesData, isLoading, refetch } = useCourses({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePublish = async (courseId: string, published: boolean) => {
    setActionLoading(courseId);
    try {
      await academyApi.publishCourse(courseId, !published);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/profi/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              {t('title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{courses.length} kurzov celkom</p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nový kurz
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne kurzy</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Zatiaľ neboli vytvorené žiadne kurzy.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Vytvoriť prvý kurz
          </button>
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
                  onClick={() => openEdit(course)}
                  disabled={actionLoading === course.id}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                  title="Upraviť"
                >
                  <Pencil className="h-4 w-4" />
                </button>
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

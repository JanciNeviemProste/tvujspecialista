'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { academyApi } from '@/lib/api/academy';
import { adminApi } from '@/lib/api/admin';
import {
  Plus, Pencil, Trash2, X, ChevronUp, ChevronDown,
  GripVertical, Video, FileText, Upload, Loader2,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Module, Lesson } from '@/types/academy';
import CourseHeader from '@/components/admin/CourseHeader';
import ModulesContainer from '@/components/admin/ModulesContainer';

// ─── Module Form ────────────────────────────────────────────
function ModuleForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial?: { title: string; description: string };
  onSave: (data: { title: string; description: string }) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const t = useTranslations('dashboard.admin.courses');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('module.titlePlaceholder')}
        className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        disabled={loading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('module.descriptionPlaceholder')}
        rows={2}
        className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!title.trim()) { toast.error(t('validation.titleRequired')); return; }
            onSave({ title: title.trim(), description: description.trim() });
          }}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('actions.saving') : t('actions.save')}
        </button>
        <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
          {t('actions.cancel')}
        </button>
      </div>
    </div>
  );
}

// ─── Lesson Form Modal ──────────────────────────────────────
function LessonModal({
  isOpen,
  onClose,
  onSave,
  initial,
  loading,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; type: string; free: boolean }) => void;
  initial?: { title: string; description: string; type: string; free: boolean };
  loading: boolean;
  isEdit: boolean;
}) {
  const t = useTranslations('dashboard.admin.courses');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [type, setType] = useState(initial?.type || 'video');
  const [free, setFree] = useState(initial?.free || false);

  // Reset form data whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(initial?.title || '');
      setDescription(initial?.description || '');
      setType(initial?.type || 'video');
      setFree(initial?.free || false);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-card rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold">{isEdit ? t('lesson.editTitle') : t('lesson.newTitle')}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('lesson.nameLabel')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={t('lesson.namePlaceholder')}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('lesson.descriptionLabel')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={t('lesson.descriptionPlaceholder')}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('lesson.typeLabel')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={loading}
              >
                <option value="video">{t('lesson.typeVideo')}</option>
                <option value="reading">{t('lesson.typeReading')}</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={free}
                  onChange={(e) => setFree(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">{t('lesson.freePreview')}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={loading} className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50">
              {t('actions.cancel')}
            </button>
            <button
              onClick={() => {
                if (!title.trim()) { toast.error(t('validation.titleRequired')); return; }
                onSave({ title: title.trim(), description: description.trim(), type, free });
              }}
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t('actions.saving') : isEdit ? t('actions.saveChanges') : t('lesson.create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Video Upload Zone ──────────────────────────────────────
function VideoUploadZone({
  lesson,
  onUploadDone,
}: {
  lesson: Lesson;
  onUploadDone: () => void;
}) {
  const t = useTranslations('dashboard.admin.courses');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('video.allowedFormats'));
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error(t('video.maxSize'));
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await academyApi.uploadVideo(file, lesson.id, lesson.title, (percent) => {
        setProgress(percent);
      });
      setProgress(100);
      toast.success(t('video.uploaded'));
      onUploadDone();
    } catch (error: any) {
      console.error('Video upload error:', error);
      const detail = error?.response?.data?.message || error?.message || '';
      toast.error(`${t('video.uploadFailed')}${detail ? ': ' + detail : ''}`);
    } finally {
      setUploading(false);
    }
  };

  // If lesson already has a video
  if (lesson.video && lesson.video.status === 'ready') {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Play className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{t('video.uploaded')}</p>
          <p className="text-xs text-green-600">{lesson.video.title} ({Math.round(lesson.video.duration / 60)} min)</p>
        </div>
        <button
          onClick={async () => {
            if (!window.confirm(t('video.confirmDelete'))) return;
            try {
              await academyApi.deleteVideo(lesson.video!.id);
              toast.success(t('video.deleted'));
              onUploadDone();
            } catch {
              toast.error(t('video.deleteFailed'));
            }
          }}
          className="p-1.5 rounded-md hover:bg-red-100 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (lesson.video && lesson.video.status === 'error') {
    return (
      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <X className="h-5 w-5 text-red-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">{t('video.uploadError')}</p>
          <p className="text-xs text-red-600">{t('video.uploadErrorHint')}</p>
        </div>
        <button
          onClick={async () => {
            try {
              await academyApi.deleteVideo(lesson.video!.id);
              toast.success(t('video.errorRecordDeleted'));
              onUploadDone();
            } catch {
              toast.error(t('video.deleteFailed'));
            }
          }}
          className="p-1.5 rounded-md hover:bg-red-100 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (lesson.video && (lesson.video.status === 'uploading' || lesson.video.status === 'processing')) {
    return (
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
        <p className="text-sm text-amber-700">
          {lesson.video.status === 'uploading' ? t('video.uploading') : t('video.processing')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading ? (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">{t('video.uploadingProgress', { progress })}</span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="h-6 w-6 text-gray-400 mb-1" />
          <span className="text-sm font-medium text-gray-600">{t('video.uploadButton')}</span>
          <span className="text-xs text-gray-400">{t('video.uploadHint')}</span>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Item ────────────────────────────────────────────
function LessonRow({
  lesson,
  index,
  total,
  onEdit,
  onDelete,
  onReorder,
  onRefresh,
}: {
  lesson: Lesson;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onReorder: (dir: 'up' | 'down') => void;
  onRefresh: () => void;
}) {
  const t = useTranslations('dashboard.admin.courses');
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white dark:bg-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
        {lesson.type === 'video' ? (
          <Video className="h-4 w-4 text-blue-500 shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-purple-500 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{lesson.title}</span>
            {lesson.free && (
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">{t('lesson.free')}</span>
            )}
            {lesson.video?.status === 'ready' && (
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                {Math.round(lesson.video.duration / 60)} min
              </span>
            )}
          </div>
          {lesson.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {lesson.type === 'video' && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600"
              title={t('video.title')}
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title={t('actions.edit')}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title={t('actions.delete')}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onReorder('up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onReorder('down')} disabled={index === total - 1} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {(showVideo || lesson.video?.status === 'error') && lesson.type === 'video' && (
        <div className="px-4 pb-3">
          <VideoUploadZone lesson={lesson} onUploadDone={onRefresh} />
        </div>
      )}
    </div>
  );
}

// ─── Module Section ─────────────────────────────────────────
function ModuleSection({
  module: mod,
  index,
  total,
  onRefresh,
}: {
  module: Module;
  index: number;
  total: number;
  onRefresh: () => void;
}) {
  const t = useTranslations('dashboard.admin.courses');
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  const lessons = mod.lessons || [];

  const handleUpdateModule = async (data: { title: string; description: string }) => {
    setLoading(true);
    try {
      await academyApi.updateModule(mod.id, data);
      toast.success(t('toasts.moduleUpdated'));
      setEditing(false);
      onRefresh();
    } catch {
      toast.error(t('toasts.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!window.confirm(t('toasts.confirmDeleteModule', { title: mod.title }))) return;
    try {
      await academyApi.deleteModule(mod.id);
      toast.success(t('toasts.moduleDeleted'));
      onRefresh();
    } catch {
      toast.error(t('toasts.deleteFailed'));
    }
  };

  const handleReorderModule = async (dir: 'up' | 'down') => {
    const newPos = dir === 'up' ? mod.position - 1 : mod.position + 1;
    try {
      await academyApi.reorderModule(mod.id, newPos);
      onRefresh();
    } catch {
      toast.error(t('toasts.reorderFailed'));
    }
  };

  const handleCreateLesson = async (data: { title: string; description: string; type: string; free: boolean }) => {
    setLoading(true);
    try {
      await academyApi.createLesson(mod.id, data);
      toast.success(t('toasts.lessonCreated'));
      setAddingLesson(false);
      onRefresh();
    } catch {
      toast.error(t('toasts.lessonCreateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async (data: { title: string; description: string; type: string; free: boolean }) => {
    if (!editingLesson) return;
    setLoading(true);
    try {
      await academyApi.updateLesson(editingLesson.id, data);
      toast.success(t('toasts.lessonUpdated'));
      setEditingLesson(null);
      onRefresh();
    } catch {
      toast.error(t('toasts.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(t('toasts.confirmDeleteLesson', { title: lesson.title }))) return;
    try {
      await academyApi.deleteLesson(lesson.id);
      toast.success(t('toasts.lessonDeleted'));
      onRefresh();
    } catch {
      toast.error(t('toasts.deleteFailed'));
    }
  };

  const handleReorderLesson = async (lesson: Lesson, dir: 'up' | 'down') => {
    const newPos = dir === 'up' ? lesson.position - 1 : lesson.position + 1;
    try {
      await academyApi.reorderLesson(lesson.id, newPos);
      onRefresh();
    } catch {
      toast.error(t('toasts.reorderFailed'));
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-card border-b border-gray-100">
        <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-md hover:bg-gray-100">
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expanded ? '' : '-rotate-90'}`} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase">{t('module.label', { number: index + 1 })}</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{mod.title}</span>
            <span className="text-xs text-gray-400">({t('module.lessonCount', { count: lessons.length })})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title={t('actions.edit')}>
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteModule} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title={t('actions.delete')}>
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleReorderModule('up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button onClick={() => handleReorderModule('down')} disabled={index === total - 1} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editing module */}
      {editing && (
        <div className="p-4">
          <ModuleForm
            initial={{ title: mod.title, description: mod.description }}
            onSave={handleUpdateModule}
            onCancel={() => setEditing(false)}
            loading={loading}
          />
        </div>
      )}

      {/* Lessons list */}
      {expanded && !editing && (
        <div className="p-4 space-y-2">
          {lessons.sort((a, b) => a.position - b.position).map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              total={lessons.length}
              onEdit={() => setEditingLesson(lesson)}
              onDelete={() => handleDeleteLesson(lesson)}
              onReorder={(dir) => handleReorderLesson(lesson, dir)}
              onRefresh={onRefresh}
            />
          ))}

          <button
            onClick={() => setAddingLesson(true)}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('lesson.add')}
          </button>
        </div>
      )}

      {/* Add/Edit Lesson Modal */}
      <LessonModal
        isOpen={addingLesson}
        onClose={() => setAddingLesson(false)}
        onSave={handleCreateLesson}
        loading={loading}
        isEdit={false}
      />
      <LessonModal
        key={editingLesson?.id || 'new-lesson'}
        isOpen={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        onSave={handleUpdateLesson}
        initial={editingLesson ? {
          title: editingLesson.title,
          description: editingLesson.description,
          type: editingLesson.type,
          free: editingLesson.free,
        } : undefined}
        loading={loading}
        isEdit={true}
      />
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
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

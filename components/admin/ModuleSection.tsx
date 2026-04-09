'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { academyApi } from '@/lib/api/academy';
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Module, Lesson } from '@/types/academy';
import ModuleForm from '@/components/admin/ModuleForm';
import LessonRow from '@/components/admin/LessonRow';
import LessonModal from '@/components/admin/LessonModal';
import { EditableText } from '@/components/editor/EditableText';

interface ModuleSectionProps {
  module: Module;
  index: number;
  total: number;
  onRefresh: () => void;
}

export default function ModuleSection({
  module: mod,
  index,
  total,
  onRefresh,
}: ModuleSectionProps) {
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-card border-b border-gray-100">
        <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-md hover:bg-gray-100 dark:bg-gray-700">
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expanded ? '' : '-rotate-90'}`} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase">{t('module.label', { number: index + 1 })}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{mod.title}</span>
            <span className="text-xs text-gray-400">({t('module.lessonCount', { count: lessons.length })})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-500" title={t('actions.edit')}>
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteModule} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title={t('actions.delete')}>
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleReorderModule('up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-400 disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button onClick={() => handleReorderModule('down')} disabled={index === total - 1} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-400 disabled:opacity-30">
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
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <EditableText tKey="dashboard.admin.courses.lesson.add">{t('lesson.add')}</EditableText>
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

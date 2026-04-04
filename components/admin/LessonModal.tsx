'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; type: string; free: boolean }) => void;
  initial?: { title: string; description: string; type: string; free: boolean };
  loading: boolean;
  isEdit: boolean;
}

export default function LessonModal({
  isOpen,
  onClose,
  onSave,
  initial,
  loading,
  isEdit,
}: LessonModalProps) {
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
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('lesson.nameLabel')}</label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('lesson.descriptionLabel')}</label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('lesson.typeLabel')}</label>
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
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('lesson.freePreview')}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={loading} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 dark:bg-gray-800">
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

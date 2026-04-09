'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { EditableText } from '@/components/editor/EditableText';

export interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  category: string;
  instructorName: string;
  instructorBio: string;
  instructorPhoto: string;
}

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void;
  initialData: CourseFormData;
  isLoading: boolean;
  isEdit: boolean;
}

export default function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  isEdit,
}: CourseFormModalProps) {
  const tAdmin = useTranslations('dashboard.admin');
  const [form, setForm] = useState<CourseFormData>(initialData);

  // Reset form data whenever the modal opens -- ensures correct values even if key prop misses
  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? tAdmin('courseForm.editTitle') : tAdmin('courseForm.newTitle')}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.nameLabel">{tAdmin('courseForm.nameLabel')}</EditableText></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={tAdmin('courseForm.namePlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.descriptionLabel">{tAdmin('courseForm.descriptionLabel')}</EditableText></label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={tAdmin('courseForm.descriptionPlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.thumbnailLabel">{tAdmin('courseForm.thumbnailLabel')}</EditableText></label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.levelLabel">{tAdmin('courseForm.levelLabel')}</EditableText></label>
              <select
                value={form.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="beginner"><EditableText tKey="dashboard.admin.courseForm.levelBeginner">{tAdmin('courseForm.levelBeginner')}</EditableText></option>
                <option value="intermediate"><EditableText tKey="dashboard.admin.courseForm.levelIntermediate">{tAdmin('courseForm.levelIntermediate')}</EditableText></option>
                <option value="advanced"><EditableText tKey="dashboard.admin.courseForm.levelAdvanced">{tAdmin('courseForm.levelAdvanced')}</EditableText></option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.categoryLabel">{tAdmin('courseForm.categoryLabel')}</EditableText></label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="financial"><EditableText tKey="dashboard.admin.courseForm.categoryFinancial">{tAdmin('courseForm.categoryFinancial')}</EditableText></option>
                <option value="real_estate"><EditableText tKey="dashboard.admin.courseForm.categoryRealEstate">{tAdmin('courseForm.categoryRealEstate')}</EditableText></option>
                <option value="both"><EditableText tKey="dashboard.admin.courseForm.categoryBoth">{tAdmin('courseForm.categoryBoth')}</EditableText></option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"><EditableText tKey="dashboard.admin.courseForm.instructorSection">{tAdmin('courseForm.instructorSection')}</EditableText></h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.instructorNameLabel">{tAdmin('courseForm.instructorNameLabel')}</EditableText></label>
                <input
                  type="text"
                  value={form.instructorName}
                  onChange={(e) => handleChange('instructorName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder={tAdmin('courseForm.instructorNamePlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.instructorBioLabel">{tAdmin('courseForm.instructorBioLabel')}</EditableText></label>
                <textarea
                  value={form.instructorBio}
                  onChange={(e) => handleChange('instructorBio', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder={tAdmin('courseForm.instructorBioPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.courseForm.instructorPhotoLabel">{tAdmin('courseForm.instructorPhotoLabel')}</EditableText></label>
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
              className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-neutral-800 transition-colors"
            >
              <EditableText tKey="dashboard.admin.courseForm.cancel">{tAdmin('courseForm.cancel')}</EditableText>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? tAdmin('courseForm.saving') : isEdit ? tAdmin('courseForm.saveChanges') : tAdmin('courseForm.createCourse')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

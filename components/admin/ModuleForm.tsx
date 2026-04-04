'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface ModuleFormProps {
  initial?: { title: string; description: string };
  onSave: (data: { title: string; description: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ModuleForm({
  initial,
  onSave,
  onCancel,
  loading,
}: ModuleFormProps) {
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
        <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-50 dark:bg-gray-800">
          {t('actions.cancel')}
        </button>
      </div>
    </div>
  );
}

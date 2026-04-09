'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Pencil, Trash2, ChevronUp, ChevronDown,
  GripVertical, Video, FileText, Upload,
} from 'lucide-react';
import type { Lesson } from '@/types/academy';
import VideoUploadZone from '@/components/admin/VideoUploadZone';

import { EditableText } from '@/components/editor/EditableText';
interface LessonRowProps {
  lesson: Lesson;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onReorder: (dir: 'up' | 'down') => void;
  onRefresh: () => void;
}

export default function LessonRow({
  lesson,
  index,
  total,
  onEdit,
  onDelete,
  onReorder,
  onRefresh,
}: LessonRowProps) {
  const t = useTranslations('dashboard.admin.courses');
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
        {lesson.type === 'video' ? (
          <Video className="h-4 w-4 text-blue-500 shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-purple-500 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{lesson.title}</span>
            {lesson.free && (
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium"><EditableText tKey="dashboard.admin.courses.lesson.free">{t('lesson.free')}</EditableText></span>
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
          <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-500" title={t('actions.edit')}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title={t('actions.delete')}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onReorder('up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-400 disabled:opacity-30">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onReorder('down')} disabled={index === total - 1} className="p-1.5 rounded-md hover:bg-gray-100 dark:bg-gray-700 text-gray-400 disabled:opacity-30">
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

'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { academyApi } from '@/lib/api/academy';
import { Trash2, X, Upload, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import type { Lesson } from '@/types/academy';

interface VideoUploadZoneProps {
  lesson: Lesson;
  onUploadDone: () => void;
}

export default function VideoUploadZone({
  lesson,
  onUploadDone,
}: VideoUploadZoneProps) {
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

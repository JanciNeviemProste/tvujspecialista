'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { academyApi } from '@/lib/api/academy';
import { adminApi } from '@/lib/api/admin';
import {
  ArrowLeft, Plus, Pencil, Trash2, X, ChevronUp, ChevronDown,
  GripVertical, Video, FileText, Upload, Check, Loader2, BookOpen,
  Eye, EyeOff, Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Module, Lesson } from '@/types/academy';

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
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Názov modulu"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        disabled={loading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Popis modulu"
        rows={2}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!title.trim()) { toast.error('Názov je povinný'); return; }
            onSave({ title: title.trim(), description: description.trim() });
          }}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Ukladám...' : 'Uložiť'}
        </button>
        <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
          Zrušiť
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
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [type, setType] = useState(initial?.type || 'video');
  const [free, setFree] = useState(initial?.free || false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold">{isEdit ? 'Upraviť lekciu' : 'Nová lekcia'}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Názov *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="napr. Úvod do hypotéky"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Čo sa študent naučí..."
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={loading}
              >
                <option value="video">Video</option>
                <option value="reading">Materiál / Text</option>
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
                <span className="text-sm text-gray-700">Zadarmo (preview)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={loading} className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50">
              Zrušiť
            </button>
            <button
              onClick={() => {
                if (!title.trim()) { toast.error('Názov je povinný'); return; }
                onSave({ title: title.trim(), description: description.trim(), type, free });
              }}
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Ukladám...' : isEdit ? 'Uložiť zmeny' : 'Vytvoriť lekciu'}
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
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Povolené: MP4, MOV, AVI, WebM');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Maximálna veľkosť: 500 MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate progress since axios doesn't give us real progress easily
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 90));
    }, 1000);

    try {
      await academyApi.uploadVideo(file, lesson.id, lesson.title);
      clearInterval(interval);
      setProgress(100);
      toast.success('Video nahrané');
      onUploadDone();
    } catch {
      clearInterval(interval);
      toast.error('Nahrávanie videa zlyhalo');
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
          <p className="text-sm font-medium text-green-800">Video nahrané</p>
          <p className="text-xs text-green-600">{lesson.video.title} ({Math.round(lesson.video.duration / 60)} min)</p>
        </div>
        <button
          onClick={async () => {
            if (!window.confirm('Zmazať video?')) return;
            try {
              await academyApi.deleteVideo(lesson.video!.id);
              toast.success('Video zmazané');
              onUploadDone();
            } catch {
              toast.error('Mazanie zlyhalo');
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
          {lesson.video.status === 'uploading' ? 'Nahráva sa...' : 'Spracováva sa...'}
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
            <span className="text-sm text-blue-700">Nahráva sa video... {progress}%</span>
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
          <span className="text-sm font-medium text-gray-600">Nahrať video</span>
          <span className="text-xs text-gray-400">MP4, MOV, AVI, WebM - max 500 MB</span>
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
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
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
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Free</span>
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
              title="Video"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="Upraviť">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title="Zmazať">
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
      {showVideo && lesson.type === 'video' && (
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
      toast.success('Modul aktualizovaný');
      setEditing(false);
      onRefresh();
    } catch {
      toast.error('Aktualizácia zlyhala');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!window.confirm(`Zmazať modul "${mod.title}" a všetky jeho lekcie?`)) return;
    try {
      await academyApi.deleteModule(mod.id);
      toast.success('Modul zmazaný');
      onRefresh();
    } catch {
      toast.error('Mazanie zlyhalo');
    }
  };

  const handleReorderModule = async (dir: 'up' | 'down') => {
    const newPos = dir === 'up' ? mod.position - 1 : mod.position + 1;
    try {
      await academyApi.reorderModule(mod.id, newPos);
      onRefresh();
    } catch {
      toast.error('Zmena poradia zlyhala');
    }
  };

  const handleCreateLesson = async (data: { title: string; description: string; type: string; free: boolean }) => {
    setLoading(true);
    try {
      await academyApi.createLesson(mod.id, data);
      toast.success('Lekcia vytvorená');
      setAddingLesson(false);
      onRefresh();
    } catch {
      toast.error('Vytvorenie lekcie zlyhalo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async (data: { title: string; description: string; type: string; free: boolean }) => {
    if (!editingLesson) return;
    setLoading(true);
    try {
      await academyApi.updateLesson(editingLesson.id, data);
      toast.success('Lekcia aktualizovaná');
      setEditingLesson(null);
      onRefresh();
    } catch {
      toast.error('Aktualizácia zlyhala');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Zmazať lekciu "${lesson.title}"?`)) return;
    try {
      await academyApi.deleteLesson(lesson.id);
      toast.success('Lekcia zmazaná');
      onRefresh();
    } catch {
      toast.error('Mazanie zlyhalo');
    }
  };

  const handleReorderLesson = async (lesson: Lesson, dir: 'up' | 'down') => {
    const newPos = dir === 'up' ? lesson.position - 1 : lesson.position + 1;
    try {
      await academyApi.reorderLesson(lesson.id, newPos);
      onRefresh();
    } catch {
      toast.error('Zmena poradia zlyhala');
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-gray-100">
        <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-md hover:bg-gray-100">
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expanded ? '' : '-rotate-90'}`} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase">Modul {index + 1}</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{mod.title}</span>
            <span className="text-xs text-gray-400">({lessons.length} {lessons.length === 1 ? 'lekcia' : lessons.length < 5 ? 'lekcie' : 'lekcií'})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="Upraviť">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteModule} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" title="Zmazať">
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
            Pridať lekciu
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
      toast.success('Modul vytvorený');
      setAddingModule(false);
      refresh();
    } catch {
      toast.error('Vytvorenie modulu zlyhalo');
    } finally {
      setModuleLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    try {
      await adminApi.publishCourse(courseId, !course.published);
      toast.success(course.published ? 'Kurz skrytý' : 'Kurz publikovaný');
      refresh();
    } catch {
      toast.error('Akcia zlyhala');
    }
  };

  const sortedModules = (modules || []).slice().sort((a: Module, b: Module) => a.position - b.position);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/academy/admin" className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              {course?.title || 'Načítavam...'}
            </h1>
            <p className="text-gray-500 mt-1">
              {sortedModules.length} {sortedModules.length === 1 ? 'modul' : sortedModules.length < 5 ? 'moduly' : 'modulov'}
              {' · '}
              {sortedModules.reduce((sum: number, m: Module) => sum + (m.lessons?.length || 0), 0)} lekcií
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              course?.published
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {course?.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {course?.published ? 'Skryť' : 'Publikovať'}
          </button>
        </div>
      </div>

      {/* Modules list */}
      {modulesLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedModules.map((mod: Module, i: number) => (
            <ModuleSection
              key={mod.id}
              module={mod}
              index={i}
              total={sortedModules.length}
              onRefresh={refresh}
            />
          ))}

          {/* Add Module */}
          {addingModule ? (
            <ModuleForm
              onSave={handleCreateModule}
              onCancel={() => setAddingModule(false)}
              loading={moduleLoading}
            />
          ) : (
            <button
              onClick={() => setAddingModule(true)}
              className="flex items-center gap-2 w-full px-5 py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Pridať modul
            </button>
          )}
        </div>
      )}
    </div>
  );
}

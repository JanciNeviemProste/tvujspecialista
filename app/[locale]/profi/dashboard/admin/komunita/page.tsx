'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { communityApi } from '@/lib/api/community';
import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, Calendar, Eye, XCircle, ChevronDown, ChevronUp, UserCheck, UserX, CheckCircle, Plus, Pencil, Trash2, X, RotateCcw, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EventFormData {
  title: string;
  description: string;
  type: string;
  format: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees: string;
  meetingLink: string;
  bannerImage: string;
}

const emptyEventForm: EventFormData = {
  title: '',
  description: '',
  type: 'workshop',
  format: 'online',
  category: 'financial',
  startDate: '',
  endDate: '',
  location: '',
  maxAttendees: '',
  meetingLink: '',
  bannerImage: '',
};

function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData: EventFormData;
  isLoading: boolean;
  isEdit: boolean;
}) {
  const tAdmin = useTranslations('dashboard.admin');
  const [form, setForm] = useState<EventFormData>(initialData);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof EventFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Povolené formáty: JPEG, PNG, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Maximálna veľkosť: 5 MB');
      return;
    }
    setUploading(true);
    try {
      const res = await adminApi.uploadEventBanner(file);
      handleChange('bannerImage', res.data.bannerImage);
      toast.success('Obrázok nahraný');
    } catch {
      toast.error('Nahrávanie obrázka zlyhalo');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.startDate || !form.endDate) {
      toast.error(tAdmin('toasts.fillRequiredFields'));
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Upraviť event' : 'Nový event'}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Banner Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner obrázok</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            {form.bannerImage ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={form.bannerImage}
                  alt="Banner preview"
                  width={1200}
                  height={160}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium shadow-lg"
                  >
                    Zmeniť obrázok
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {uploading ? (
                  <>
                    <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-sm text-gray-500">Nahrávam...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Klikni alebo pretiahni obrázok</span>
                    <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP - max 5 MB</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Názov eventu *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="napr. Workshop: Hypotéky v praxi"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popis *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Podrobný popis eventu..."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="workshop">Workshop</option>
                <option value="networking">Networking</option>
                <option value="conference">Konferencia</option>
                <option value="webinar">Webinár</option>
                <option value="meetup">Meetup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formát</label>
              <select
                value={form.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="financial">Financie</option>
                <option value="real_estate">Reality</option>
                <option value="both">Oboje</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Začiatok *</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Koniec *</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miesto</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="napr. Bratislava, Hotel Devín"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max. účastníkov</label>
              <input
                type="number"
                value={form.maxAttendees}
                onChange={(e) => handleChange('maxAttendees', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="napr. 50"
                min="1"
                disabled={isLoading}
              />
            </div>
          </div>

          {form.format === 'online' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting link</label>
              <input
                type="url"
                value={form.meetingLink}
                onChange={(e) => handleChange('meetingLink', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="https://zoom.us/j/..."
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ukladám...' : isEdit ? 'Uložiť zmeny' : 'Vytvoriť event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AttendeeStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    attended: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    pending: 'Čaká',
    confirmed: 'Potvrdený',
    attended: 'Zúčastnil sa',
    cancelled: 'Zrušený',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status}
    </span>
  );
}

function AttendeesPanel({ eventId }: { eventId: string }) {
  const tAdmin = useTranslations('dashboard.admin');
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminEventAttendees', eventId],
    queryFn: () => adminApi.getEventAttendees(eventId).then((res) => res.data),
  });

  const handleStatusChange = async (rsvpId: string, status: string) => {
    setUpdatingId(rsvpId);
    try {
      await adminApi.updateRSVPStatus(rsvpId, status);
      toast.success(tAdmin('toasts.attendeeStatusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['adminEventAttendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.attendeeStatusError'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  const attendees = Array.isArray(data) ? data : [];

  if (attendees.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Žiadni účastníci
      </div>
    );
  }

  return (
    <div className="border-t">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600">
            <th className="px-4 py-2 font-medium">Meno</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Registrácia</th>
            <th className="px-4 py-2 font-medium text-right">Akcie</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {attendees.map((rsvp: any) => (
            <tr key={rsvp.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{rsvp.user?.name ?? 'Neznámy'}</td>
              <td className="px-4 py-2 text-gray-500">{rsvp.user?.email ?? '-'}</td>
              <td className="px-4 py-2">
                <AttendeeStatusBadge status={rsvp.status} />
              </td>
              <td className="px-4 py-2 text-gray-500">
                {rsvp.registeredAt ? new Date(rsvp.registeredAt).toLocaleDateString('cs-CZ') : '-'}
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  {rsvp.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(rsvp.id, 'confirmed')}
                        disabled={updatingId === rsvp.id}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Potvrdiť"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(rsvp.id, 'cancelled')}
                        disabled={updatingId === rsvp.id}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Zrušiť"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {rsvp.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(rsvp.id, 'attended')}
                        disabled={updatingId === rsvp.id}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                        title="Check-in"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(rsvp.id, 'cancelled')}
                        disabled={updatingId === rsvp.id}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Zrušiť"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminCommunityPage() {
  const router = useRouter();
  const t = useTranslations('dashboard.admin.community');
  const tAdmin = useTranslations('dashboard.admin');
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => adminApi.getEvents().then((res) => res.data),
  });

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePublish = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await adminApi.publishEvent(eventId, true);
      toast.success(tAdmin('toasts.eventPublished'));
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.actionFailed'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!window.confirm(tAdmin('toasts.confirmCancelEvent'))) return;
    setActionLoading(eventId);
    try {
      await communityApi.cancelEvent(eventId);
      toast.success(tAdmin('toasts.eventCancelled'));
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.eventCancelError'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm(tAdmin('toasts.confirmDeleteEvent'))) return;
    setActionLoading(eventId);
    try {
      await communityApi.deleteEvent(eventId);
      toast.success(tAdmin('toasts.eventDeleted'));
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.eventDeleteError'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateEvent = async (data: EventFormData) => {
    setFormLoading(true);
    try {
      await communityApi.createEvent({
        title: data.title,
        description: data.description,
        type: data.type as any,
        format: data.format as any,
        category: data.category as any,
        startDate: new Date(data.startDate) as any,
        endDate: new Date(data.endDate) as any,
        location: data.location || undefined,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees, 10) : undefined,
        meetingLink: data.meetingLink || undefined,
      });
      toast.success(tAdmin('toasts.eventCreated'));
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.eventCreateError'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!editingEvent) return;
    setFormLoading(true);
    try {
      await communityApi.updateEvent(editingEvent.id, {
        title: data.title,
        description: data.description,
        type: data.type as any,
        format: data.format as any,
        category: data.category as any,
        startDate: new Date(data.startDate) as any,
        endDate: new Date(data.endDate) as any,
        location: data.location || undefined,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees, 10) : undefined,
        meetingLink: data.meetingLink || undefined,
      });
      toast.success(tAdmin('toasts.eventUpdated'));
      setEditingEvent(null);
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error(tAdmin('toasts.eventUpdateError'));
    } finally {
      setFormLoading(false);
    }
  };

  const toDatetimeLocal = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
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

  const eventsList = events?.events ?? events ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/community" className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              {t('title')}
            </h1>
            <p className="text-gray-500 mt-1">{Array.isArray(eventsList) ? eventsList.length : 0} eventov</p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nový event
        </button>
      </div>

      {!Array.isArray(eventsList) || eventsList.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne eventy</h3>
          <p className="text-gray-500 mb-4">Zatiaľ neboli vytvorené žiadne eventy.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Vytvoriť prvý event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {eventsList.map((event: any) => (
            <div key={event.id} className="rounded-lg border bg-white overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <button
                  className="flex-1 text-left"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      event.status === 'published' ? 'bg-green-100 text-green-700' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {event.status === 'published' ? 'Publikovaný' :
                       event.status === 'cancelled' ? 'Zrušený' :
                       event.status === 'draft' ? 'Návrh' : event.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString('cs-CZ') : 'Bez dátumu'} &middot;
                    {event.attendeeCount ?? 0}/{event.maxAttendees ?? '\u221e'} účastníkov
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEvent(event)}
                    disabled={actionLoading === event.id}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                    title="Upraviť"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(event.id)}
                      disabled={actionLoading === event.id}
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-green-600"
                      title="Publikovať"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  {event.status === 'cancelled' && (
                    <button
                      onClick={() => handlePublish(event.id)}
                      disabled={actionLoading === event.id}
                      className="p-2 rounded-md hover:bg-green-50 transition-colors text-green-600"
                      title="Obnoviť"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  {event.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(event.id)}
                      disabled={actionLoading === event.id}
                      className="p-2 rounded-md hover:bg-red-50 transition-colors text-orange-500"
                      title="Zrušiť"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={actionLoading === event.id}
                    className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-500"
                    title="Zmazať"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-400"
                    title="Zobraziť účastníkov"
                  >
                    {expandedEvent === event.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {expandedEvent === event.id && (
                <AttendeesPanel eventId={event.id} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateEvent}
        initialData={emptyEventForm}
        isLoading={formLoading}
        isEdit={false}
      />

      {/* Edit Modal */}
      <EventFormModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateEvent}
        initialData={editingEvent ? {
          title: editingEvent.title || '',
          description: editingEvent.description || '',
          type: editingEvent.type || 'workshop',
          format: editingEvent.format || 'online',
          category: editingEvent.category || 'financial',
          startDate: toDatetimeLocal(editingEvent.startDate),
          endDate: toDatetimeLocal(editingEvent.endDate),
          location: editingEvent.location || '',
          maxAttendees: editingEvent.maxAttendees?.toString() || '',
          meetingLink: editingEvent.meetingLink || '',
          bannerImage: editingEvent.bannerImage || '',
        } : emptyEventForm}
        isLoading={formLoading}
        isEdit={true}
      />
    </div>
  );
}

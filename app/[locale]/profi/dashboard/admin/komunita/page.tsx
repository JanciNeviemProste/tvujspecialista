'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { communityApi } from '@/lib/api/community';
import { adminApi } from '@/lib/api/admin';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import EventCard from '@/components/admin/EventCard';
import EventsListHeader from '@/components/admin/EventsListHeader';
import EventsEmptyState from '@/components/admin/EventsEmptyState';

import { EditableText } from '@/components/editor/EditableText';
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
  const tCommunity = useTranslations('dashboard.admin.community');
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
      toast.error(tCommunity('image.allowedFormats'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(tCommunity('image.maxSize'));
      return;
    }
    setUploading(true);
    try {
      const res = await adminApi.uploadEventBanner(file);
      handleChange('bannerImage', res.data.bannerImage);
      toast.success(tCommunity('image.uploaded'));
    } catch {
      toast.error(tCommunity('image.uploadFailed'));
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
      <div className="w-full max-w-2xl bg-white dark:bg-card rounded-xl shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{isEdit ? tCommunity('eventForm.editTitle') : tCommunity('eventForm.newTitle')}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-100 dark:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Banner Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.bannerImage">{tCommunity('eventForm.bannerImage')}</EditableText></label>
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
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
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
                    className="px-3 py-1.5 bg-white dark:bg-card rounded-lg text-sm font-medium shadow-lg"
                  >
                    <EditableText tKey="dashboard.admin.community.image.change">{tCommunity('image.change')}</EditableText>
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
                    <span className="text-sm text-gray-500"><EditableText tKey="dashboard.admin.community.image.uploading">{tCommunity('image.uploading')}</EditableText></span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.admin.community.image.dragOrClick">{tCommunity('image.dragOrClick')}</EditableText></span>
                    <span className="text-xs text-gray-400 mt-1"><EditableText tKey="dashboard.admin.community.image.hint">{tCommunity('image.hint')}</EditableText></span>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.nameLabel">{tCommunity('eventForm.nameLabel')}</EditableText></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={tCommunity('eventForm.namePlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.descriptionLabel">{tCommunity('eventForm.descriptionLabel')}</EditableText></label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder={tCommunity('eventForm.descriptionPlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.typeLabel">{tCommunity('eventForm.typeLabel')}</EditableText></label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="workshop"><EditableText tKey="dashboard.admin.community.eventForm.typeWorkshop">{tCommunity('eventForm.typeWorkshop')}</EditableText></option>
                <option value="networking"><EditableText tKey="dashboard.admin.community.eventForm.typeNetworking">{tCommunity('eventForm.typeNetworking')}</EditableText></option>
                <option value="conference"><EditableText tKey="dashboard.admin.community.eventForm.typeConference">{tCommunity('eventForm.typeConference')}</EditableText></option>
                <option value="webinar"><EditableText tKey="dashboard.admin.community.eventForm.typeWebinar">{tCommunity('eventForm.typeWebinar')}</EditableText></option>
                <option value="meetup"><EditableText tKey="dashboard.admin.community.eventForm.typeMeetup">{tCommunity('eventForm.typeMeetup')}</EditableText></option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.formatLabel">{tCommunity('eventForm.formatLabel')}</EditableText></label>
              <select
                value={form.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="online"><EditableText tKey="dashboard.admin.community.eventForm.formatOnline">{tCommunity('eventForm.formatOnline')}</EditableText></option>
                <option value="offline"><EditableText tKey="dashboard.admin.community.eventForm.formatOffline">{tCommunity('eventForm.formatOffline')}</EditableText></option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.categoryLabel">{tCommunity('eventForm.categoryLabel')}</EditableText></label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              >
                <option value="financial"><EditableText tKey="dashboard.admin.community.eventForm.categoryFinancial">{tCommunity('eventForm.categoryFinancial')}</EditableText></option>
                <option value="real_estate"><EditableText tKey="dashboard.admin.community.eventForm.categoryRealEstate">{tCommunity('eventForm.categoryRealEstate')}</EditableText></option>
                <option value="both"><EditableText tKey="dashboard.admin.community.eventForm.categoryBoth">{tCommunity('eventForm.categoryBoth')}</EditableText></option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.startDate">{tCommunity('eventForm.startDate')}</EditableText></label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.endDate">{tCommunity('eventForm.endDate')}</EditableText></label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.locationLabel">{tCommunity('eventForm.locationLabel')}</EditableText></label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={tCommunity('eventForm.locationPlaceholder')}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.maxAttendeesLabel">{tCommunity('eventForm.maxAttendeesLabel')}</EditableText></label>
              <input
                type="number"
                value={form.maxAttendees}
                onChange={(e) => handleChange('maxAttendees', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={tCommunity('eventForm.maxAttendeesPlaceholder')}
                min="1"
                disabled={isLoading}
              />
            </div>
          </div>

          {form.format === 'online' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><EditableText tKey="dashboard.admin.community.eventForm.meetingLinkLabel">{tCommunity('eventForm.meetingLinkLabel')}</EditableText></label>
              <input
                type="url"
                value={form.meetingLink}
                onChange={(e) => handleChange('meetingLink', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 dark:bg-gray-800 transition-colors"
            >
              <EditableText tKey="dashboard.admin.community.eventForm.cancel">{tCommunity('eventForm.cancel')}</EditableText>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? tCommunity('eventForm.saving') : isEdit ? tCommunity('eventForm.saveChanges') : tCommunity('eventForm.createEvent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCommunityPage() {
  const router = useRouter();
  const t = useTranslations('dashboard.admin.community');
  const tAdmin = useTranslations('dashboard.admin');
  const locale = useLocale();
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
          <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const eventsList = events?.events ?? events ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <EventsListHeader
        count={Array.isArray(eventsList) ? eventsList.length : 0}
        onCreateNew={() => setModalOpen(true)}
        t={t}
      />

      {!Array.isArray(eventsList) || eventsList.length === 0 ? (
        <EventsEmptyState
          onCreateNew={() => setModalOpen(true)}
          t={t}
        />
      ) : (
        <div className="space-y-3">
          {eventsList.map((event: any) => (
            <EventCard
              key={event.id}
              event={event}
              expanded={expandedEvent === event.id}
              onToggleExpand={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              onEdit={() => setEditingEvent(event)}
              onPublish={() => handlePublish(event.id)}
              onCancel={() => handleCancel(event.id)}
              onDelete={() => handleDelete(event.id)}
              actionLoading={actionLoading === event.id}
              locale={locale}
            />
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

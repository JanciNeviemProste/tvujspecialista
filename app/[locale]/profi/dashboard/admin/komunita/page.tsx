'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { communityApi } from '@/lib/api/community';
import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, Calendar, Eye, XCircle, ChevronDown, ChevronUp, UserCheck, UserX, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
      toast.success('Status účastníka bol aktualizovaný');
      queryClient.invalidateQueries({ queryKey: ['adminEventAttendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error('Nepodarilo sa zmeniť status');
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
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => communityApi.getEvents({}).then((res) => res.data),
  });

  if (!authLoading && (!user || user.role !== 'admin')) {
    router.push('/profi/dashboard');
    return null;
  }

  const handlePublish = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await communityApi.publishEvent(eventId, true);
      toast.success('Event bol publikovaný');
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error('Akcia zlyhala');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!window.confirm('Naozaj chcete zrušiť tento event?')) return;
    setActionLoading(eventId);
    try {
      await communityApi.cancelEvent(eventId);
      toast.success('Event bol zrušený');
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    } catch {
      toast.error('Nepodarilo sa zrušiť event');
    } finally {
      setActionLoading(null);
    }
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
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profi/dashboard/admin" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="h-6 w-6 text-accent-500" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{Array.isArray(eventsList) ? eventsList.length : 0} eventov</p>
        </div>
      </div>

      {!Array.isArray(eventsList) || eventsList.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žiadne eventy</h3>
          <p className="text-muted-foreground">Zatiaľ neboli vytvorené žiadne eventy.</p>
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
                  {event.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(event.id)}
                      disabled={actionLoading === event.id}
                      className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-500"
                      title="Zrušiť"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
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
    </div>
  );
}

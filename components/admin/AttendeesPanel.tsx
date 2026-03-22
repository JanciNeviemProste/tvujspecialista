'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { UserCheck, UserX, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

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

export default function AttendeesPanel({ eventId }: { eventId: string }) {
  const tAdmin = useTranslations('dashboard.admin');
  const locale = useLocale();
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
                {rsvp.registeredAt ? new Date(rsvp.registeredAt).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ') : '-'}
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

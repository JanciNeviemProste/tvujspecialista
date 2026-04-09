'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, KeyRound, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { EditableText } from '@/components/editor/EditableText';
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const t = useTranslations('dashboard.admin.users');
  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [resetingId, setResetingId] = useState<string | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.getUsers(page, 50).then((res) => res.data),
    enabled: user?.role === 'admin',
  });

  if (!authLoading && (!user || user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600 dark:text-gray-400">Access denied</p>
      </div>
    );
  }

  const handleResetPassword = async (userId: string) => {
    setResetingId(userId);
    try {
      await adminApi.resetUserPassword(userId);
      toast.success(t('resetSuccess'));
    } catch {
      toast.error(t('resetError'));
    } finally {
      setResetingId(null);
      setConfirmResetId(null);
    }
  };

  const users: User[] = data?.users || [];
  const filteredUsers = search
    ? users.filter(
        (u: User) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/profi/dashboard"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <EditableText tKey="dashboard.admin.users.backToDashboard">{t('backToDashboard')}</EditableText>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold"><EditableText tKey="dashboard.admin.users.title">{t('title')}</EditableText></h1>
        <span className="text-sm text-gray-500">
          {t('totalUsers', { count: data?.total || 0 })}
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-white dark:bg-card p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-muted rounded" />
                  <div className="h-3 w-48 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.name">{t('name')}</EditableText></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.email">{t('email')}</EditableText></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.role">{t('role')}</EditableText></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.verified">{t('verified')}</EditableText></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.registered">{t('registered')}</EditableText></th>
                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300"><EditableText tKey="dashboard.admin.users.actions">{t('actions')}</EditableText></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((u: User) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'specialist'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmResetId === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-500"><EditableText tKey="dashboard.admin.users.confirmReset">{t('confirmReset')}</EditableText></span>
                        <button
                          onClick={() => handleResetPassword(u.id)}
                          disabled={resetingId === u.id}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {resetingId === u.id ? '...' : t('yes')}
                        </button>
                        <button
                          onClick={() => setConfirmResetId(null)}
                          className="rounded bg-gray-200 dark:bg-muted px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-muted/80"
                        >
                          <EditableText tKey="dashboard.admin.users.no">{t('no')}</EditableText>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmResetId(u.id)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800"
                        title={t('resetPassword')}
                      >
                        <KeyRound className="h-3 w-3" />
                        <EditableText tKey="dashboard.admin.users.resetPassword">{t('resetPassword')}</EditableText>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                <EditableText tKey="dashboard.admin.users.prev">{t('prev')}</EditableText>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('pageOf', { page, total: data.totalPages })}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                <EditableText tKey="dashboard.admin.users.next">{t('next')}</EditableText>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const tActions = useTranslations('common.actions');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);

  const resetPasswordSchema = useMemo(() => z.object({
    password: z
      .string()
      .min(8, t('validation.minLength'))
      .regex(/[A-Z]/, t('validation.uppercase'))
      .regex(/[a-z]/, t('validation.lowercase'))
      .regex(/\d/, t('validation.digit')),
    confirmPassword: z.string().min(1, t('validation.confirmRequired')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.mismatch'),
    path: ['confirmPassword'],
  }), [t]);

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(t('invalidTokenToast'));
      return;
    }

    try {
      await authApi.resetPassword(token, data.password);
      setSuccess(true);
      toast.success(t('successToast'));
      setTimeout(() => router.push('/profi/prihlaseni'), 3000);
    } catch {
      toast.error(t('errorToast'));
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('invalidLink')}</h1>
          <p className="mb-4 text-sm text-gray-600 dark:text-muted-foreground">
            {t('invalidLinkDesc')}
          </p>
          <Link href="/profi/zapomenute-heslo" className="text-sm font-medium text-blue-600 dark:text-primary hover:underline">
            {t('requestNewLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <PublicHeader />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">{t('title')}</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">
              {t('subtitle')}
            </p>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  {t('successMessage')}
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                    {t('newPassword')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder={t('newPasswordPlaceholder')}
                    className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                    {t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/profi/prihlaseni" className="text-sm text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary">
              {tActions('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/utils/error';
import { useTranslations } from 'next-intl';
import { PublicHeader } from '@/components/layout/PublicHeader';

const loginSchema = z.object({
  email: z.string().min(1, 'Email je povinný').email('Zadejte platný email'),
  password: z.string().min(1, 'Heslo je povinné'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const tActions = useTranslations('common.actions');
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/profi/dashboard');
    }
  }, [user, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      await login({
        email: data.email,
        password: data.password,
        remember: rememberMe,
      });
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <PublicHeader />

      {/* Login Form */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border dark:border-border bg-white dark:bg-card p-8 shadow-sm">
            {/* Tab Switcher */}
            <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-muted p-1">
              <span className="flex-1 rounded-md bg-white dark:bg-card py-2.5 text-center text-sm font-medium text-gray-900 dark:text-foreground shadow-sm">
                {t('tabLogin')}
              </span>
              <Link
                href="/profi/registrace"
                className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-all"
              >
                {t('tabRegister')}
              </Link>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">{t('title')}</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">
              {t('subtitle')}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={t('emailPlaceholder')}
                  className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground">{t('rememberMe')}</span>
                </label>
                <Link href="/profi/zapomenute-heslo" className="text-sm font-medium text-blue-600 dark:text-primary hover:underline">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </form>

            <div className="mt-6 border-t dark:border-border pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
                {t('termsAgreement')}{' '}
                <Link href="/pravidla" className="text-blue-600 dark:text-primary hover:underline">
                  {t('termsLink')}
                </Link>{' '}
                {t('and')}{' '}
                <Link href="/ochrana-osobnich-udaju" className="text-blue-600 dark:text-primary hover:underline">
                  {t('privacyLink')}
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary">
              {tActions('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { authApi } from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'noToken'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('noToken');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        if (error.response?.data?.message?.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      }
    };

    verify();
  }, [token]);

  if (status === 'noToken') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('invalidLink')}</h1>
          <p className="mb-4 text-sm text-gray-600 dark:text-muted-foreground">
            {t('invalidLinkDesc')}
          </p>
          <Link href="/profi/prihlaseni" className="text-sm font-medium text-blue-600 dark:text-primary hover:underline">
            {t('backToLogin')}
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
          <div className="rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm text-center">
            {status === 'loading' && (
              <>
                <div className="mb-4 text-5xl animate-spin">⏳</div>
                <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('verifying')}</h1>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">{t('pleaseWait')}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mb-4 text-5xl">✅</div>
                <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('successTitle')}</h1>
                <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">{t('successDesc')}</p>
                <Link
                  href="/profi/prihlaseni"
                  className="inline-block rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {t('backToLogin')}
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mb-4 text-5xl">❌</div>
                <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('errorTitle')}</h1>
                <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">{t('errorDesc')}</p>
                <Link
                  href="/profi/prihlaseni"
                  className="text-sm font-medium text-blue-600 dark:text-primary hover:underline"
                >
                  {t('backToLogin')}
                </Link>
              </>
            )}

            {status === 'expired' && (
              <>
                <div className="mb-4 text-5xl">⏰</div>
                <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">{t('expiredTitle')}</h1>
                <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">{t('expiredDesc')}</p>
                <Link
                  href="/profi/prihlaseni"
                  className="text-sm font-medium text-blue-600 dark:text-primary hover:underline"
                >
                  {t('backToLogin')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

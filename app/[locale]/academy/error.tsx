'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Home, RefreshCw } from 'lucide-react';

export default function AcademyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.generic');

  useEffect(() => {
    console.error('Academy error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.message && (
            <div className="rounded-lg bg-gray-100 p-4 text-sm">
              <p className="font-mono text-gray-500">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} className="w-full sm:flex-1" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('tryAgain')}
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1">
            <Link href="/academy">
              <Home className="mr-2 h-4 w-4" />
              Späť na Akadémiu
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

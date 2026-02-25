'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('errors.notFound');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-8xl font-bold text-primary">404</div>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription className="text-base">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-sm text-muted-foreground">
            {t('suggestion')}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default" className="w-full sm:flex-1">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t('backHome')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1">
            <Link href="/hledat">
              <Search className="mr-2 h-4 w-4" />
              {t('search')}
            </Link>
          </Button>
        </CardFooter>
        <div className="pb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </div>
      </Card>
    </div>
  );
}

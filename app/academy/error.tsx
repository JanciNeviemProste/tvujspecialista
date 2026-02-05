'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AcademyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Academy error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Chyba v Akadémii</CardTitle>
          <CardDescription>
            Nastala chyba pri načítaní kurzu alebo lekcie. Skúste to prosím znova.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.message && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-mono text-muted-foreground">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} className="w-full sm:flex-1" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Skúsiť znova
          </Button>
          <Link href="/academy" className="w-full sm:flex-1">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Späť na Akadémiu
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

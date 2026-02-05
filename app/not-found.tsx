'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-8xl font-bold text-primary">404</div>
          <CardTitle className="text-3xl">Stránka nenájdená</CardTitle>
          <CardDescription className="text-base">
            Stránka ktorú hľadáte neexistuje alebo bola presunutá.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-sm text-muted-foreground">
            Možno by ste mali skúsiť vyhľadávanie alebo sa vrátiť na domovskú stránku.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="w-full sm:flex-1">
            <Button variant="default" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Domov
            </Button>
          </Link>
          <Link href="/hledat" className="w-full sm:flex-1">
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Hľadať
            </Button>
          </Link>
        </CardFooter>
        <div className="pb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Späť
          </Button>
        </div>
      </Card>
    </div>
  );
}

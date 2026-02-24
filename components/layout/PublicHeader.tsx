'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';

export function PublicHeader() {
  const nav = useTranslations('common.nav');
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };

  return (
    <header className="border-b bg-white dark:bg-card sticky top-0 z-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-primary">
          tvujspecialista.cz
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/hledat"
            className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary transition-colors"
          >
            {nav('searchSpecialist')}
          </Link>
          <Link
            href="/ceny"
            className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary transition-colors"
          >
            {nav('membership')}
          </Link>

          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/profi/dashboard"
                className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary transition-colors"
              >
                {nav('dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded bg-blue-600 dark:bg-primary px-4 py-2 text-sm text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors"
              >
                {nav('logout')}
              </button>
            </>
          ) : !isLoading ? (
            <>
              <Link
                href="/profi/prihlaseni"
                className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary transition-colors"
              >
                {nav('login')}
              </Link>
              <Link
                href="/profi/registrace"
                className="rounded bg-blue-600 dark:bg-primary px-4 py-2 text-sm text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors"
              >
                {nav('register')}
              </Link>
            </>
          ) : null}

          <LocaleSwitcher />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Home, PenSquare, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ForumLayoutClientProps {
  children: React.ReactNode;
}

export default function ForumLayoutClient({ children }: ForumLayoutClientProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const t = useTranslations('forum');

  const getBreadcrumbs = () => {
    if (pathname === '/forum') {
      return [{ label: t('breadcrumbs.forum'), href: '/forum' }];
    }
    if (pathname === '/forum/nova-tema') {
      return [
        { label: t('breadcrumbs.forum'), href: '/forum' },
        { label: t('breadcrumbs.newTopic'), href: '/forum/nova-tema' },
      ];
    }
    if (pathname?.match(/^\/forum\/[^/]+\/[^/]+$/)) {
      return [
        { label: t('breadcrumbs.forum'), href: '/forum' },
        { label: t('breadcrumbs.category'), href: `/forum/${pathname.split('/')[2]}` },
        { label: t('breadcrumbs.topic'), href: pathname },
      ];
    }
    if (pathname?.match(/^\/forum\/[^/]+$/)) {
      return [
        { label: t('breadcrumbs.forum'), href: '/forum' },
        { label: t('breadcrumbs.category'), href: pathname },
      ];
    }
    return [{ label: t('breadcrumbs.forum'), href: '/forum' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-background">
      {/* Forum Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/forum"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/forum' ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.categories')}</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/forum/nova-tema"
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      pathname === '/forum/nova-tema' ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <PenSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.newTopic')}</span>
                  </Link>
                  <Link
                    href="/profi/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Right side - Forum branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('branding')}
              </span>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <div className="flex items-center gap-2 text-sm pb-3 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2 flex-shrink-0">
                  {index > 0 && <span className="text-muted-foreground">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}

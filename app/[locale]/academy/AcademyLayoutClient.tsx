'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Home, Library, User, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AcademyLayoutClientProps {
  children: React.ReactNode;
}

export default function AcademyLayoutClient({ children }: AcademyLayoutClientProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const t = useTranslations('academy');

  // Skip breadcrumbs for learn pages (they have their own layout)
  const isLearnPage = pathname?.startsWith('/academy/learn');

  if (isLearnPage) {
    return <>{children}</>;
  }

  const getBreadcrumbs = () => {
    if (pathname === '/academy') {
      return [{ label: t('breadcrumbs.academy'), href: '/academy' }];
    }
    if (pathname === '/academy/courses') {
      return [
        { label: t('breadcrumbs.academy'), href: '/academy' },
        { label: t('breadcrumbs.catalog'), href: '/academy/courses' },
      ];
    }
    if (pathname?.startsWith('/academy/courses/')) {
      return [
        { label: t('breadcrumbs.academy'), href: '/academy' },
        { label: t('breadcrumbs.catalog'), href: '/academy/courses' },
        { label: t('breadcrumbs.courseDetail'), href: pathname },
      ];
    }
    if (pathname === '/academy/my-learning') {
      return [
        { label: t('breadcrumbs.academy'), href: '/academy' },
        { label: t('breadcrumbs.myLearning'), href: '/academy/my-learning' },
      ];
    }
    return [{ label: t('breadcrumbs.academy'), href: '/academy' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Academy Navigation Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/academy"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                  pathname === '/academy' ? "text-blue-600" : "text-gray-500"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.home')}</span>
              </Link>
              <Link
                href="/academy/courses"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                  pathname?.startsWith('/academy/courses') ? "text-blue-600" : "text-gray-500"
                )}
              >
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.courses')}</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/academy/my-learning"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                    pathname === '/academy/my-learning' ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.myLearning')}</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  href="/academy/admin"
                  className="flex items-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.manageCourses')}</span>
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/profi/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                </Link>
              )}
            </nav>

            {/* Right side - Academy branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('branding')}
              </span>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <div className="flex items-center gap-2 text-sm pb-3 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2 flex-shrink-0">
                  {index > 0 && <span className="text-gray-500">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
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

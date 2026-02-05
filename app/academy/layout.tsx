'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AcademyLayoutProps {
  children: React.ReactNode;
}

export default function AcademyLayout({ children }: AcademyLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Skip breadcrumbs for learn pages (they have their own layout)
  const isLearnPage = pathname?.startsWith('/academy/learn');

  if (isLearnPage) {
    return <>{children}</>;
  }

  const getBreadcrumbs = () => {
    if (pathname === '/academy') {
      return [{ label: 'Akadémia', href: '/academy' }];
    }
    if (pathname === '/academy/courses') {
      return [
        { label: 'Akadémia', href: '/academy' },
        { label: 'Katalóg kurzov', href: '/academy/courses' },
      ];
    }
    if (pathname?.startsWith('/academy/courses/')) {
      return [
        { label: 'Akadémia', href: '/academy' },
        { label: 'Katalóg kurzov', href: '/academy/courses' },
        { label: 'Detail kurzu', href: pathname },
      ];
    }
    if (pathname === '/academy/my-learning') {
      return [
        { label: 'Akadémia', href: '/academy' },
        { label: 'Moje vzdelávanie', href: '/academy/my-learning' },
      ];
    }
    return [{ label: 'Akadémia', href: '/academy' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-background">
      {/* Academy Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/academy"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/academy' ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Domov</span>
              </Link>
              <Link
                href="/academy/courses"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname?.startsWith('/academy/courses') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">Kurzy</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/academy/my-learning"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === '/academy/my-learning' ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Moje vzdelávanie</span>
                </Link>
              )}
            </nav>

            {/* Right side - Academy branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Akadémia
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

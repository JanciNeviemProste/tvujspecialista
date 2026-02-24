'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Home, Library, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CommunityLayoutClientProps {
  children: React.ReactNode
}

export default function CommunityLayoutClient({ children }: CommunityLayoutClientProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const t = useTranslations('community')

  const getBreadcrumbs = () => {
    if (pathname === '/community') {
      return [{ label: t('breadcrumbs.community'), href: '/community' }]
    }
    if (pathname === '/community/events') {
      return [
        { label: t('breadcrumbs.community'), href: '/community' },
        { label: t('breadcrumbs.catalog'), href: '/community/events' },
      ]
    }
    if (pathname?.startsWith('/community/events/')) {
      return [
        { label: t('breadcrumbs.community'), href: '/community' },
        { label: t('breadcrumbs.catalog'), href: '/community/events' },
        { label: t('breadcrumbs.eventDetail'), href: pathname },
      ]
    }
    if (pathname === '/community/my-events') {
      return [
        { label: t('breadcrumbs.community'), href: '/community' },
        { label: t('breadcrumbs.myEvents'), href: '/community/my-events' },
      ]
    }
    return [{ label: t('breadcrumbs.community'), href: '/community' }]
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-background">
      {/* Community Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/community"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === '/community' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.home')}</span>
              </Link>
              <Link
                href="/community/events"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname?.startsWith('/community/events') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.events')}</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/community/my-events"
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                      pathname === '/community/my-events' ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.myEvents')}</span>
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

            {/* Right side - Community branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-5 w-5 text-accent-500" />
              <span className="hidden sm:inline bg-gradient-to-r from-accent-500 to-primary bg-clip-text text-transparent">
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
  )
}

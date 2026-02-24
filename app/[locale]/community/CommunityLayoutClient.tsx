'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Home, Library, User, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CommunityLayoutClientProps {
  children: React.ReactNode
}

export default function CommunityLayoutClient({ children }: CommunityLayoutClientProps) {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
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
    <div className="min-h-screen bg-white">
      {/* Community Navigation Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/community"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                  pathname === '/community' ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.home')}</span>
              </Link>
              <Link
                href="/community/events"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                  pathname?.startsWith('/community/events') ? 'text-blue-600' : 'text-gray-500'
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
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                      pathname === '/community/my-events' ? 'text-blue-600' : 'text-gray-500'
                    )}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.myEvents')}</span>
                  </Link>
                  <Link
                    href="/profi/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link
                  href="/profi/dashboard/admin/komunita"
                  className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.manageCommunity')}</span>
                </Link>
              )}
            </nav>

            {/* Right side - Community branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="hidden sm:inline bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Calendar, Home, Library, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CommunityLayoutProps {
  children: React.ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const getBreadcrumbs = () => {
    if (pathname === '/community') {
      return [{ label: 'Komunita', href: '/community' }]
    }
    if (pathname === '/community/events') {
      return [
        { label: 'Komunita', href: '/community' },
        { label: 'Katalóg eventov', href: '/community/events' },
      ]
    }
    if (pathname?.startsWith('/community/events/')) {
      return [
        { label: 'Komunita', href: '/community' },
        { label: 'Katalóg eventov', href: '/community/events' },
        { label: 'Detail eventu', href: pathname },
      ]
    }
    if (pathname === '/community/my-events') {
      return [
        { label: 'Komunita', href: '/community' },
        { label: 'Moje eventy', href: '/community/my-events' },
      ]
    }
    return [{ label: 'Komunita', href: '/community' }]
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
                <span className="hidden sm:inline">Domov</span>
              </Link>
              <Link
                href="/community/events"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname?.startsWith('/community/events') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">Eventy</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/community/my-events"
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/community/my-events' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Moje eventy</span>
                </Link>
              )}
            </nav>

            {/* Right side - Community branding */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-5 w-5 text-accent-500" />
              <span className="hidden sm:inline bg-gradient-to-r from-accent-500 to-primary bg-clip-text text-transparent">
                Komunita
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

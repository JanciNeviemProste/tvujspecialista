'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, DollarSign, GraduationCap, Users, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label={isOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-background border-t z-50 overflow-y-auto">
            <nav className="container mx-auto px-4 py-6">
              <div className="space-y-1">
                {/* Main Navigation */}
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Domov</span>
                </Link>

                <Link
                  href="/hledat"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Hľadať špecialistu</span>
                </Link>

                <Link
                  href="/ceny"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Ceny</span>
                </Link>

                <div className="my-4 border-t" />

                {/* Academy & Community */}
                <Link
                  href="/academy"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Akadémia</span>
                </Link>

                <Link
                  href="/community"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Users className="h-5 w-5 text-accent-500" />
                  <span className="font-medium">Komunita</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <div className="my-4 border-t" />
                    <Link
                      href="/profi/dashboard"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </>
                )}

                <div className="my-4 border-t" />

                {/* CTA Buttons */}
                <div className="px-4 py-2 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Prihlásený ako: <span className="font-medium text-foreground">{user?.email}</span>
                      </p>
                      <Link href="/my-account" onClick={closeMenu} className="w-full">
                        <Button variant="outline" className="w-full" size="lg">
                          Môj účet
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profi/prihlaseni" onClick={closeMenu} className="w-full">
                        <Button variant="outline" className="w-full" size="lg">
                          Prihlásiť sa
                        </Button>
                      </Link>
                      <Link href="/profi/registrace" onClick={closeMenu} className="w-full">
                        <Button className="w-full" size="lg">
                          Registrácia zdarma
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

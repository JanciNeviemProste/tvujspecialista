'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeaderV5() {
  const nav = useTranslations('common.nav');
  const spec = useTranslations('common.nav.specialistDropdown');
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) closeDropdown();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen, closeDropdown]);

  return (
    <header
      data-theme="v5"
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Masthead — top row */}
      <div className="border-y-2 border-foreground">
        <div className="container mx-auto grid grid-cols-3 items-center px-6 py-4 lg:px-12">
          <div
            className="text-xs uppercase tracking-widest text-muted-foreground"
            style={{ letterSpacing: '0.15em' }}
          >
            Vol. I · No. 01
          </div>
          <Link
            href="/"
            className="text-center text-2xl tracking-tight text-foreground transition-colors hover:text-accent"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            TVŮJ<em className="italic text-accent">·</em>SPECIALISTA
          </Link>
          <div
            className="text-right text-xs uppercase tracking-widest text-muted-foreground"
            style={{ letterSpacing: '0.15em' }}
          >
            Praha · Apríl 2026
          </div>
        </div>
      </div>

      {/* Nav strip — bottom row */}
      <div className="border-b border-foreground/20">
        <div className="container mx-auto flex items-center justify-between px-6 py-3 lg:px-12">
          {/* Left nav */}
          <nav
            className="hidden items-center gap-8 text-xs uppercase tracking-widest text-foreground md:flex"
            style={{ letterSpacing: '0.12em' }}
          >
            <Link href="/hledat" className="hover:text-accent">
              {nav('searchSpecialist')}
            </Link>
            {!isLoading && isAuthenticated && (
              <>
                <Link href="/profi/dashboard/ceny" className="hover:text-accent">
                  {nav('membership')}
                </Link>
                <Link href="/profi/dashboard" className="hover:text-accent">
                  {nav('dashboard')}
                </Link>
              </>
            )}
          </nav>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-4">
            {!isLoading && isAuthenticated && <NotificationBell />}
            <ThemeToggle />
            <LocaleSwitcher />

            {/* Desktop auth */}
            <div className="hidden md:block">
              {!isLoading && isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="border border-foreground px-4 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
                  style={{ letterSpacing: '0.12em' }}
                >
                  {nav('logout')}
                </button>
              ) : !isLoading ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {nav('iAmSpecialist')}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-72 border border-foreground bg-popover shadow-lg"
                      >
                        <Link
                          href="/profi/prihlaseni"
                          onClick={closeDropdown}
                          className="flex items-center gap-4 border-b border-foreground/15 px-6 py-5 transition-colors hover:bg-secondary"
                        >
                          <LogIn className="h-4 w-4 text-accent" />
                          <div>
                            <div
                              className="text-sm uppercase tracking-[0.15em] text-foreground"
                              style={{
                                fontFamily: 'var(--font-display-serif), Georgia, serif',
                                fontWeight: 400,
                              }}
                            >
                              {spec('login')}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                              Už mám účet
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/profi/registrace"
                          onClick={closeDropdown}
                          className="flex items-center gap-4 bg-foreground px-6 py-5 text-background transition-opacity hover:opacity-90"
                        >
                          <UserPlus className="h-4 w-4 text-accent" />
                          <div>
                            <div
                              className="text-sm uppercase tracking-[0.15em]"
                              style={{
                                fontFamily: 'var(--font-display-serif), Georgia, serif',
                                fontWeight: 400,
                              }}
                            >
                              {spec('register')}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.15em] opacity-70">
                              Zdarma · 2 minúty
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

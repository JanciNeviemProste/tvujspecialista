'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeaderV3() {
  const nav = useTranslations('common.nav');
  const spec = useTranslations('common.nav.specialistDropdown');
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
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
      data-theme="v3"
      className="sticky top-0 z-40 border-b border-foreground/20 bg-background/90 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="flex items-center justify-between px-8 py-6 lg:px-16">
        {/* LEFT — Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="text-sm font-medium tracking-widest text-foreground uppercase"
            style={{ letterSpacing: '0.15em' }}
          >
            TVŮJ<span className="text-accent">·</span>SPECIALISTA
          </span>
        </Link>

        {/* CENTER — Nav links */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/hledat"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            style={{ letterSpacing: '0.12em' }}
          >
            {nav('searchSpecialist')}
          </Link>
          {!isLoading && isAuthenticated && (
            <>
              <Link
                href="/profi/dashboard/ceny"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                {nav('membership')}
              </Link>
              <Link
                href="/profi/dashboard"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                {nav('dashboard')}
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT CLUSTER — desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {!isLoading && isAuthenticated && <NotificationBell />}
          <ThemeToggle />
          <LocaleSwitcher />

          {isLoading ? (
            <div className="h-10 w-32" aria-hidden />
          ) : isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
              style={{ letterSpacing: '0.12em' }}
            >
              {nav('logout')}
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
                style={{ letterSpacing: '0.12em' }}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {nav('iAmSpecialist')}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full z-50 mt-2 w-72 border border-foreground/20 bg-popover shadow-lg"
                  >
                    <Link
                      href="/profi/prihlaseni"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 border-b border-foreground/10 px-6 py-4 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
                      style={{ letterSpacing: '0.12em' }}
                    >
                      <LogIn className="h-4 w-4 text-accent" />
                      {spec('login')}
                    </Link>
                    <Link
                      href="/profi/registrace"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-6 py-4 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
                      style={{ letterSpacing: '0.12em' }}
                    >
                      <UserPlus className="h-4 w-4 text-accent" />
                      {spec('register')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE CLUSTER */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

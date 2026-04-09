'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/theme-toggle';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeaderV2() {
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
      data-theme="v2"
      className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        {/* LEFT: Logo + status pill */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_4px_12px_-2px_hsl(var(--primary)/0.4)] transition-transform group-hover:scale-105" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              tvuj<span className="text-primary">specialista</span>
            </span>
          </Link>

          {/* Mono status pill — hidden on mobile */}
          <div
            className="hidden items-center gap-2 rounded-md border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] md:inline-flex"
            style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-muted-foreground">marketplace-v4.2</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">live</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">CS/SK/EN/PL</span>
          </div>
        </div>

        {/* CENTER NAV (desktop only) */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/hledat"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {nav('searchSpecialist')}
          </Link>
          {!isLoading && isAuthenticated && (
            <>
              <Link
                href="/profi/dashboard/ceny"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {nav('membership')}
              </Link>
              <Link
                href="/profi/dashboard"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {nav('dashboard')}
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT cluster — desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          {!isLoading && isAuthenticated ? (
            <>
              <NotificationBell />
              <ThemeToggle />
              <LocaleSwitcher />
              <button
                onClick={handleLogout}
                className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                {nav('logout')}
              </button>
            </>
          ) : !isLoading ? (
            <>
              <ThemeToggle />
              <LocaleSwitcher />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_8px_24px_-8px_hsl(var(--primary)/0.5)] transition-all hover:-translate-y-px hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_12px_32px_-8px_hsl(var(--primary)/0.7)]"
                >
                  {nav('iAmSpecialist')}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: EASE }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-popover p-2 shadow-xl"
                    >
                      <Link
                        href="/profi/prihlaseni"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-secondary"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
                          <LogIn className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-foreground">
                            {spec('login')}
                          </div>
                          <div
                            className="text-[11px] text-muted-foreground"
                            style={{
                              fontFamily:
                                'var(--font-v2-mono), ui-monospace, monospace',
                            }}
                          >
                            ~/login
                          </div>
                        </div>
                      </Link>
                      <Link
                        href="/profi/registrace"
                        onClick={closeDropdown}
                        className="mt-1 flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/10"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                          <UserPlus className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-foreground">
                            {spec('register')}
                          </div>
                          <div
                            className="text-[11px] text-muted-foreground"
                            style={{
                              fontFamily:
                                'var(--font-v2-mono), ui-monospace, monospace',
                            }}
                          >
                            ~/register --free
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : null}
        </div>

        {/* MOBILE cluster */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

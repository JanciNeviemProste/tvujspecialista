'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronDown, LogIn, UserPlus, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeaderV4() {
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
      data-theme="v4"
      className="sticky top-0 z-40 w-full border-b-4 border-foreground bg-background/90 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo — chunky brutalist */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-foreground bg-primary shadow-[4px_4px_0_hsl(var(--foreground))]">
            <Zap className="h-6 w-6 text-primary-foreground" strokeWidth={3.5} />
          </div>
          <span className="hidden text-xl font-black tracking-tight text-foreground sm:inline">
            tvujspecialista
          </span>
        </Link>

        {/* Center nav — chunky pills (desktop) */}
        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href="/hledat"
            className="rounded-full border-2 border-transparent px-5 py-2 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {nav('searchSpecialist')}
          </Link>
          {!isLoading && isAuthenticated && (
            <>
              <Link
                href="/profi/dashboard/ceny"
                className="rounded-full border-2 border-transparent px-5 py-2 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {nav('membership')}
              </Link>
              <Link
                href="/profi/dashboard"
                className="rounded-full border-2 border-transparent px-5 py-2 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {nav('dashboard')}
              </Link>
            </>
          )}
        </nav>

        {/* Right cluster (desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          {!isLoading && isAuthenticated ? (
            <>
              <NotificationBell />
              <ThemeToggle />
              <LocaleSwitcher />
              <button
                onClick={handleLogout}
                className="rounded-full border-4 border-foreground bg-card px-5 py-2 text-sm font-black uppercase tracking-wide text-foreground shadow-[4px_4px_0_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_hsl(var(--foreground))]"
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
                  className="group flex items-center gap-2 rounded-full border-4 border-foreground bg-foreground px-6 py-3 text-sm font-black uppercase tracking-wide text-background shadow-[4px_4px_0_hsl(var(--accent))] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_hsl(var(--accent))]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {nav('iAmSpecialist')}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    strokeWidth={3}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-4 w-72 overflow-hidden rounded-3xl border-4 border-foreground bg-popover p-2 shadow-[8px_8px_0_hsl(var(--foreground))]"
                    >
                      <Link
                        href="/profi/prihlaseni"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-secondary"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground">
                          <LogIn className="h-5 w-5" strokeWidth={3} />
                        </div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-wide text-foreground">
                            {spec('login')}
                          </div>
                          <div className="text-xs text-muted-foreground">Už mám účet</div>
                        </div>
                      </Link>
                      <Link
                        href="/profi/registrace"
                        onClick={closeDropdown}
                        className="mt-1 flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-accent-foreground transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground bg-foreground text-background">
                          <UserPlus className="h-5 w-5" strokeWidth={3} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black uppercase tracking-wide">
                            {spec('register')}
                          </div>
                          <div className="text-xs opacity-80">Zdarma · 2 min</div>
                        </div>
                        <ArrowRight className="h-4 w-4" strokeWidth={3} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : null}
        </div>

        {/* Mobile cluster */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

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
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { EditableText } from '@/components/editor/EditableText';
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PremiumHeader() {
  const nav = useTranslations('common.nav');
  const spec = useTranslations('common.nav.specialistDropdown');
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

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
    <header className="sticky top-0 z-40 w-full">
      <motion.div
        className={`mx-auto transition-all duration-500 ${
          scrolled
            ? 'mt-3 max-w-5xl px-4'
            : 'mt-0 max-w-7xl px-4'
        }`}
      >
        <motion.div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? 'glass-premium rounded-full border border-border/40 px-4 py-2 shadow-elevation-3'
              : 'border-b border-border/40 bg-background/80 backdrop-blur-md py-3'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 font-bold tracking-tight"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent shadow-indigo">
              <span
                className="text-[1.5rem] italic leading-none text-white"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontWeight: 400,
                  marginTop: '-2px',
                  marginLeft: '1px',
                }}
              >
                t
              </span>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className={`text-lg transition-all duration-300 ${scrolled ? 'hidden sm:inline' : 'inline'}`}>
              tvuj<span className="text-primary">specialista</span>
            </span>
          </Link>

          {/* Desktop Navigation — pill style */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/hledat"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <EditableText tKey="common.nav.searchSpecialist">{nav('searchSpecialist')}</EditableText>
            </Link>

            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  href="/profi/dashboard/ceny"
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <EditableText tKey="common.nav.membership">{nav('membership')}</EditableText>
                </Link>
                <Link
                  href="/profi/dashboard"
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <EditableText tKey="common.nav.dashboard">{nav('dashboard')}</EditableText>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-2">
            {!isLoading && isAuthenticated ? (
              <>
                <NotificationBell />
                <ThemeToggle />
                <LocaleSwitcher />
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
                >
                  <EditableText tKey="common.nav.logout">{nav('logout')}</EditableText>
                </button>
              </>
            ) : !isLoading ? (
              <>
                <ThemeToggle />
                <LocaleSwitcher />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-elevation-2 transition-all hover:shadow-elevation-3 hover:-translate-y-px"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <EditableText tKey="common.nav.iAmSpecialist">{nav('iAmSpecialist')}</EditableText>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                      className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover shadow-elevation-5"
                    >
                      <div className="p-2">
                        <Link
                          href="/profi/prihlaseni"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-secondary"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                            <LogIn className="h-4 w-4 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              <EditableText tKey="common.nav.specialistDropdown.login">{spec('login')}</EditableText>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <EditableText tKey="common.nav.loginSubtitle">{nav('loginSubtitle')}</EditableText>
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/profi/registrace"
                          onClick={closeDropdown}
                          className="mt-1 flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-3 transition-colors hover:from-primary/15 hover:to-accent/15"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-indigo">
                            <UserPlus className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              <EditableText tKey="common.nav.specialistDropdown.register">{spec('register')}</EditableText>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <EditableText tKey="common.nav.registerSubtitle">{nav('registerSubtitle')}</EditableText>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
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
        </motion.div>
      </motion.div>
    </header>
  );
}

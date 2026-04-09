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

import { EditableText } from '@/components/editor/EditableText';
export function PublicHeader() {
  const nav = useTranslations('common.nav');
  const spec = useTranslations('common.nav.specialistDropdown');
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          tvujspecialista.cz
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/hledat"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            <EditableText tKey="common.nav.searchSpecialist">{nav('searchSpecialist')}</EditableText>
          </Link>
          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/profi/dashboard/ceny"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                <EditableText tKey="common.nav.membership">{nav('membership')}</EditableText>
              </Link>
              <Link
                href="/profi/dashboard"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                <EditableText tKey="common.nav.dashboard">{nav('dashboard')}</EditableText>
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
              >
                <EditableText tKey="common.nav.logout">{nav('logout')}</EditableText>
              </button>
            </>
          ) : !isLoading ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <EditableText tKey="common.nav.iAmSpecialist">{nav('iAmSpecialist')}</EditableText>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <Link
                      href="/profi/prihlaseni"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100"><EditableText tKey="common.nav.specialistDropdown.login">{spec('login')}</EditableText></span>
                    </Link>
                    <Link
                      href="/profi/registrace"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400"><EditableText tKey="common.nav.specialistDropdown.register">{spec('register')}</EditableText></span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <ThemeToggle />
          <LocaleSwitcher />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

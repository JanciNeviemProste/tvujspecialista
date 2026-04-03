'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ChevronDown, LogIn, UserPlus, Star, TrendingUp, Shield, Users } from 'lucide-react';

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
    <header className="border-b bg-white sticky top-0 z-30">
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
            {nav('searchSpecialist')}
          </Link>
          {/* Hidden: Membership link - uncomment when pricing page is ready
          <Link
            href="/ceny"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            {nav('membership')}
          </Link>
          */}

          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/profi/dashboard"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {nav('dashboard')}
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
              >
                {nav('logout')}
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
                {nav('iAmSpecialist')}
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
                  {/* Actions */}
                  <div className="p-3 space-y-1">
                    <Link
                      href="/profi/prihlaseni"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <LogIn className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{spec('login')}</p>
                        <p className="text-xs text-gray-500">{spec('loginDesc')}</p>
                      </div>
                    </Link>
                    <Link
                      href="/profi/registrace"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-600">{spec('register')}</p>
                        <p className="text-xs text-gray-500">{spec('registerDesc')}</p>
                      </div>
                    </Link>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{spec('whyJoin')}</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-600">{spec('benefit1')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Users className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-600">{spec('benefit2')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Star className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-600">{spec('benefit3')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-600">{spec('benefit4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <LocaleSwitcher />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

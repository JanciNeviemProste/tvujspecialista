'use client';

import { Link } from '@/i18n/routing';
import { useRouter, usePathname } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

export function DashboardHeader() {
  const t = useTranslations('dashboard.header');
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };

  const navLinks = [
    { href: '/profi/dashboard', label: t('dashboard'), exact: true },
    { href: '/academy', label: t('academy'), exact: false },
    { href: '/community', label: t('community'), exact: false },
    { href: '/forum', label: t('forum'), exact: false },
    { href: '/profi/dashboard/nastaveni', label: t('account'), exact: true },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          tvujspecialista.cz
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(({ href, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t('logout')}
          </button>
        </nav>
      </div>
    </header>
  );
}

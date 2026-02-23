'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/profi/prihlaseni');
  };

  const navLinks = [
    { href: '/profi/dashboard', label: 'Dashboard', exact: true },
    { href: '/academy', label: 'Akadémia', exact: false },
    { href: '/forum', label: 'Fórum', exact: false },
    { href: '/community', label: 'Komunita', exact: false },
    { href: '/profi/dashboard/nastaveni', label: 'Účet', exact: true },
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
            Odhlásit se
          </button>
        </nav>
      </div>
    </header>
  );
}

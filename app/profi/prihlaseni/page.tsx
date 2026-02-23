'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/utils/error';

const loginSchema = z.object({
  email: z.string().min(1, 'Email je povinný').email('Zadejte platný email'),
  password: z.string().min(1, 'Heslo je povinné'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      await login({
        email: data.email,
        password: data.password,
        remember: rememberMe,
      });
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-primary">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/hledat" className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary">
              Hledat
            </Link>
            <Link href="/profi/prihlaseni" className="text-sm font-medium text-blue-600 dark:text-primary">
              Přihlásit se
            </Link>
            <Link href="/profi/registrace" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">
              Registrace zdarma
            </Link>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border dark:border-border bg-white dark:bg-card p-8 shadow-sm">
            {/* Tab Switcher */}
            <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-muted p-1">
              <span className="flex-1 rounded-md bg-white dark:bg-card py-2.5 text-center text-sm font-medium text-gray-900 dark:text-foreground shadow-sm">
                Přihlášení
              </span>
              <Link
                href="/profi/registrace"
                className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-all"
              >
                Registrace
              </Link>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">Přihlášení pro specialisty</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">
              Zadejte své přihlašovací údaje
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="vas@email.cz"
                  className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                  Heslo
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-muted-foreground">Zapamatovat si mě</span>
                </label>
                <Link href="/profi/zapomenute-heslo" className="text-sm font-medium text-blue-600 dark:text-primary hover:underline">
                  Zapomenuté heslo?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Přihlašování...' : 'Přihlásit se'}
              </button>
            </form>

            <div className="mt-6 border-t dark:border-border pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
                Přihlášením souhlasíte s{' '}
                <Link href="/pravidla" className="text-blue-600 dark:text-primary hover:underline">
                  obchodními podmínkami
                </Link>{' '}
                a{' '}
                <Link href="/ochrana-osobnich-udaju" className="text-blue-600 dark:text-primary hover:underline">
                  ochranou údajů
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary">
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

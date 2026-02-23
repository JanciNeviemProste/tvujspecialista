'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email je povinný').email('Zadejte platný email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data.email);
      setSubmitted(true);
      toast.success('Pokyny k obnovení hesla byly odeslány na váš email');
    } catch {
      toast.error('Nepodařilo se odeslat email. Zkuste to prosím znovu.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <header className="border-b bg-white dark:bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-primary">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/profi/prihlaseni" className="text-sm font-medium hover:text-blue-600 dark:text-muted-foreground dark:hover:text-primary">
              Přihlásit se
            </Link>
            <Link href="/profi/registrace" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">
              Registrace zdarma
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">Zapomenuté heslo</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">
              Zadejte svůj email a my vám pošleme odkaz pro obnovení hesla.
            </p>

            {submitted ? (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Pokud účet s tímto emailem existuje, odeslali jsme vám email s pokyny k obnovení hesla. Zkontrolujte svou schránku.
                </p>
                <Link
                  href="/profi/prihlaseni"
                  className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-primary hover:underline"
                >
                  Zpět na přihlášení
                </Link>
              </div>
            ) : (
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Odesílání...' : 'Odeslat odkaz pro obnovení'}
                </button>
              </form>
            )}

            <div className="mt-6 border-t dark:border-border pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
                Vzpomněli jste si na heslo?{' '}
                <Link href="/profi/prihlaseni" className="text-blue-600 dark:text-primary hover:underline">
                  Přihlásit se
                </Link>
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

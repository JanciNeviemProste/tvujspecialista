'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Heslo musí mít alespoň 8 znaků')
    .regex(/[A-Z]/, 'Heslo musí obsahovat alespoň jedno velké písmeno')
    .regex(/[a-z]/, 'Heslo musí obsahovat alespoň jedno malé písmeno')
    .regex(/\d/, 'Heslo musí obsahovat alespoň jednu číslici'),
  confirmPassword: z.string().min(1, 'Potvrzení hesla je povinné'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hesla se neshodují',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Neplatný odkaz pro obnovení hesla');
      return;
    }

    try {
      await authApi.resetPassword(token, data.password);
      setSuccess(true);
      toast.success('Heslo bylo úspěšně změněno');
      setTimeout(() => router.push('/profi/prihlaseni'), 3000);
    } catch {
      toast.error('Nepodařilo se změnit heslo. Odkaz mohl vypršet.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-foreground">Neplatný odkaz</h1>
          <p className="mb-4 text-sm text-gray-600 dark:text-muted-foreground">
            Odkaz pro obnovení hesla je neplatný nebo chybí token.
          </p>
          <Link href="/profi/zapomenute-heslo" className="text-sm font-medium text-blue-600 dark:text-primary hover:underline">
            Požádat o nový odkaz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <header className="border-b bg-white dark:bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-primary">
            tvujspecialista.cz
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white dark:bg-card dark:border-border p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">Nové heslo</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-muted-foreground">
              Zadejte své nové heslo.
            </p>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Heslo bylo úspěšně změněno. Budete přesměrováni na přihlášení...
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                    Nové heslo
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Min. 8 znaků"
                    className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700 dark:text-foreground">
                    Potvrdit heslo
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Zadejte heslo znovu"
                    className="w-full rounded-md border border-gray-300 dark:border-border dark:bg-background dark:text-foreground px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Ukládání...' : 'Nastavit nové heslo'}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/profi/prihlaseni" className="text-sm text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary">
              ← Zpět na přihlášení
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

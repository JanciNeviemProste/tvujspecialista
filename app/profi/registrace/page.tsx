'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import type { SpecialistCategory } from '@/types/specialist';
import { getErrorMessage } from '@/lib/utils/error';

const registrationSchema = z
  .object({
    name: z.string().min(1, 'Jméno je povinné'),
    email: z.string().min(1, 'Email je povinný').email('Zadejte platný email'),
    phone: z.string().min(1, 'Telefon je povinný'),
    password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků'),
    confirmPassword: z.string().min(1, 'Potvrzení hesla je povinné'),
    category: z.string().min(1, 'Kategorie je povinná'),
    location: z.string().min(1, 'Lokalita je povinná'),
    yearsExperience: z.string().min(1, 'Roky praxe jsou povinné'),
    bio: z.string().min(1, 'Popis služeb je povinný'),
    termsAccepted: z.literal(true, {
      message: 'Musíte souhlasit s obchodními podmínkami',
    }),
    gdprAccepted: z.literal(true, {
      message: 'Musíte souhlasit se zpracováním osobních údajů',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hesla se neshodují',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      termsAccepted: false as unknown as true,
      gdprAccepted: false as unknown as true,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setError('');

    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        category: data.category as SpecialistCategory,
        location: data.location,
        yearsExperience: parseInt(data.yearsExperience),
        bio: data.bio,
      });

      // Save tokens to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      // Redirect to dashboard
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </Link>
            <Link href="/profi/prihlaseni" className="text-sm font-medium text-blue-600">
              Přihlášení
            </Link>
          </nav>
        </div>
      </header>

      {/* Registration Form */}
      <div className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Staňte se naším specialistou</h1>
            <p className="text-gray-600">Získejte kvalitní leady a rozšiřte své podnikání</p>
          </div>

          <div className="rounded-lg border bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3" role="alert">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Info */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Osobní údaje</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-gray-700">
                        Jméno a příjmení <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="Jan Novák"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.name ? 'true' : undefined}
                        aria-describedby={errors.name ? 'reg-name-error' : undefined}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p id="reg-name-error" className="text-sm text-red-500" role="alert">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="jan@example.cz"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.email ? 'true' : undefined}
                        aria-describedby={errors.email ? 'reg-email-error' : undefined}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="reg-email-error" className="text-sm text-red-500" role="alert">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-phone" className="mb-1 block text-sm font-medium text-gray-700">
                      Telefon <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+420 777 123 456"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-invalid={errors.phone ? 'true' : undefined}
                      aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p id="reg-phone-error" className="text-sm text-red-500" role="alert">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Profesní informace</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="reg-category" className="mb-1 block text-sm font-medium text-gray-700">
                        Kategorie <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="reg-category"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.category ? 'true' : undefined}
                        aria-describedby={errors.category ? 'reg-category-error' : undefined}
                        {...register('category')}
                      >
                        <option value="">Vyberte kategorii</option>
                        <option value="Finanční poradce">Finanční poradce</option>
                        <option value="Realitní makléř">Realitní makléř</option>
                      </select>
                      {errors.category && (
                        <p id="reg-category-error" className="text-sm text-red-500" role="alert">{errors.category.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="reg-location" className="mb-1 block text-sm font-medium text-gray-700">
                        Lokalita <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="reg-location"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.location ? 'true' : undefined}
                        aria-describedby={errors.location ? 'reg-location-error' : undefined}
                        {...register('location')}
                      >
                        <option value="">Vyberte lokalitu</option>
                        <option value="Praha">Praha</option>
                        <option value="Brno">Brno</option>
                        <option value="Ostrava">Ostrava</option>
                        <option value="Plzeň">Plzeň</option>
                      </select>
                      {errors.location && (
                        <p id="reg-location-error" className="text-sm text-red-500" role="alert">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-experience" className="mb-1 block text-sm font-medium text-gray-700">
                      Roky praxe <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-experience"
                      type="number"
                      min="0"
                      placeholder="např. 5"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-invalid={errors.yearsExperience ? 'true' : undefined}
                      aria-describedby={errors.yearsExperience ? 'reg-experience-error' : undefined}
                      {...register('yearsExperience')}
                    />
                    {errors.yearsExperience && (
                      <p id="reg-experience-error" className="text-sm text-red-500" role="alert">{errors.yearsExperience.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-bio" className="mb-1 block text-sm font-medium text-gray-700">
                      Krátký popis vašich služeb <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="reg-bio"
                      rows={4}
                      placeholder="Popište, čím se zabýváte a jak můžete pomoci klientům..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-invalid={errors.bio ? 'true' : undefined}
                      aria-describedby={errors.bio ? 'reg-bio-error' : undefined}
                      {...register('bio')}
                    />
                    {errors.bio && (
                      <p id="reg-bio-error" className="text-sm text-red-500" role="alert">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Nastavení hesla</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-700">
                      Heslo <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      placeholder="Minimálně 8 znaků"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-invalid={errors.password ? 'true' : undefined}
                      aria-describedby={errors.password ? 'reg-password-error' : undefined}
                      {...register('password')}
                    />
                    {errors.password && (
                      <p id="reg-password-error" className="text-sm text-red-500" role="alert">{errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="reg-confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
                      Potvrzení hesla <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="Zadejte heslo znovu"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-invalid={errors.confirmPassword ? 'true' : undefined}
                      aria-describedby={errors.confirmPassword ? 'reg-confirm-password-error' : undefined}
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p id="reg-confirm-password-error" className="text-sm text-red-500" role="alert">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                      {...register('termsAccepted')}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím s{' '}
                      <Link href="/pravidla" className="text-blue-600 hover:underline">
                        obchodními podmínkami
                      </Link>{' '}
                      *
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
                  )}
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                      {...register('gdprAccepted')}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím se{' '}
                      <Link
                        href="/ochrana-osobnich-udaju"
                        className="text-blue-600 hover:underline"
                      >
                        zpracováním osobních údajů
                      </Link>{' '}
                      *
                    </span>
                  </label>
                  {errors.gdprAccepted && (
                    <p className="text-sm text-red-500">{errors.gdprAccepted.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Registruji...' : 'Zaregistrovat se zdarma'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Již máte účet?{' '}
                <Link href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                  Přihlaste se
                </Link>
              </p>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">✓</div>
              <h3 className="mb-1 font-semibold text-gray-900">Kvalitní leady</h3>
              <p className="text-sm text-gray-600">Kontakty od skutečně zajímavých klientů</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">⭐</div>
              <h3 className="mb-1 font-semibold text-gray-900">Ověřený profil</h3>
              <p className="text-sm text-gray-600">Zvyšte důvěryhodnost vašich služeb</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">📊</div>
              <h3 className="mb-1 font-semibold text-gray-900">14 dní zdarma</h3>
              <p className="text-sm text-gray-600">Vyzkoušejte bez závazků</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

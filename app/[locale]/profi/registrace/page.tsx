'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { SpecialistCategory } from '@/types/specialist';
import { getErrorMessage } from '@/lib/utils/error';
import { useTranslations, useLocale } from 'next-intl';
import { PublicHeader } from '@/components/layout/PublicHeader';
import {
  TrendingUp,
  UserCheck,
  Star,
  LayoutDashboard,
  GraduationCap,
  Users,
  CheckCircle2,
  Quote,
  Zap,
} from 'lucide-react';

const registrationSchema = z
  .object({
    name: z.string().min(1, 'nameRequired'),
    email: z.string().min(1, 'emailRequired').email('emailInvalid'),
    phone: z.string().min(1, 'phoneRequired'),
    password: z.string().min(8, 'passwordMinLength'),
    confirmPassword: z.string().min(1, 'confirmPasswordRequired'),
    category: z.string().min(1, 'categoryRequired'),
    location: z.string().min(1, 'locationRequired'),
    yearsExperience: z.string().min(1, 'experienceRequired'),
    bio: z.string().min(1, 'bioRequired'),
    termsAccepted: z.literal(true, {
      message: 'termsRequired',
    }),
    gdprAccepted: z.literal(true, {
      message: 'gdprRequired',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const t = useTranslations('auth.register');
  const l = useTranslations('auth.register.landing');
  const tValidation = useTranslations('common.validation');
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
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
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        category: data.category as SpecialistCategory,
        location: data.location,
        yearsExperience: parseInt(data.yearsExperience),
        bio: data.bio,
        locale,
      });

      toast.success(t('successToast'));

      await login({ email: data.email, password: data.password });
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const benefits = [
    { icon: TrendingUp, title: l('benefit1Title'), desc: l('benefit1Desc'), color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: UserCheck, title: l('benefit2Title'), desc: l('benefit2Desc'), color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: Star, title: l('benefit3Title'), desc: l('benefit3Desc'), color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: LayoutDashboard, title: l('benefit4Title'), desc: l('benefit4Desc'), color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: GraduationCap, title: l('benefit5Title'), desc: l('benefit5Desc'), color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Users, title: l('benefit6Title'), desc: l('benefit6Desc'), color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ─── LEFT COLUMN: Copywriting ─── */}
          <div className="lg:sticky lg:top-24">

            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 mb-6">
              <Zap className="h-4 w-4" />
              {l('urgencyBadge')}
            </div>

            {/* Hero headline */}
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {l('heroTitle')}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {l('heroSubtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: l('statsValue1'), label: l('statsLabel1') },
                { value: l('statsValue2'), label: l('statsLabel2') },
                { value: l('statsValue3'), label: l('statsLabel3') },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-blue-600">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                  <div className={`shrink-0 rounded-lg ${b.bg} p-2.5`}>
                    <b.icon className={`h-5 w-5 ${b.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="rounded-xl bg-blue-600 p-6 text-white mb-6">
              <Quote className="h-8 w-8 text-blue-300 mb-3" />
              <p className="text-base leading-relaxed font-medium italic mb-4">
                {l('testimonialQuote')}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-sm">
                  {l('testimonialAuthor').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{l('testimonialAuthor')}</p>
                  <p className="text-blue-200 text-xs">{l('testimonialRole')}</p>
                </div>
              </div>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              {l('trustLine')}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Registration Form ─── */}
          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              {/* Tab Switcher */}
              <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
                <Link
                  href="/profi/prihlaseni"
                  className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
                >
                  {t('tabLogin')}
                </Link>
                <span className="flex-1 rounded-md bg-white py-2.5 text-center text-sm font-medium text-gray-900 shadow-sm">
                  {t('tabRegister')}
                </span>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3" role="alert">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Info */}
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('personalInfo')}</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('name')} <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          placeholder={t('namePlaceholder')}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-invalid={errors.name ? 'true' : undefined}
                          aria-describedby={errors.name ? 'reg-name-error' : undefined}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p id="reg-name-error" className="text-sm text-red-500" role="alert">{tValidation(errors.name.message as Parameters<typeof tValidation>[0])}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('email')} <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          placeholder={t('emailPlaceholder')}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-invalid={errors.email ? 'true' : undefined}
                          aria-describedby={errors.email ? 'reg-email-error' : undefined}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p id="reg-email-error" className="text-sm text-red-500" role="alert">{tValidation(errors.email.message as Parameters<typeof tValidation>[0])}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className="mb-1 block text-sm font-medium text-gray-700">
                        {t('phone')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.phone ? 'true' : undefined}
                        aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p id="reg-phone-error" className="text-sm text-red-500" role="alert">{tValidation(errors.phone.message as Parameters<typeof tValidation>[0])}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="border-t pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('professionalInfo')}</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="reg-category" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('category')} <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="reg-category"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-invalid={errors.category ? 'true' : undefined}
                          aria-describedby={errors.category ? 'reg-category-error' : undefined}
                          {...register('category')}
                        >
                          <option value="">{t('selectCategory')}</option>
                          <option value="Finanční poradce">Finanční poradce</option>
                          <option value="Realitní makléř">Realitní makléř</option>
                        </select>
                        {errors.category && (
                          <p id="reg-category-error" className="text-sm text-red-500" role="alert">{tValidation(errors.category.message as Parameters<typeof tValidation>[0])}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="reg-location" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('location')} <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="reg-location"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-invalid={errors.location ? 'true' : undefined}
                          aria-describedby={errors.location ? 'reg-location-error' : undefined}
                          {...register('location')}
                        >
                          <option value="">{t('selectLocation')}</option>
                          <option value="Praha">Praha</option>
                          <option value="Brno">Brno</option>
                          <option value="Ostrava">Ostrava</option>
                          <option value="Plzeň">Plzeň</option>
                        </select>
                        {errors.location && (
                          <p id="reg-location-error" className="text-sm text-red-500" role="alert">{tValidation(errors.location.message as Parameters<typeof tValidation>[0])}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-experience" className="mb-1 block text-sm font-medium text-gray-700">
                        {t('experience')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-experience"
                        type="number"
                        min="0"
                        placeholder={t('experiencePlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.yearsExperience ? 'true' : undefined}
                        aria-describedby={errors.yearsExperience ? 'reg-experience-error' : undefined}
                        {...register('yearsExperience')}
                      />
                      {errors.yearsExperience && (
                        <p id="reg-experience-error" className="text-sm text-red-500" role="alert">{tValidation(errors.yearsExperience.message as Parameters<typeof tValidation>[0])}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reg-bio" className="mb-1 block text-sm font-medium text-gray-700">
                        {t('bio')} <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="reg-bio"
                        rows={4}
                        placeholder={t('bioPlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.bio ? 'true' : undefined}
                        aria-describedby={errors.bio ? 'reg-bio-error' : undefined}
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p id="reg-bio-error" className="text-sm text-red-500" role="alert">{tValidation(errors.bio.message as Parameters<typeof tValidation>[0])}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="border-t pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('passwordSetup')}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-700">
                        {t('password')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.password ? 'true' : undefined}
                        aria-describedby={errors.password ? 'reg-password-error' : undefined}
                        {...register('password')}
                      />
                      {errors.password && (
                        <p id="reg-password-error" className="text-sm text-red-500" role="alert">{tValidation(errors.password.message as Parameters<typeof tValidation>[0])}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="reg-confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
                        {t('confirmPassword')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-confirm-password"
                        type="password"
                        placeholder={t('confirmPasswordPlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-invalid={errors.confirmPassword ? 'true' : undefined}
                        aria-describedby={errors.confirmPassword ? 'reg-confirm-password-error' : undefined}
                        {...register('confirmPassword')}
                      />
                      {errors.confirmPassword && (
                        <p id="reg-confirm-password-error" className="text-sm text-red-500" role="alert">{tValidation(errors.confirmPassword.message as Parameters<typeof tValidation>[0])}</p>
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
                        {t('termsAgree')}{' '}
                        <Link href="/pravidla" className="text-blue-600 hover:underline">
                          {t('termsLink')}
                        </Link>{' '}
                        *
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-sm text-red-500">{tValidation(errors.termsAccepted.message as Parameters<typeof tValidation>[0])}</p>
                    )}
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                        {...register('gdprAccepted')}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {t('gdprAgree')}{' '}
                        <Link href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                          {t('gdprLink')}
                        </Link>{' '}
                        *
                      </span>
                    </label>
                    {errors.gdprAccepted && (
                      <p className="text-sm text-red-500">{tValidation(errors.gdprAccepted.message as Parameters<typeof tValidation>[0])}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </button>

                <p className="text-center text-sm text-gray-600">
                  {t('haveAccount')}{' '}
                  <Link href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                    {t('loginHere')}
                  </Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

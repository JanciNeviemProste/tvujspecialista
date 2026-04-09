'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/utils/error';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { StaggerGrid, StaggerItem } from '@/components/shared/StaggerGrid';
import { RatingStars } from '@/components/shared/RatingStars';
import {
  TrendingUp,
  UserCheck,
  Star,
  LayoutDashboard,
  GraduationCap,
  Users,
  UserPlus,
  Edit,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Shield,
  CreditCard,
} from 'lucide-react';

import { EditableText } from '@/components/editor/EditableText';
// ─── Zod schema (simplified — professional info filled after registration) ────
const registrationSchema = z
  .object({
    name: z.string().min(1, 'nameRequired'),
    email: z.string().min(1, 'emailRequired').email('emailInvalid'),
    phone: z.string().min(1, 'phoneRequired'),
    password: z.string().min(8, 'passwordMinLength'),
    confirmPassword: z.string().min(1, 'confirmPasswordRequired'),
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

// ─── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-left text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-blue-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {answer}
        </p>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function RegistrationPage() {
  const t = useTranslations('auth.register');
  const tValidation = useTranslations('common.validation');
  const tL = useTranslations('auth.register.landing');
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [error, setError] = useState('');

  // UI state
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [liveNotifIndex, setLiveNotifIndex] = useState(0);

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

  // Scroll-based floating CTA
  useEffect(() => {
    const handleScroll = () => setShowFloatingCta(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating live notification
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNotifIndex(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Submit
  const onSubmit = async (data: RegistrationFormData) => {
    setError('');
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        locale,
      });

      toast.success(t('successToast'));
      await login({ email: data.email, password: data.password });
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  // ─── Data ──────────────────────────────────────────────────────────────────
  const painPoints = [
    { emoji: '🔍', stat: tL('pain1Stat'), title: tL('pain1Title'), desc: tL('pain1Desc') },
    { emoji: '⏱️', stat: tL('pain2Stat'), title: tL('pain2Title'), desc: tL('pain2Desc') },
    { emoji: '⭐', stat: tL('pain3Stat'), title: tL('pain3Title'), desc: tL('pain3Desc') },
    { emoji: '💰', stat: tL('pain4Stat'), title: tL('pain4Title'), desc: tL('pain4Desc') },
  ];

  const benefits = [
    { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950', title: tL('benefit1Title'), desc: tL('benefit1Desc') },
    { icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950', title: tL('benefit2Title'), desc: tL('benefit2Desc') },
    { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950', title: tL('benefit3Title'), desc: tL('benefit3Desc') },
    { icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950', title: tL('benefit4Title'), desc: tL('benefit4Desc') },
    { icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950', title: tL('benefit5Title'), desc: tL('benefit5Desc') },
    { icon: Users, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950', title: tL('benefit6Title'), desc: tL('benefit6Desc') },
  ];

  const testimonials = [
    { initials: 'MK', avatarBg: 'bg-blue-500', name: tL('testimonial1Name'), role: tL('testimonial1Role'), city: tL('testimonial1City'), quote: tL('testimonial1Quote') },
    { initials: 'PN', avatarBg: 'bg-rose-500', name: tL('testimonial2Name'), role: tL('testimonial2Role'), city: tL('testimonial2City'), quote: tL('testimonial2Quote') },
    { initials: 'TV', avatarBg: 'bg-green-500', name: tL('testimonial3Name'), role: tL('testimonial3Role'), city: tL('testimonial3City'), quote: tL('testimonial3Quote') },
  ];

  const statsData = [
    { target: tL('stat1Value'), label: tL('stat1Label') },
    { target: tL('stat2Value'), label: tL('stat2Label') },
    { target: tL('stat3Value'), label: tL('stat3Label') },
    { target: tL('stat4Value'), label: tL('stat4Label') },
  ];

  const faqItems = [
    { q: tL('faq1Q'), a: tL('faq1A') },
    { q: tL('faq2Q'), a: tL('faq2A') },
    { q: tL('faq3Q'), a: tL('faq3A') },
    { q: tL('faq4Q'), a: tL('faq4A') },
    { q: tL('faq5Q'), a: tL('faq5A') },
    { q: tL('faq6Q'), a: tL('faq6A') },
    { q: tL('faq7Q'), a: tL('faq7A') },
    { q: tL('faq8Q'), a: tL('faq8A') },
  ];

  const liveNotifications = [tL('liveNotification1'), tL('liveNotification2'), tL('liveNotification3')];

  const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors';
  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300';
  const errorClass = 'mt-1 text-xs text-red-500';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24 md:py-32 lg:min-h-[90vh] flex items-center">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left — text content */}
            <ScrollReveal>
              <div className="text-center lg:text-left">
                {/* Urgency badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-400/30 px-5 py-2 text-sm font-semibold text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <EditableText tKey="auth.register.landing.urgencyBadge">{tL('urgencyBadge')}</EditableText>
                </div>

                {/* Urgency offer */}
                <div className="mb-6">
                  <span className="inline-block rounded-full bg-amber-500/20 border border-amber-400/30 px-4 py-1.5 text-xs font-semibold text-amber-300">
                    <EditableText tKey="auth.register.landing.urgencyOffer">{tL('urgencyOffer')}</EditableText>
                  </span>
                </div>

                {/* H1 */}
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                  <EditableText tKey="auth.register.landing.heroTitle">{tL('heroTitle')}</EditableText>
                </h1>

                <p className="mb-10 max-w-2xl text-lg text-blue-100 md:text-xl leading-relaxed lg:mx-0 mx-auto">
                  <EditableText tKey="auth.register.landing.heroSubtitle">{tL('heroSubtitle')}</EditableText>
                </p>

                {/* CTA */}
                <a
                  href="#registrace"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-400/40 hover:-translate-y-0.5"
                >
                  <EditableText tKey="auth.register.landing.heroCta">{tL('heroCta')}</EditableText>
                  <ArrowRight className="h-5 w-5" />
                </a>

                <p className="mt-4 text-sm text-blue-300">
                  <EditableText tKey="auth.register.landing.heroCtaSubtext">{tL('heroCtaSubtext')}</EditableText>
                </p>

                {/* Stats row */}
                <div className="mt-12 grid grid-cols-3 gap-4">
                  {statsData.slice(0, 3).map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-4 text-center"
                    >
                      <p className="text-2xl font-extrabold text-white md:text-3xl">{s.target}</p>
                      <p className="mt-1 text-xs text-blue-200 md:text-sm">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right — phone mockup with HTML profile */}
            <ScrollReveal delay={0.3}>
              <div className="relative mx-auto w-64 sm:w-72 lg:w-80">
                {/* Phone frame */}
                <div className="relative overflow-hidden rounded-[2.5rem] ring-[8px] ring-gray-800 shadow-2xl shadow-black/40 bg-white">
                  {/* Notch — Dynamic Island */}
                  <div className="absolute top-2 left-1/2 z-10 h-[22px] w-24 -translate-x-1/2 rounded-full bg-black" />
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[10px] font-semibold text-gray-800">
                    <span>9:41</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </span>
                  </div>

                  {/* App content — profile page */}
                  <div className="px-5 pt-2 pb-8">
                    {/* Mini header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold text-blue-600">tvujspecialista.cz</span>
                      <div className="flex gap-2">
                        <div className="h-5 w-5 rounded-full bg-gray-100" />
                        <div className="h-5 w-5 rounded-full bg-gray-100" />
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="flex gap-3 mb-4">
                      <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">
                        MD
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">Martin Dvořák</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">Ověřený</span>
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">Top</span>
                        </div>
                        <p className="mt-1 text-[10px] text-gray-500">Finanční poradce · Praha</p>
                        <div className="mt-0.5 flex items-center gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <svg key={i} className={`h-2.5 w-2.5 ${i <= 4 ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                          <span className="text-[9px] text-gray-400 ml-0.5">4.8 (63)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio preview */}
                    <div className="mb-4">
                      <p className="text-[10px] font-semibold text-gray-800 mb-1">O mně</p>
                      <div className="space-y-1">
                        <div className="h-2 rounded bg-gray-100 w-full" />
                        <div className="h-2 rounded bg-gray-100 w-11/12" />
                        <div className="h-2 rounded bg-gray-100 w-4/5" />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="rounded-lg bg-blue-50 p-2 text-center">
                        <p className="text-xs font-bold text-blue-600">12</p>
                        <p className="text-[8px] text-gray-500">let praxe</p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-2 text-center">
                        <p className="text-xs font-bold text-green-600">63</p>
                        <p className="text-[8px] text-gray-500">recenzí</p>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-2 text-center">
                        <p className="text-xs font-bold text-amber-600">98%</p>
                        <p className="text-[8px] text-gray-500">spokojeno</p>
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="rounded-lg bg-blue-600 py-2.5 text-center">
                      <span className="text-[11px] font-semibold text-white">Kontaktovat specialistu</span>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-gray-300" />
                </div>
                {/* Glow effect */}
                <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION NEW — SOCIAL PROOF BAR
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              <EditableText tKey="auth.register.landing.socialProofBarText">{tL('socialProofBarText')}</EditableText>
            </span>
            <span className="hidden text-gray-300 dark:text-gray-600 sm:block">&bull;</span>
            <div className="flex items-center gap-2">
              <RatingStars rating={4.8} size="sm" showCount={false} />
              <span className="text-sm text-gray-600 dark:text-gray-400"><EditableText tKey="auth.register.landing.socialProofRating">{tL('socialProofRating')}</EditableText></span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 2 — PROBLÉM (pain points)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-orange-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.problemTitle">{tL('problemTitle')}</EditableText>
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                <EditableText tKey="auth.register.landing.problemSubtitle">{tL('problemSubtitle')}</EditableText>
              </p>
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {painPoints.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-5 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border-l-4 border-red-400">
                  <span className="text-3xl leading-none mt-1" aria-hidden="true">
                    {p.emoji}
                  </span>
                  <div>
                    <p className="text-xl font-extrabold text-red-500">{p.stat}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <ScrollReveal delay={0.4}>
            <p className="mt-10 text-center text-sm italic text-gray-400 dark:text-gray-500">
              <EditableText tKey="auth.register.landing.problemFooter">{tL('problemFooter')}</EditableText>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION NEW — BEFORE/AFTER
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.beforeAfterTitle">{tL('beforeAfterTitle')}</EditableText>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
              {/* LEFT — BEFORE (red/gray) */}
              <div className="bg-red-50 dark:bg-red-950/30 p-8 border-r border-red-200 dark:border-red-800">
                <h3 className="font-bold text-red-600 dark:text-red-400 mb-6 text-center flex items-center justify-center gap-2">
                  <span>❌</span> <EditableText tKey="auth.register.landing.beforeTitle">{tL('beforeTitle')}</EditableText>
                </h3>
                <ul className="space-y-3">
                  {[tL('before1'), tL('before2'), tL('before3'), tL('before4'), tL('before5')].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* RIGHT — AFTER (green/blue) */}
              <div className="bg-green-50 dark:bg-green-950/30 p-8">
                <h3 className="font-bold text-green-600 dark:text-green-400 mb-6 text-center flex items-center justify-center gap-2">
                  <span>✅</span> <EditableText tKey="auth.register.landing.afterTitle">{tL('afterTitle')}</EditableText>
                </h3>
                <ul className="space-y-3">
                  {[tL('after1'), tL('after2'), tL('after3'), tL('after4'), tL('after5')].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* CTA after before/after */}
            <div className="text-center mt-8">
              <a href="#registrace" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-bold text-white transition-colors">
                <EditableText tKey="auth.register.landing.heroCta">{tL('heroCta')}</EditableText> <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 3 — ŘEŠENÍ (benefits)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.solutionTitle">{tL('solutionTitle')}</EditableText>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-shadow h-full">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${b.bg}`}>
                    <b.icon className={`h-6 w-6 ${b.color}`} />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{b.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Feature screenshots */}
          <ScrollReveal delay={0.2}>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* CRM screenshot */}
              <div className="group">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-transform group-hover:-translate-y-1">
                  <div className="h-8 bg-gray-800 flex items-center gap-1.5 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <Image
                      src="/images/landing/crm.png"
                      alt={tL('altCrmScreenshot')}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="auth.register.landing.benefit4Title">{tL('benefit4Title')}</EditableText></p>
              </div>

              {/* Academy screenshot */}
              <div className="group">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-transform group-hover:-translate-y-1">
                  <div className="h-8 bg-gray-800 flex items-center gap-1.5 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <Image
                      src="/images/landing/academy.png"
                      alt={tL('altAcademyScreenshot')}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400"><EditableText tKey="auth.register.landing.benefit5Title">{tL('benefit5Title')}</EditableText></p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 4 — DŮKAZ (social proof)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-blue-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.proofTitle">{tL('proofTitle')}</EditableText>
              </h2>
            </div>
          </ScrollReveal>

          {/* Animated stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-16">
              {statsData.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    <AnimatedCounter target={s.target} />
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Testimonials */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((tm, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-7 shadow-sm h-full flex flex-col">
                  <div className="mb-4">
                    <RatingStars rating={5} size="sm" showCount={false} />
                  </div>
                  <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                    &ldquo;{tm.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tm.avatarBg} text-sm font-bold text-white`}
                    >
                      {tm.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {tm.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {tm.role} &bull; {tm.city}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 5 — JAK TO FUNGUJE (3 steps)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.stepsTitle">{tL('stepsTitle')}</EditableText>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                num: '01',
                icon: UserPlus,
                label: tL('step1Label'),
                title: tL('step1Title'),
                desc: tL('step1Desc'),
              },
              {
                num: '02',
                icon: Edit,
                label: tL('step2Label'),
                title: tL('step2Title'),
                desc: tL('step2Desc'),
              },
              {
                num: '03',
                icon: TrendingUp,
                label: tL('step3Label'),
                title: tL('step3Title'),
                desc: tL('step3Desc'),
              },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="mb-1 text-xs font-bold tracking-widest text-blue-500 uppercase">
                    {s.label} {s.num}
                  </p>
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION NEW — GARANCE
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-green-50 dark:bg-green-950/20">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-6">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              <EditableText tKey="auth.register.landing.guaranteeTitle">{tL('guaranteeTitle')}</EditableText>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10">
              <EditableText tKey="auth.register.landing.guaranteeSubtitle">{tL('guaranteeSubtitle')}</EditableText>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[tL('guarantee1'), tL('guarantee2'), tL('guarantee3'), tL('guarantee4')].map((g, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 px-5 py-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.faqTitle">{tL('faqTitle')}</EditableText>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-700 px-6">
              {faqItems.map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 7 — ZÁVĚREČNÉ CTA
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <ScrollReveal>
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl leading-tight">
              <EditableText tKey="auth.register.landing.finalCtaTitle">{tL('finalCtaTitle')}</EditableText>
            </h2>
            <p className="mb-10 text-xl text-blue-200">
              <EditableText tKey="auth.register.landing.finalCtaSubtitle">{tL('finalCtaSubtitle')}</EditableText>
            </p>

            <a
              href="#registrace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              <EditableText tKey="auth.register.landing.finalCtaButton">{tL('finalCtaButton')}</EditableText>
              <ArrowRight className="h-5 w-5" />
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-300">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> <EditableText tKey="auth.register.landing.trustNoCommitment">{tL('trustNoCommitment')}</EditableText>
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" /> <EditableText tKey="auth.register.landing.trustNoCreditCard">{tL('trustNoCreditCard')}</EditableText>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> <EditableText tKey="auth.register.landing.trustFreeForever">{tL('trustFreeForever')}</EditableText>
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 8 — REGISTRAČNÍ FORMULÁŘ
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="registrace" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                <EditableText tKey="auth.register.landing.formTitle">{tL('formTitle')}</EditableText>
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                <EditableText tKey="auth.register.landing.formSubtitle">{tL('formSubtitle')}</EditableText>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">

              {/* Tab switcher */}
              <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <Link
                  href="/profi/prihlaseni"
                  className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
                >
                  <EditableText tKey="auth.register.tabLogin">{t('tabLogin')}</EditableText>
                </Link>
                <span className="flex-1 rounded-md bg-white dark:bg-gray-600 py-2.5 text-center text-sm font-medium text-gray-900 dark:text-white shadow-sm">
                  <EditableText tKey="auth.register.tabRegister">{t('tabRegister')}</EditableText>
                </span>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3"
                  role="alert"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="reg-name" className={labelClass}>
                      <EditableText tKey="auth.register.name">{t('name')}</EditableText> <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      placeholder={t('namePlaceholder')}
                      className={inputClass}
                      aria-invalid={errors.name ? 'true' : undefined}
                      aria-describedby={errors.name ? 'reg-name-error' : undefined}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p id="reg-name-error" className={errorClass} role="alert">
                        {tValidation(errors.name.message as Parameters<typeof tValidation>[0])}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-email" className={labelClass}>
                      <EditableText tKey="auth.register.email">{t('email')}</EditableText> <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      className={inputClass}
                      aria-invalid={errors.email ? 'true' : undefined}
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="reg-email-error" className={errorClass} role="alert">
                        {tValidation(errors.email.message as Parameters<typeof tValidation>[0])}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-phone" className={labelClass}>
                      <EditableText tKey="auth.register.phone">{t('phone')}</EditableText> <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder={t('phonePlaceholder')}
                      className={inputClass}
                      aria-invalid={errors.phone ? 'true' : undefined}
                      aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p id="reg-phone-error" className={errorClass} role="alert">
                        {tValidation(errors.phone.message as Parameters<typeof tValidation>[0])}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="reg-password" className={labelClass}>
                        <EditableText tKey="auth.register.password">{t('password')}</EditableText> <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        className={inputClass}
                        aria-invalid={errors.password ? 'true' : undefined}
                        aria-describedby={errors.password ? 'reg-password-error' : undefined}
                        {...register('password')}
                      />
                      {errors.password && (
                        <p id="reg-password-error" className={errorClass} role="alert">
                          {tValidation(
                            errors.password.message as Parameters<typeof tValidation>[0]
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reg-confirm-password" className={labelClass}>
                        <EditableText tKey="auth.register.confirmPassword">{t('confirmPassword')}</EditableText> <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-confirm-password"
                        type="password"
                        placeholder={t('confirmPasswordPlaceholder')}
                        className={inputClass}
                        aria-invalid={errors.confirmPassword ? 'true' : undefined}
                        aria-describedby={
                          errors.confirmPassword ? 'reg-confirm-password-error' : undefined
                        }
                        {...register('confirmPassword')}
                      />
                      {errors.confirmPassword && (
                        <p
                          id="reg-confirm-password-error"
                          className={errorClass}
                          role="alert"
                        >
                          {tValidation(
                            errors.confirmPassword.message as Parameters<typeof tValidation>[0]
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 accent-blue-600 shrink-0"
                        {...register('termsAccepted')}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <EditableText tKey="auth.register.termsAgree">{t('termsAgree')}</EditableText>{' '}
                        <Link href="/pravidla" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                          <EditableText tKey="auth.register.termsLink">{t('termsLink')}</EditableText>
                        </Link>{' '}
                        <span aria-hidden="true">*</span>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className={errorClass}>
                        {tValidation(
                          errors.termsAccepted.message as Parameters<typeof tValidation>[0]
                        )}
                      </p>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 accent-blue-600 shrink-0"
                        {...register('gdprAccepted')}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <EditableText tKey="auth.register.gdprAgree">{t('gdprAgree')}</EditableText>{' '}
                        <Link
                          href="/ochrana-osobnich-udaju"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EditableText tKey="auth.register.gdprLink">{t('gdprLink')}</EditableText>
                        </Link>{' '}
                        <span aria-hidden="true">*</span>
                      </span>
                    </label>
                    {errors.gdprAccepted && (
                      <p className={errorClass}>
                        {tValidation(
                          errors.gdprAccepted.message as Parameters<typeof tValidation>[0]
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? t('submitting') : t('submit')}
                    {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  <EditableText tKey="auth.register.haveAccount">{t('haveAccount')}</EditableText>{' '}
                  <Link href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                    <EditableText tKey="auth.register.loginHere">{t('loginHere')}</EditableText>
                  </Link>
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FLOATING MOBILE CTA */}
      {showFloatingCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg">
          <a
            href="#registrace"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-bold text-white transition-colors"
          >
            <EditableText tKey="auth.register.landing.floatingCta">{tL('floatingCta')}</EditableText> <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-1.5 text-center text-xs text-gray-400"><EditableText tKey="auth.register.landing.floatingCtaTrust">{tL('floatingCtaTrust')}</EditableText></p>
        </div>
      )}

      {/* LIVE NOTIFICATION */}
      <div className="hidden lg:block fixed bottom-6 left-6 z-30 max-w-xs">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">{liveNotifications[liveNotifIndex]}</p>
        </div>
      </div>

    </div>
  );
}

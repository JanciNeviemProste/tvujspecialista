'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils/error';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  X,
  Eye,
  EyeOff,
  Terminal,
  Zap,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const schema = z
  .object({
    name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
    email: z.string().email('Neplatný email'),
    phone: z.string().min(9, 'Neplatné telefónne číslo'),
    password: z.string().min(8, 'Heslo musí mať aspoň 8 znakov'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s podmienkami'),
    gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Heslá sa nezhodujú',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pw) return { score: 0, label: '----' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ['weak', 'weak', 'fair', 'good', 'strong'];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-v2-mono), ui-monospace, SFMono-Regular, Menlo, monospace',
};
const SANS: React.CSSProperties = {
  fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif',
};

export function RegistraceV2() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      gdprAccepted: false,
    },
  });

  const pw = watch('password') || '';
  const strength = passwordStrength(pw);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      await login({ email: data.email, password: data.password });
      toast.success('Deployed. Presmerovanie do dashboardu…');
      router.push('/profi/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  const fieldStatus = (name: keyof FormData) => {
    if (errors[name]) return 'error' as const;
    if ((touchedFields[name] || dirtyFields[name]) && !errors[name]) return 'valid' as const;
    return 'idle' as const;
  };

  const StatusTag = ({ status, message }: { status: 'idle' | 'valid' | 'error'; message?: string }) => {
    if (status === 'idle') return null;
    if (status === 'valid')
      return (
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-500" style={MONO}>
          <Check className="h-3 w-3" strokeWidth={3} />
          ok · valid
        </span>
      );
    return (
      <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-red-500" style={MONO}>
        <X className="h-3 w-3" strokeWidth={3} />
        err · {message}
      </span>
    );
  };

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

  return (
    <div
      data-theme="v2"
      className="min-h-screen bg-background text-foreground"
      style={SANS}
    >
      {/* Grid bg + spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.10),transparent_60%)]" />

      {/* Sticky terminal top bar */}
      <div
        className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs"
            style={MONO}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">~/</span>
            <span className="font-semibold text-foreground">registration --new</span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] text-muted-foreground sm:flex" style={MONO}>
            <span>node v20.x</span>
            <span>·</span>
            <span>env: production</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="container mx-auto px-4 pt-16 pb-10 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground"
            style={MONO}
          >
            <Terminal className="h-3 w-3 text-emerald-500" />
            $ init specialist --profile
          </div>
          <h1
            className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Become a{' '}
            <span className="text-emerald-500">verified</span>
            <br />
            specialist.
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Dense, fast, transparent. Join the marketplace engineered for serious professionals.
          </p>
          <div
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-[11px] text-emerald-600 dark:text-emerald-400"
            style={MONO}
          >
            <Zap className="h-3 w-3" />
            Deploy your profile in 60s
          </div>
        </motion.div>

        {/* KPI grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
          style={MONO}
        >
          {[
            { label: 'SPECIALISTS', value: '2,500' },
            { label: 'LAST_MONTH', value: '+312' },
            { label: 'AVG_RATING', value: '4.9★' },
            { label: 'RESPONSE', value: '<24h' },
          ].map((s) => (
            <div key={s.label} className="bg-card p-4">
              <div className="text-[10px] font-medium tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {s.value}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FORM — code editor card */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl"
          id="registrace"
        >
          <div className="overflow-hidden rounded-md border border-border border-l-4 border-l-emerald-500 bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-20px_rgba(0,0,0,0.4)]">
            {/* Editor header */}
            <div
              className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5"
              style={MONO}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="ml-2 text-[11px] text-muted-foreground">
                  register.ts — specialist
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">utf-8 · ts</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 sm:p-8">
              {error && (
                <div
                  className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-500"
                  style={MONO}
                >
                  <span className="font-semibold">error:</span> {error}
                </div>
              )}

              {/* name */}
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground" style={MONO}>
                  <span className="text-emerald-500">//</span> full_name: string
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={inputClass}
                  placeholder="Jana Nováková"
                  aria-invalid={!!errors.name}
                />
                <StatusTag status={fieldStatus('name')} message={errors.name?.message} />
              </div>

              {/* email */}
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground" style={MONO}>
                  <span className="text-emerald-500">//</span> email: string
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={inputClass}
                  placeholder="jana@priklad.sk"
                  aria-invalid={!!errors.email}
                />
                <StatusTag status={fieldStatus('email')} message={errors.email?.message} />
              </div>

              {/* phone */}
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground" style={MONO}>
                  <span className="text-emerald-500">//</span> phone: E.164
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className={inputClass}
                  placeholder="+421 900 123 456"
                  aria-invalid={!!errors.phone}
                />
                <StatusTag status={fieldStatus('phone')} message={errors.phone?.message} />
              </div>

              {/* password */}
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground" style={MONO}>
                  <span className="text-emerald-500">//</span> password: secret
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className={inputClass + ' pr-10'}
                    placeholder="min 8 chars"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pw && (
                  <div className="mt-2 flex items-center gap-2" style={MONO}>
                    <span className="text-[11px] text-muted-foreground">strength:</span>
                    <span className="tracking-widest">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={
                            i < strength.score
                              ? strength.score >= 3
                                ? 'text-emerald-500'
                                : strength.score === 2
                                ? 'text-amber-500'
                                : 'text-red-500'
                              : 'text-border'
                          }
                        >
                          █
                        </span>
                      ))}
                    </span>
                    <span className="text-[11px] text-muted-foreground">[{strength.label}]</span>
                  </div>
                )}
                <StatusTag status={fieldStatus('password')} message={errors.password?.message} />
              </div>

              {/* confirm password */}
              <div>
                <label className="mb-1.5 block text-[11px] text-muted-foreground" style={MONO}>
                  <span className="text-emerald-500">//</span> password_confirm: secret
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={inputClass}
                  placeholder="repeat password"
                  aria-invalid={!!errors.confirmPassword}
                />
                <StatusTag
                  status={fieldStatus('confirmPassword')}
                  message={errors.confirmPassword?.message}
                />
              </div>

              {/* checkboxes */}
              <div className="space-y-2 border-t border-border pt-4" style={MONO}>
                <label className="flex cursor-pointer items-start gap-2 text-[11px] text-muted-foreground">
                  <input
                    type="checkbox"
                    {...register('termsAccepted')}
                    className="mt-0.5 h-3.5 w-3.5 rounded-sm border-border accent-emerald-500"
                  />
                  <span>
                    <span className="text-emerald-500">[x]</span> accept{' '}
                    <a href="/pravidla" className="text-emerald-500 underline">
                      terms.md
                    </a>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-[11px] text-red-500">err · {errors.termsAccepted.message}</p>
                )}
                <label className="flex cursor-pointer items-start gap-2 text-[11px] text-muted-foreground">
                  <input
                    type="checkbox"
                    {...register('gdprAccepted')}
                    className="mt-0.5 h-3.5 w-3.5 rounded-sm border-border accent-emerald-500"
                  />
                  <span>
                    <span className="text-emerald-500">[x]</span> accept{' '}
                    <a href="/ochrana-osobnich-udaju" className="text-emerald-500 underline">
                      gdpr.md
                    </a>
                  </span>
                </label>
                {errors.gdprAccepted && (
                  <p className="text-[11px] text-red-500">err · {errors.gdprAccepted.message}</p>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_10px_30px_-10px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:opacity-60"
                style={MONO}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-pulse">▊</span>
                    deploying...
                  </>
                ) : (
                  <>
                    $ deploy --profile
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-muted-foreground" style={MONO}>
                exit code 0 on success · redirect → /profi/dashboard
              </p>
            </form>
          </div>

          {/* Terminal feature list */}
          <div
            className="mt-8 overflow-hidden rounded-md border border-border bg-card"
            style={MONO}
          >
            {[
              { k: 'verified', v: 'ID + certificate verification included' },
              { k: 'free', v: 'Zero hidden fees · no credit card required' },
              { k: 'matching', v: 'Smart algorithm pairs you with real clients' },
            ].map((row, i, arr) => (
              <div
                key={row.k}
                className={
                  'flex items-start gap-3 px-4 py-3 text-[12px] ' +
                  (i < arr.length - 1 ? 'border-b border-border' : '')
                }
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                <div>
                  <span className="text-emerald-500">{row.k}</span>
                  <span className="text-muted-foreground"> · {row.v}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-[11px] text-emerald-500"
              style={MONO}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              slots filling · 312 joined last month
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
              Ship your profile{' '}
              <span className="text-emerald-500">today.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              No commitments. No credit card. Real leads within days.
            </p>
            <a
              href="#registrace"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
              style={MONO}
            >
              $ deploy --profile
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

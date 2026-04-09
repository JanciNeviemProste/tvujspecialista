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
  Eye,
  EyeOff,
  Zap,
  TrendingUp,
  Star,
  Clock,
  Flame,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MONO = 'var(--font-v4-mono), ui-monospace, monospace';
const SANS = 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif';

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
  if (!pw) return { score: 0, label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ['', 'SLABÉ', 'STREDNÉ', 'DOBRÉ', 'SILNÉ'];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

const STATS = [
  { value: '2 500', suffix: '+', label: 'ŠPECIALISTOV' },
  { value: '15K', suffix: '+', label: 'RECENZIÍ' },
  { value: '4.9', suffix: '★', label: 'HODNOTENIE' },
  { value: '<24', suffix: 'H', label: 'ODPOVEĎ' },
];

const BENEFITS = [
  {
    num: '01',
    label: 'KVALIFIKOVANÉ LEADY',
    title: 'ZARÁBAJ VIAC. OD PRVÉHO DŇA.',
    desc: '10–15 kvalifikovaných leadov mesačne. Žiadny cold calling. Žiadne fake kontakty. Len ľudia, ktorí ťa potrebujú.',
    icon: TrendingUp,
    violet: true,
  },
  {
    num: '02',
    label: 'REÁLNE RECENZIE',
    title: 'BUDUJ REPUTÁCIU. NA OCEĽ.',
    desc: 'Iba overení klienti hodnotia. Žiadne fake reviews, žiadna konkurencia. Tvoja reputácia = tvoj biznis.',
    icon: Star,
    violet: false,
  },
  {
    num: '03',
    label: '90 SEKÚND SETUP',
    title: 'REGISTRUJ SA. TERAZ.',
    desc: 'Meno, email, heslo — a si vnútri. Detaily doplníš v dashboarde. Bez kreditky, bez záväzkov.',
    icon: Zap,
    violet: true,
  },
];

const TESTIMONIALS = [
  {
    quote: 'Za prvý mesiac 12 kontaktov, 4 hypotéky. Game over.',
    name: 'PETRA S.',
    role: 'FIN. PORADKYŇA · BRNO',
    violet: true,
  },
  {
    quote: 'Najlepšia investícia do môjho biznisu za posledné roky.',
    name: 'MARTIN K.',
    role: 'REALITNÝ MAKLÉR · PRAHA',
    violet: false,
  },
  {
    quote: 'Konečne platforma, ktorá funguje. Klienti sami prichádzajú.',
    name: 'JANA N.',
    role: 'HYPO. PORADKYŇA · KE',
    violet: true,
  },
];

export function RegistraceV4() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
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
      toast.success('VITAJ! PRESMEROVÁVAME ŤA.');
      router.push('/profi/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      data-theme="v4"
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
      style={{ fontFamily: SANS }}
    >
      {/* ============ 1. DIAGONAL LIME MARQUEE STRIP ============ */}
      <div className="relative pt-12">
        <div className="pointer-events-none absolute left-0 right-0 top-16 -rotate-2 overflow-hidden whitespace-nowrap border-y-4 border-foreground bg-accent">
          <div
            className="flex items-center gap-8 py-4 px-6 text-sm font-black uppercase tracking-wider text-accent-foreground animate-marquee-slow"
            style={{ fontFamily: MONO }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                ★ LIMITED · 2 500+ ŠPECIALISTOV · ZDARMA · ZARÁBAJTE TERAZ ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ 2. OVERSIZED HERO ============ */}
      <section className="relative px-6 pt-40 pb-16 lg:px-12 lg:pt-48">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border-4 border-foreground bg-accent px-5 py-2 text-xs font-black uppercase tracking-wider text-accent-foreground shadow-[4px_4px_0_hsl(var(--foreground))]"
            style={{ fontFamily: MONO }}
          >
            <Flame className="h-4 w-4" strokeWidth={3} />
            REGISTRÁCIA · OTVORENÁ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
            className="font-black leading-[0.85] tracking-[-0.05em] text-foreground"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)' }}
          >
            <span className="inline-block rounded-3xl bg-primary px-6 py-2 text-primary-foreground">
              ZARÁBAJ
            </span>
            <br />
            UŽ.
            <span className="ml-4 inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-3xl bg-accent border-4 border-foreground">
              <ArrowRight className="h-[55%] w-[55%] text-accent-foreground" strokeWidth={4} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
            className="mt-10 max-w-2xl text-xl leading-relaxed text-muted-foreground lg:text-2xl"
          >
            Najrýchlejšie rastúci marketplace finančných a realitných
            poradcov v ČR a SR. Kvalifikované leady. Nula skrytých poplatkov.
            <span className="font-black text-foreground"> Registruj sa za 90 sekúnd.</span>
          </motion.p>
        </div>
      </section>

      {/* ============ 3. STAT BLOCKS ============ */}
      <section className="px-6 pb-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className={`relative overflow-hidden rounded-3xl border-4 border-foreground p-6 shadow-[8px_8px_0_hsl(var(--foreground))] ${
                  i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}
              >
                <div
                  className="text-xs font-black uppercase tracking-wider opacity-80"
                  style={{ fontFamily: MONO }}
                >
                  / {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-4 text-5xl font-black leading-none tracking-tight lg:text-6xl">
                  {stat.value}
                  <span className="opacity-70">{stat.suffix}</span>
                </div>
                <div
                  className="mt-3 text-xs font-black uppercase tracking-wider"
                  style={{ fontFamily: MONO }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. BENEFIT CARDS ============ */}
      <section className="border-y-4 border-foreground bg-secondary/30 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-14 text-5xl font-black leading-[0.9] tracking-tight text-foreground lg:text-7xl"
          >
            PREČO MY?<br />
            <span className="text-muted-foreground">TOTO JE PREČO.</span>
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className={`group relative overflow-hidden rounded-3xl border-4 border-foreground p-8 shadow-[8px_8px_0_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_hsl(var(--foreground))] ${
                  b.violet ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                }`}
              >
                <div
                  className="text-xs font-black uppercase tracking-wider opacity-70"
                  style={{ fontFamily: MONO }}
                >
                  {b.num} / BENEFIT
                </div>
                <div
                  className={`mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-foreground ${
                    b.violet ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <b.icon className="h-6 w-6" strokeWidth={3} />
                </div>
                <h3 className="mt-6 text-3xl font-black leading-[0.95] tracking-tight">
                  {b.title}
                </h3>
                <p className={`mt-4 text-base leading-relaxed ${b.violet ? 'opacity-90' : 'text-muted-foreground'}`}>
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. REGISTRATION FORM ============ */}
      <section id="registrace" className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border-4 border-foreground bg-card p-8 shadow-[12px_12px_0_hsl(var(--foreground))] lg:p-12"
          >
            {/* Form header */}
            <div
              className="mb-2 text-xs font-black uppercase tracking-wider text-primary"
              style={{ fontFamily: MONO }}
            >
              / REGISTRÁCIA
            </div>
            <h2 className="text-5xl font-black leading-[0.9] tracking-tight text-foreground lg:text-6xl">
              VYTVOR ÚČET.<br />
              <span className="inline-block rounded-2xl bg-accent px-4 py-1 text-accent-foreground border-4 border-foreground">
                TERAZ.
              </span>
            </h2>
            <p
              className="mt-4 text-sm font-bold uppercase tracking-wider text-muted-foreground"
              style={{ fontFamily: MONO }}
            >
              ~ 90 SEKÚND · ZDARMA · BEZ KREDITKY ~
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border-4 border-destructive bg-destructive/10 p-4 text-sm font-bold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              {/* Name */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                  style={{ fontFamily: MONO }}
                >
                  → MENO
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full rounded-2xl border-4 border-foreground bg-background px-5 py-4 text-base font-bold text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:border-primary"
                  placeholder="JANA NOVÁKOVÁ"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p
                    className="mt-2 text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                  style={{ fontFamily: MONO }}
                >
                  → EMAIL
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full rounded-2xl border-4 border-foreground bg-background px-5 py-4 text-base font-bold text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:border-primary"
                  placeholder="JANA@PRIKLAD.SK"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p
                    className="mt-2 text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                  style={{ fontFamily: MONO }}
                >
                  → TELEFÓN
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className="w-full rounded-2xl border-4 border-foreground bg-background px-5 py-4 text-base font-bold text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:border-primary"
                  placeholder="+421 900 123 456"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p
                    className="mt-2 text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                  style={{ fontFamily: MONO }}
                >
                  → HESLO
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className="w-full rounded-2xl border-4 border-foreground bg-background px-5 py-4 pr-14 text-base font-bold text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:border-primary"
                    placeholder="ASPOŇ 8 ZNAKOV"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-foreground bg-accent text-accent-foreground transition-transform hover:-translate-y-[calc(50%+2px)]"
                    aria-label={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={3} /> : <Eye className="h-4 w-4" strokeWidth={3} />}
                  </button>
                </div>
                {pw && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex flex-1 gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-3 flex-1 rounded-md border-2 border-foreground transition-all ${
                            i <= strength.score ? 'bg-accent' : 'bg-background'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className="text-xs font-black uppercase tracking-wider text-foreground"
                      style={{ fontFamily: MONO }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p
                    className="mt-2 text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                  style={{ fontFamily: MONO }}
                >
                  → HESLO ZNOVA
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full rounded-2xl border-4 border-foreground bg-background px-5 py-4 text-base font-bold text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-accent focus:border-primary"
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p
                    className="mt-2 text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 rounded-2xl border-4 border-foreground bg-background p-5">
                <label className="flex cursor-pointer items-start gap-3 text-sm font-bold text-foreground">
                  <input
                    type="checkbox"
                    {...register('termsAccepted')}
                    className="mt-0.5 h-5 w-5 rounded border-2 border-foreground text-primary focus:ring-2 focus:ring-accent"
                  />
                  <span>
                    SÚHLASÍM S{' '}
                    <a href="/pravidla" className="underline decoration-accent decoration-4 underline-offset-2">
                      PODMIENKAMI
                    </a>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p
                    className="text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.termsAccepted.message}
                  </p>
                )}
                <label className="flex cursor-pointer items-start gap-3 text-sm font-bold text-foreground">
                  <input
                    type="checkbox"
                    {...register('gdprAccepted')}
                    className="mt-0.5 h-5 w-5 rounded border-2 border-foreground text-primary focus:ring-2 focus:ring-accent"
                  />
                  <span>
                    SÚHLASÍM S{' '}
                    <a
                      href="/ochrana-osobnich-udaju"
                      className="underline decoration-accent decoration-4 underline-offset-2"
                    >
                      GDPR
                    </a>
                  </span>
                </label>
                {errors.gdprAccepted && (
                  <p
                    className="text-xs font-bold uppercase text-destructive"
                    style={{ fontFamily: MONO }}
                    role="alert"
                  >
                    ! {errors.gdprAccepted.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-4 border-foreground bg-primary px-8 py-6 text-2xl font-black uppercase tracking-tight text-primary-foreground shadow-[6px_6px_0_hsl(var(--accent))] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_hsl(var(--accent))] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'REGISTRUJEM...' : 'PRIDAJ SA'}
                <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" strokeWidth={4} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ============ 6. LIMITED SPOTS COUNTDOWN ============ */}
      <section className="px-6 pb-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border-4 border-foreground bg-foreground p-10 text-background shadow-[10px_10px_0_hsl(var(--accent))] lg:p-14"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-4 border-background bg-accent text-accent-foreground">
                <Clock className="h-5 w-5" strokeWidth={3} />
              </div>
              <div
                className="text-xs font-black uppercase tracking-wider text-accent"
                style={{ fontFamily: MONO }}
              >
                / LIMITED OFFER · THIS MONTH
              </div>
            </div>
            <div className="mt-6 text-5xl font-black leading-[0.9] tracking-tight lg:text-7xl">
              ONLY <span className="text-accent">47</span> SPOTS<br />
              LEFT.
            </div>
            <p
              className="mt-6 text-sm font-bold uppercase tracking-wider text-background/70"
              style={{ fontFamily: MONO }}
            >
              ~ REGISTRÁCIA SA UZAVIERA 30. 4. · NEČAKAJ ~
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 7. TESTIMONIAL BLOCKS ============ */}
      <section className="border-y-4 border-foreground bg-secondary/30 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-14 text-5xl font-black leading-[0.9] tracking-tight text-foreground lg:text-7xl"
          >
            REÁLNI ĽUDIA.<br />
            <span className="text-primary">REÁLNE VÝSLEDKY.</span>
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className={`relative overflow-hidden rounded-3xl border-4 border-foreground p-8 shadow-[8px_8px_0_hsl(var(--foreground))] ${
                  t.violet ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}
              >
                <div
                  className="absolute right-4 top-0 text-[10rem] font-black leading-none opacity-20"
                  aria-hidden
                >
                  "
                </div>
                <div className="relative">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="mt-6 text-2xl font-black leading-tight tracking-tight">
                    {t.quote}
                  </blockquote>
                  <div className="mt-8 border-t-4 border-current pt-4">
                    <div
                      className="text-sm font-black uppercase tracking-wider"
                      style={{ fontFamily: MONO }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="mt-1 text-xs font-bold uppercase tracking-wider opacity-80"
                      style={{ fontFamily: MONO }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. FINAL CTA ============ */}
      <section className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -rotate-3 border-y-4 border-foreground bg-accent">
          <div
            className="flex items-center gap-8 py-3 text-sm font-black uppercase tracking-wider text-accent-foreground animate-marquee-slow whitespace-nowrap"
            style={{ fontFamily: MONO }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                ★ START NOW · ZARÁBAJ VIAC · BEZ RIZIKA · REGISTRÁCIA ZDARMA ★
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-black leading-[0.85] tracking-[-0.04em] text-foreground"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          >
            NEČAKAJ.<br />
            <span className="inline-block rounded-3xl bg-primary px-6 py-2 text-primary-foreground border-4 border-foreground">
              ZAČNI.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <a
              href="#registrace"
              className="group inline-flex items-center gap-4 rounded-2xl border-4 border-foreground bg-foreground px-10 py-6 text-2xl font-black uppercase tracking-tight text-background shadow-[8px_8px_0_hsl(var(--accent))] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_hsl(var(--accent))] lg:text-3xl"
            >
              PRIDAJ SA TERAZ
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform group-hover:rotate-[-45deg]">
                <ArrowRight className="h-5 w-5" strokeWidth={4} />
              </div>
            </a>
            <div
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              style={{ fontFamily: MONO }}
            >
              ~ ZDARMA · BEZ KREDITKY · 90 SEKÚND ~
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

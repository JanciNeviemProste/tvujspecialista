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
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Users,
  TrendingUp,
  Clock,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

import { PremiumHeader } from '@/components/layout/PremiumHeader';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.7, ease: EASE },
  }),
};

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
  const labels = ['', 'Slabé', 'Stredné', 'Dobré', 'Silné'];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

const PARTNERS = ['OVB', 'Partner Group', '4fin', 'Broker Consulting', 'Fincentrum', 'M&M Reality'];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: '10–15 kvalifikovaných leadov mesačne',
    description: 'Priemerný špecialista PRO plánu dostáva 10-15 kontaktov zdarma každý mesiac.',
  },
  {
    icon: ShieldCheck,
    title: 'Overený profil zvyšuje dôveru',
    description: 'Profily s verifikáciou ID a certifikátmi majú 3× vyššiu mieru kontaktu.',
  },
  {
    icon: Star,
    title: 'Reálne recenzie budujú reputáciu',
    description: 'Iba overení klienti môžu hodnotiť. Žiadne fake reviews, žiadny konkurent.',
  },
  {
    icon: Clock,
    title: 'Nastavenie za 90 sekúnd',
    description: 'Meno, email, heslo — a ste vnútri. Profesné detaily doplníte v dashboarde.',
  },
];

const TESTIMONIAL = {
  quote:
    'Za prvý mesiac po registrácii som dostala 12 kontaktov a uzavrela 4 hypotéky. Rok predtým som sa bez tvojho špecialistu mohla spoľahnúť iba na odporúčania.',
  name: 'Petra Svobodová',
  role: 'Finančná poradkyňa · Brno · 8 rokov praxe',
};

const LIVE_REGISTRATIONS = [
  { name: 'Martin K.', city: 'Praha', category: 'Finančný poradca', time: 'pred 3 min' },
  { name: 'Jana S.', city: 'Bratislava', category: 'Realitný maklér', time: 'pred 12 min' },
  { name: 'Peter N.', city: 'Košice', category: 'Hypotekárny poradca', time: 'pred 28 min' },
];

export function RegistraceV1() {
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
      toast.success('Vitajte! Presmerovávame vás do dashboardu.');
      router.push('/profi/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* HERO — editorial asymmetric */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-mesh-drift" />
        <div
          className="pointer-events-none absolute -right-32 top-64 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-[120px] animate-mesh-drift"
          style={{ animationDelay: '7s' }}
        />

        <div className="container mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* LEFT — Editorial copy */}
            <div className="lg:col-span-7 lg:pr-4">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Členstvo · Prihláška
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-balance text-display-2 font-bold tracking-tight text-foreground lg:text-display-1"
              >
                Pridajte sa k{' '}
                <span className="text-serif-italic font-normal text-primary">
                  2 500+ overeným
                </span>{' '}
                špecialistom
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
              >
                Najrýchlejšie rastúci marketplace finančných a realitných poradcov v ČR a SR. Kvalifikované
                leady, reálne recenzie, nula skrytých poplatkov.
              </motion.p>

              {/* Effort anchor + trust */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
                    <Clock className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-semibold text-foreground">Zaberie ~90 sekúnd</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
                    <ShieldCheck className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-semibold text-foreground">Bez záväzkov</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
                    <CheckCircle2 className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-semibold text-foreground">Bez kreditnej karty</span>
                </div>
              </motion.div>

              {/* Live social proof feed */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-elevation-2 sm:p-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live registrácie
                  </div>
                  <div className="text-xs text-muted-foreground">posledná hodina</div>
                </div>
                <div className="space-y-3">
                  {LIVE_REGISTRATIONS.map((reg, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-bold text-white">
                        {reg.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {reg.name}{' '}
                          <span className="font-normal text-muted-foreground">sa registroval/a ako</span>{' '}
                          <span className="text-primary">{reg.category}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {reg.city} · {reg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT — Registration form card */}
            <div className="relative lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: EASE }}
                className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-elevation-5 sm:p-8"
                id="registrace"
              >
                {/* Form header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-indigo">
                    <span
                      className="text-[2rem] italic leading-none text-white"
                      style={{
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        fontWeight: 400,
                        marginTop: '-4px',
                        marginLeft: '1px',
                      }}
                    >
                      t
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Vytvoriť profil</h2>
                    <p className="text-sm text-muted-foreground">Zadarmo · 90 sekúnd · bez kreditky</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Meno a priezvisko
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="Jana Nováková"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="jana@priklad.sk"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Telefón
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      {...register('phone')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="+421 900 123 456"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password with strength */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Heslo
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                        placeholder="Aspoň 8 znakov"
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pw && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex flex-1 gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i <= strength.score
                                  ? strength.score <= 1
                                    ? 'bg-destructive'
                                    : strength.score === 2
                                    ? 'bg-amber-500'
                                    : strength.score === 3
                                    ? 'bg-emerald-400'
                                    : 'bg-emerald-500'
                                  : 'bg-border'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{strength.label}</span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Heslo znova
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2">
                    <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        {...register('termsAccepted')}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <span>
                        Súhlasím s{' '}
                        <a href="/pravidla" className="text-primary underline hover:no-underline">
                          podmienkami
                        </a>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                    <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        {...register('gdprAccepted')}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <span>
                        Súhlasím so spracovaním{' '}
                        <a
                          href="/ochrana-osobnich-udaju"
                          className="text-primary underline hover:no-underline"
                        >
                          osobných údajov
                        </a>
                      </span>
                    </label>
                    {errors.gdprAccepted && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.gdprAccepted.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-base font-semibold text-background shadow-elevation-3 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Registrujem...'
                    ) : (
                      <>
                        Vytvoriť profil zdarma
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  {/* Trust row below submit */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      SSL zabezpečené
                    </div>
                    <div>·</div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      GDPR compliant
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners trust strip */}
      <section className="border-y border-border bg-secondary/40 py-8">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Dôverujú nám špecialisti z
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="text-lg font-bold tracking-tight text-foreground/30 grayscale transition-all hover:text-foreground/60"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits bento */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prečo my
            </div>
            <h2 className="text-balance text-display-3 font-bold tracking-tight text-foreground">
              Štyri dôvody prečo sa{' '}
              <span className="text-serif-italic font-normal text-primary">oplatí registrovať</span>
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="rounded-3xl border border-border bg-card p-8 shadow-elevation-2 transition-shadow hover:shadow-elevation-4"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-indigo">
                  <b.icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured testimonial */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-10 shadow-elevation-3 sm:p-14"
          >
            <div className="mb-6 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
              <span className="text-serif-italic font-normal">„</span>
              {TESTIMONIAL.quote}
              <span className="text-serif-italic font-normal">"</span>
            </blockquote>
            <div className="mt-8 border-t border-border pt-6">
              <div className="font-bold text-foreground">{TESTIMONIAL.name}</div>
              <div className="text-sm text-muted-foreground">{TESTIMONIAL.role}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-balance text-display-2 font-bold tracking-tight text-foreground">
              Začnite{' '}
              <span className="text-serif-italic font-normal text-primary">dnes.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              Prvé kontakty už za pár dní. Žiadne záväzky, žiadne kreditky, žiadne skryté poplatky.
            </p>
            <a
              href="#registrace"
              className="group mt-12 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background shadow-elevation-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5"
            >
              Vytvoriť profil zdarma
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                2 500+ špecialistov
              </div>
              <div>·</div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                4.9 priemerné hodnotenie
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-20 z-30 mx-4 lg:hidden">
        <a
          href="#registrace"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background shadow-elevation-5"
        >
          Vytvoriť profil zdarma
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

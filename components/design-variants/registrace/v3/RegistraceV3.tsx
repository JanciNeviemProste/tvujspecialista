'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useRouter, Link } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils/error';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.9, ease: EASE },
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
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Impeccable'];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

const SERIF = 'var(--font-display-serif), Georgia, "Times New Roman", serif';
const SANS = 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif';

const CHARCOAL = '#0f0f0f';
const CREAM = '#faf6ef';
const CHAMPAGNE = '#c9a96e';

const ARTICLES = [
  {
    numeral: 'I.',
    title: 'Curated network',
    body: 'Prijímame výhradne špecialistov s overenou praxou, referenciami a kultivovaným prístupom ku klientovi. Každá prihláška prechádza rukami nášho redakčného výboru — bez výnimky, bez skratiek.',
  },
  {
    numeral: 'II.',
    title: 'Manual verification',
    body: 'Identita, certifikáty, regulačný status. Tri dni, jedna osoba, nula automatizácie. Veríme, že dôvera sa nedá naprogramovať — musí byť vybudovaná rukou a okom človeka, ktorý rozumie remeslu.',
  },
  {
    numeral: 'III.',
    title: 'Editorial standards',
    body: 'Profily píšeme spoločne. Fotografie, životopisy, príbehy — všetko prechádza úpravou našich editorov, aby vaša prezentácia pôsobila tak kultivovane, ako vaša práca zaslúži.',
  },
];

export function RegistraceV3() {
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
      toast.success('Vaša prihláška je prijatá. Vitajte.');
      router.push('/profi/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  const inputClass =
    'w-full border-0 border-b bg-transparent px-0 py-3 text-base text-[#0f0f0f] placeholder:text-[#0f0f0f]/30 transition-colors focus:outline-none focus:ring-0';

  return (
    <div
      data-theme="v3"
      className="min-h-screen"
      style={{
        fontFamily: SANS,
        backgroundColor: CREAM,
        color: CHARCOAL,
      }}
    >
      {/* MASTHEAD */}
      <header
        className="border-b"
        style={{ borderColor: `${CHARCOAL}26` }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-8 py-6">
          <div
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: `${CHARCOAL}99` }}
          >
            Vol. I · Aplikácia · Apríl 2026
          </div>
          <div
            className="text-center text-lg tracking-[0.18em]"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
          >
            TVŮJ·SPECIALISTA
          </div>
          <div
            className="text-right text-[10px] uppercase tracking-[0.3em]"
            style={{ color: `${CHARCOAL}99` }}
          >
            SK / CS / EN / PL
          </div>
        </div>
      </header>

      {/* HERO — split-screen editorial */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT — headline */}
          <div className="relative flex items-center lg:col-span-7 lg:pr-12">
            <div className="w-full px-8 py-20 lg:px-16 lg:py-32">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-10 text-[10px] uppercase"
                style={{
                  letterSpacing: '0.3em',
                  color: `${CHARCOAL}99`,
                }}
              >
                Application Form · 01
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-balance text-[clamp(2.75rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                Vstupte do
                <br />
                vybraného{' '}
                <em className="italic" style={{ color: CHAMPAGNE }}>
                  kruhu.
                </em>
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-10 max-w-md text-lg italic leading-relaxed"
                style={{ fontFamily: SERIF, color: `${CHARCOAL}CC` }}
              >
                Nie každá prihláška je prijatá. Tie, ktoré prejdú, sa stávajú
                súčasťou kruhu, ktorý sa stará o tých, ktorým záleží.
              </motion.p>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-16 flex items-center gap-4"
              >
                <div className="h-px w-12" style={{ backgroundColor: CHAMPAGNE }} />
                <a
                  href="#prihlaska"
                  className="text-[10px] uppercase"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Začať prihlášku
                </a>
              </motion.div>
            </div>
          </div>

          {/* RIGHT — portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="relative lg:col-span-5"
          >
            <div className="relative h-[60vh] lg:h-full lg:min-h-[700px]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=90"
                alt="Member portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover grayscale"
                priority
              />
              <div className="absolute bottom-10 left-8 right-8">
                <div
                  className="inline-block px-6 py-4 backdrop-blur"
                  style={{ backgroundColor: `${CREAM}F2` }}
                >
                  <div
                    className="text-[10px] uppercase"
                    style={{ letterSpacing: '0.3em', color: `${CHARCOAL}99` }}
                  >
                    Member Portrait
                  </div>
                  <div
                    className="mt-2 text-2xl"
                    style={{ fontFamily: SERIF }}
                  >
                    Eva, Praha
                  </div>
                  <div
                    className="mt-1 text-[11px] italic"
                    style={{ fontFamily: SERIF, color: `${CHARCOAL}99` }}
                  >
                    Member since 2024
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="prihlaska"
        className="border-t"
        style={{ borderColor: `${CHARCOAL}26` }}
      >
        <div className="mx-auto max-w-3xl px-8 py-24 lg:py-32">
          <div className="mb-16 text-center">
            <div
              className="mb-6 text-[10px] uppercase"
              style={{ letterSpacing: '0.3em', color: `${CHARCOAL}99` }}
            >
              The Application
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.01em]"
              style={{ fontFamily: SERIF, fontWeight: 400 }}
            >
              Formulár{' '}
              <em className="italic" style={{ color: CHAMPAGNE }}>
                prihlášky
              </em>
            </h2>
            <p
              className="mx-auto mt-6 max-w-lg text-base italic leading-relaxed"
              style={{ fontFamily: SERIF, color: `${CHARCOAL}99` }}
            >
              Vyplňte, prosím, nasledujúce polia s rovnakou starostlivosťou, s akou
              pristupujete k svojim klientom.
            </p>
          </div>

          {error && (
            <div
              className="mb-10 border px-6 py-4 text-sm"
              style={{
                borderColor: `${CHARCOAL}`,
                backgroundColor: 'transparent',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
            {/* I. Identita */}
            <div>
              <div
                className="mb-8 flex items-baseline gap-4 border-b pb-3"
                style={{ borderColor: `${CHARCOAL}26` }}
              >
                <span
                  className="text-2xl italic"
                  style={{ fontFamily: SERIF, color: CHAMPAGNE }}
                >
                  I.
                </span>
                <span
                  className="text-[11px] uppercase"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Identita
                </span>
              </div>

              <div>
                <label
                  className="mb-3 block text-[10px] uppercase"
                  style={{ letterSpacing: '0.15em', color: `${CHARCOAL}99` }}
                >
                  Meno a priezvisko
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={inputClass}
                  style={{ borderColor: `${CHARCOAL}40` }}
                  placeholder="Eva Nováková"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-2 text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* II. Kontakt */}
            <div>
              <div
                className="mb-8 flex items-baseline gap-4 border-b pb-3"
                style={{ borderColor: `${CHARCOAL}26` }}
              >
                <span
                  className="text-2xl italic"
                  style={{ fontFamily: SERIF, color: CHAMPAGNE }}
                >
                  II.
                </span>
                <span
                  className="text-[11px] uppercase"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Kontakt
                </span>
              </div>

              <div className="space-y-10">
                <div>
                  <label
                    className="mb-3 block text-[10px] uppercase"
                    style={{ letterSpacing: '0.15em', color: `${CHARCOAL}99` }}
                  >
                    Elektronická pošta
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className={inputClass}
                    style={{ borderColor: `${CHARCOAL}40` }}
                    placeholder="eva@priklad.sk"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-3 block text-[10px] uppercase"
                    style={{ letterSpacing: '0.15em', color: `${CHARCOAL}99` }}
                  >
                    Telefónne číslo
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    {...register('phone')}
                    className={inputClass}
                    style={{ borderColor: `${CHARCOAL}40` }}
                    placeholder="+421 900 123 456"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* III. Bezpečnosť */}
            <div>
              <div
                className="mb-8 flex items-baseline gap-4 border-b pb-3"
                style={{ borderColor: `${CHARCOAL}26` }}
              >
                <span
                  className="text-2xl italic"
                  style={{ fontFamily: SERIF, color: CHAMPAGNE }}
                >
                  III.
                </span>
                <span
                  className="text-[11px] uppercase"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Bezpečnosť
                </span>
              </div>

              <div className="space-y-10">
                <div>
                  <label
                    className="mb-3 block text-[10px] uppercase"
                    style={{ letterSpacing: '0.15em', color: `${CHARCOAL}99` }}
                  >
                    Heslo
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('password')}
                      className={`${inputClass} pr-8`}
                      style={{ borderColor: `${CHARCOAL}40` }}
                      placeholder="Minimálne osem znakov"
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-60 transition-opacity hover:opacity-100"
                      aria-label={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {pw && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-px flex-1 transition-all"
                            style={{
                              backgroundColor:
                                i <= strength.score ? CHAMPAGNE : `${CHARCOAL}20`,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[10px] uppercase"
                        style={{
                          letterSpacing: '0.2em',
                          color: `${CHARCOAL}99`,
                        }}
                      >
                        {strength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-2 text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-3 block text-[10px] uppercase"
                    style={{ letterSpacing: '0.15em', color: `${CHARCOAL}99` }}
                  >
                    Heslo na potvrdenie
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={inputClass}
                    style={{ borderColor: `${CHARCOAL}40` }}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-4 border-t pt-10" style={{ borderColor: `${CHARCOAL}26` }}>
              <label className="flex cursor-pointer items-start gap-3 text-[11px]" style={{ color: `${CHARCOAL}CC` }}>
                <input
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="mt-0.5 h-3 w-3 border accent-[#c9a96e]"
                  style={{ borderRadius: 0 }}
                />
                <span>
                  Súhlasím s{' '}
                  <Link href="/pravidla" className="underline underline-offset-4" style={{ color: CHARCOAL }}>
                    podmienkami členstva
                  </Link>
                  .
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                  {errors.termsAccepted.message}
                </p>
              )}
              <label className="flex cursor-pointer items-start gap-3 text-[11px]" style={{ color: `${CHARCOAL}CC` }}>
                <input
                  type="checkbox"
                  {...register('gdprAccepted')}
                  className="mt-0.5 h-3 w-3 border accent-[#c9a96e]"
                  style={{ borderRadius: 0 }}
                />
                <span>
                  Súhlasím so spracovaním{' '}
                  <Link
                    href="/ochrana-osobnich-udaju"
                    className="underline underline-offset-4"
                    style={{ color: CHARCOAL }}
                  >
                    osobných údajov
                  </Link>
                  .
                </span>
              </label>
              {errors.gdprAccepted && (
                <p className="text-xs italic" style={{ fontFamily: SERIF, color: '#8b2e2e' }}>
                  {errors.gdprAccepted.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center gap-6 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center gap-4 border px-12 py-5 text-[11px] uppercase transition-colors disabled:opacity-50"
                style={{
                  borderColor: CHARCOAL,
                  backgroundColor: 'transparent',
                  color: CHARCOAL,
                  letterSpacing: '0.25em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = CHARCOAL;
                  e.currentTarget.style.color = CREAM;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = CHARCOAL;
                }}
              >
                {isSubmitting ? 'Odosielam…' : 'Odoslať prihlášku'}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </button>
              <p
                className="max-w-md text-center text-[11px] italic leading-relaxed"
                style={{ fontFamily: SERIF, color: `${CHARCOAL}99` }}
              >
                Prihlášky kontrolujeme manuálne. Odpoveď do 48 hodín.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* 3 NUMBERED ARTICLES */}
      <section
        className="border-t"
        style={{ borderColor: `${CHARCOAL}26` }}
      >
        <div className="mx-auto max-w-6xl px-8 py-24 lg:py-32">
          <div className="mb-20 text-center">
            <div
              className="mb-6 text-[10px] uppercase"
              style={{ letterSpacing: '0.3em', color: `${CHARCOAL}99` }}
            >
              Our Principles
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.01em]"
              style={{ fontFamily: SERIF, fontWeight: 400 }}
            >
              Tri{' '}
              <em className="italic" style={{ color: CHAMPAGNE }}>
                zásady
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-12">
            {ARTICLES.map((article, i) => (
              <motion.article
                key={article.numeral}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.12, duration: 0.9, ease: EASE }}
                className="border-t pt-8"
                style={{ borderColor: `${CHARCOAL}40` }}
              >
                <div
                  className="mb-6 text-5xl italic"
                  style={{ fontFamily: SERIF, color: CHAMPAGNE }}
                >
                  {article.numeral}
                </div>
                <h3
                  className="mb-6 text-2xl leading-tight"
                  style={{ fontFamily: SERIF, fontWeight: 500 }}
                >
                  {article.title}
                </h3>
                <p
                  className="text-sm leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:italic first-letter:leading-[0.9]"
                  style={{
                    color: `${CHARCOAL}CC`,
                  }}
                >
                  <span style={{ fontFamily: SERIF }}>{article.body}</span>
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL LETTER */}
      <section
        className="border-y"
        style={{ borderColor: `${CHARCOAL}26` }}
      >
        <div className="mx-auto max-w-4xl px-8 py-24 lg:py-32">
          <div
            className="mb-10 text-center text-[10px] uppercase"
            style={{ letterSpacing: '0.3em', color: `${CHARCOAL}99` }}
          >
            A Letter from a Member
          </div>
          <blockquote
            className="text-balance text-center text-[clamp(1.5rem,3vw,2.5rem)] italic leading-[1.3]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            „Pred Tvojím špecialistom som pracovala v tichu. Dnes ma klienti
            nachádzajú skôr, než ich hľadám. Nie je to len platforma — je to
            kruh ľudí, ktorí berú toto remeslo rovnako vážne ako ja.“
          </blockquote>
          <div className="mt-16 flex flex-col items-center gap-2">
            <div
              className="text-3xl italic"
              style={{ fontFamily: SERIF, color: CHAMPAGNE }}
            >
              Eva N.
            </div>
            <div
              className="text-[10px] uppercase"
              style={{ letterSpacing: '0.25em', color: `${CHARCOAL}99` }}
            >
              Finančná poradkyňa · Praha · Member since 2024
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mb-6 text-[10px] uppercase"
            style={{ letterSpacing: '0.3em', color: `${CHARCOAL}99` }}
          >
            Apply · Vol. I
          </div>
          <h2
            className="text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Prihláste sa{' '}
            <em className="italic" style={{ color: CHAMPAGNE }}>
              dnes.
            </em>
          </h2>
          <p
            className="mx-auto mt-8 max-w-lg text-base italic leading-relaxed"
            style={{ fontFamily: SERIF, color: `${CHARCOAL}99` }}
          >
            Kruh sa rozširuje pomaly. Miesta sú obmedzené zámerne.
          </p>

          <div className="mt-14 flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ backgroundColor: CHAMPAGNE }} />
            <a
              href="#prihlaska"
              className="text-[11px] uppercase"
              style={{ letterSpacing: '0.3em' }}
            >
              Začať prihlášku
            </a>
            <div className="h-px w-16" style={{ backgroundColor: CHAMPAGNE }} />
          </div>
        </div>

        <div
          className="mx-auto mt-24 flex max-w-7xl items-center justify-between border-t pt-8 text-[10px] uppercase"
          style={{
            borderColor: `${CHARCOAL}26`,
            letterSpacing: '0.25em',
            color: `${CHARCOAL}99`,
          }}
        >
          <div>© MMXXVI</div>
          <div style={{ fontFamily: SERIF, letterSpacing: '0.15em' }}>
            Tvůj·Specialista
          </div>
          <div>Vol. I</div>
        </div>
      </section>
    </div>
  );
}

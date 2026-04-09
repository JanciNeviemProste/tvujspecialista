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
import { Eye, EyeOff } from 'lucide-react';

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

const CREAM = '#faf6ef';
const INK = '#0a0a0a';
const RUST = '#c8410b';

const SERIF = 'var(--font-display-serif), "Fraunces", Georgia, serif';
const SANS = 'var(--font-v5-sans), "Inter", system-ui, sans-serif';

const BENEFITS = [
  {
    n: '01',
    title: 'Kvalifikované leady',
    body: 'Desať až pätnásť overených kontaktov mesačne — priamo od klientov, ktorí hľadajú špecialistu vo vašom odbore a vašom meste.',
  },
  {
    n: '02',
    title: 'Overený profil',
    body: 'Verifikácia identity a profesných certifikátov. Overené profily dosahujú až trojnásobne vyššiu mieru oslovenia.',
  },
  {
    n: '03',
    title: 'Reálne recenzie',
    body: 'Hodnotiť môžu iba overení klienti. Žiadne falošné posudky, žiadne konkurenčné sabotáže, iba pravdivý obraz vašej práce.',
  },
  {
    n: '04',
    title: 'Bez záväzkov',
    body: 'Registrácia zadarmo, bez kreditnej karty, bez viazanosti. Predplatné začína až vtedy, keď sa rozhodnete.',
  },
];

export function RegistraceV5() {
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

  const fieldLabel: React.CSSProperties = {
    fontFamily: SANS,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 600,
    color: INK,
  };

  const fieldInput =
    'w-full bg-transparent border-0 border-b border-[#0a0a0a]/40 px-0 py-3 text-base text-[#0a0a0a] placeholder:text-[#0a0a0a]/30 focus:outline-none focus:border-[#c8410b] transition-colors rounded-none';

  return (
    <div
      data-theme="v5"
      className="min-h-screen"
      style={{ backgroundColor: CREAM, color: INK, fontFamily: SANS }}
    >
      {/* ============== MASTHEAD ============== */}
      <header
        className="border-y-2 border-[#0a0a0a]"
        style={{ borderColor: INK }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 grid grid-cols-3 items-center gap-4">
          <div
            className="text-[10px] uppercase"
            style={{ letterSpacing: '0.25em' }}
          >
            Vol. I &middot; No. 04 &middot; Apply
          </div>
          <div className="text-center">
            <div
              className="text-xl md:text-2xl font-normal"
              style={{ fontFamily: SERIF, letterSpacing: '0.05em' }}
            >
              TVŮJ
              <span style={{ color: RUST }}>·</span>
              SPECIALISTA
            </div>
          </div>
          <div
            className="text-right text-[10px] uppercase"
            style={{ letterSpacing: '0.25em' }}
          >
            Praha &middot; Apríl 2026
          </div>
        </div>
      </header>

      {/* ============== EYEBROW + HEADLINE ============== */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div
          className="text-[11px] uppercase mb-8"
          style={{ letterSpacing: '0.25em', color: RUST }}
        >
          — Inzerát &middot; Application
        </div>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl"
          style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Hľadáme nových{' '}
          <em
            style={{ fontStyle: 'italic', fontFamily: SERIF, color: RUST }}
          >
            špecialistov
          </em>
        </h1>
        <p
          className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}
        >
          Pre najčítanejší marketplace finančných a realitných poradcov v strednej
          Európe otvárame prijímacie konanie. Pozvaní sú profesionáli s preukázateľnou
          praxou, čistou povesťou a chuťou rásť.
        </p>
      </section>

      {/* ============== TWO COLUMN ARTICLE + DROPCAP ============== */}
      <section
        className="mx-auto max-w-6xl px-6 py-12 border-t border-[#0a0a0a]/60"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <span
              className="float-left mr-3 leading-[0.8]"
              style={{
                fontFamily: SERIF,
                fontSize: '7rem',
                fontWeight: 400,
                color: RUST,
              }}
            >
              P
            </span>
            <p
              className="text-base leading-[1.75]"
              style={{ fontFamily: SERIF }}
            >
              rečo sa prihlásiť? Pretože toto nie je ďalšia databáza mien a telefónnych
              čísel. Toto je miesto, kde sa stretáva dopyt pripravený konať s ponukou,
              ktorá si zaslúži pozornosť. Každý mesiac prichádza tisíce overených
              dopytov od klientov, ktorí vedia, čo chcú — hypotéku, investíciu, poistku,
              byt. Vy sa rozhodnete, koho oslovíte.
            </p>
          </div>
          <div>
            <p
              className="text-base leading-[1.75]"
              style={{ fontFamily: SERIF }}
            >
              Naša redakcia kontroluje každý profil manuálne. Overujeme identitu,
              certifikáty, roky praxe a referencie. Vďaka tomu si klienti môžu vyberať s
              istotou a vy pracujete v prostredí, kde sa neskrývate za anonymnými
              inzerátmi ani platenou reklamou.
            </p>
            <p
              className="mt-6 text-base leading-[1.75]"
              style={{ fontFamily: SERIF }}
            >
              Ak spĺňate naše podmienky a chcete byť súčasťou, pokračujte vyplnením
              formulára nižšie. Odpoveď prichádza do 48 hodín.
            </p>
            <p
              className="mt-8 text-sm uppercase"
              style={{ letterSpacing: '0.2em', color: RUST }}
            >
              Pokračujte vyplnením formulára nižšie ↓
            </p>
          </div>
        </div>
      </section>

      {/* ============== APPLICATION FORM ============== */}
      <section
        id="registrace"
        className="mx-auto max-w-3xl px-6 py-20 border-y-2"
        style={{ borderColor: INK }}
      >
        {/* Stamp */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-block border-2 px-6 py-3 text-center"
            style={{
              borderColor: RUST,
              color: RUST,
              transform: 'rotate(-6deg)',
              fontFamily: SANS,
              letterSpacing: '0.2em',
            }}
          >
            <div
              className="text-[10px] uppercase"
              style={{ letterSpacing: '0.3em' }}
            >
              Prihláška
            </div>
            <div
              className="text-base font-bold uppercase mt-0.5"
              style={{ letterSpacing: '0.2em' }}
            >
              Received
            </div>
          </div>
        </div>

        <h2
          className="text-4xl md:text-5xl text-center mb-2"
          style={{ fontFamily: SERIF, fontWeight: 400 }}
        >
          Prihláška N° I
        </h2>
        <p
          className="text-center text-[11px] uppercase mb-14"
          style={{ letterSpacing: '0.25em', color: INK, opacity: 0.6 }}
        >
          Vyplňte všetky polia &middot; Manual review
        </p>

        {error && (
          <div
            className="mb-8 border border-[#c8410b] p-4 text-sm"
            style={{ color: RUST }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* ---- IDENTITA ---- */}
          <div>
            <div
              className="flex items-center gap-4 mb-8 pb-2 border-b border-[#0a0a0a]"
            >
              <span
                className="text-[10px] uppercase"
                style={{ letterSpacing: '0.3em', color: RUST }}
              >
                § I
              </span>
              <span
                className="text-xs uppercase font-semibold"
                style={{ letterSpacing: '0.25em' }}
              >
                Identita
              </span>
            </div>

            <div>
              <label className="block mb-2" style={fieldLabel}>
                Meno a priezvisko
              </label>
              <input
                type="text"
                {...register('name')}
                className={fieldInput}
                placeholder="Jana Nováková"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: RUST, fontStyle: 'italic' }}
                  role="alert"
                >
                  — {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* ---- KONTAKT ---- */}
          <div>
            <div
              className="flex items-center gap-4 mb-8 pb-2 border-b border-[#0a0a0a]"
            >
              <span
                className="text-[10px] uppercase"
                style={{ letterSpacing: '0.3em', color: RUST }}
              >
                § II
              </span>
              <span
                className="text-xs uppercase font-semibold"
                style={{ letterSpacing: '0.25em' }}
              >
                Kontakt
              </span>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block mb-2" style={fieldLabel}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={fieldInput}
                  placeholder="jana@priklad.sk"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p
                    className="mt-2 text-xs"
                    style={{ color: RUST, fontStyle: 'italic' }}
                    role="alert"
                  >
                    — {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2" style={fieldLabel}>
                  Telefón
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className={fieldInput}
                  placeholder="+421 900 123 456"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p
                    className="mt-2 text-xs"
                    style={{ color: RUST, fontStyle: 'italic' }}
                    role="alert"
                  >
                    — {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---- BEZPEČNOSŤ ---- */}
          <div>
            <div
              className="flex items-center gap-4 mb-8 pb-2 border-b border-[#0a0a0a]"
            >
              <span
                className="text-[10px] uppercase"
                style={{ letterSpacing: '0.3em', color: RUST }}
              >
                § III
              </span>
              <span
                className="text-xs uppercase font-semibold"
                style={{ letterSpacing: '0.25em' }}
              >
                Bezpečnosť
              </span>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block mb-2" style={fieldLabel}>
                  Heslo
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className={fieldInput + ' pr-8'}
                    placeholder="Aspoň 8 znakov"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                    aria-label={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {pw && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-px flex-1 transition-colors"
                          style={{
                            backgroundColor:
                              i <= strength.score ? RUST : 'rgba(10,10,10,0.2)',
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[10px] uppercase"
                      style={{ letterSpacing: '0.2em', color: RUST }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p
                    className="mt-2 text-xs"
                    style={{ color: RUST, fontStyle: 'italic' }}
                    role="alert"
                  >
                    — {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2" style={fieldLabel}>
                  Heslo znova
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={fieldInput}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p
                    className="mt-2 text-xs"
                    style={{ color: RUST, fontStyle: 'italic' }}
                    role="alert"
                  >
                    — {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---- CONSENTS ---- */}
          <div className="space-y-3 pt-4 border-t border-[#0a0a0a]/40">
            <label
              className="flex cursor-pointer items-start gap-3 text-xs"
              style={{ fontFamily: SERIF }}
            >
              <input
                type="checkbox"
                {...register('termsAccepted')}
                className="mt-1 h-3 w-3 rounded-none border-[#0a0a0a] accent-[#c8410b]"
              />
              <span>
                Súhlasím s{' '}
                <a
                  href="/pravidla"
                  className="underline"
                  style={{ color: RUST }}
                >
                  podmienkami služby
                </a>
                .
              </span>
            </label>
            {errors.termsAccepted && (
              <p
                className="text-xs pl-6"
                style={{ color: RUST, fontStyle: 'italic' }}
                role="alert"
              >
                — {errors.termsAccepted.message}
              </p>
            )}
            <label
              className="flex cursor-pointer items-start gap-3 text-xs"
              style={{ fontFamily: SERIF }}
            >
              <input
                type="checkbox"
                {...register('gdprAccepted')}
                className="mt-1 h-3 w-3 rounded-none border-[#0a0a0a] accent-[#c8410b]"
              />
              <span>
                Súhlasím so spracovaním{' '}
                <a
                  href="/ochrana-osobnich-udaju"
                  className="underline"
                  style={{ color: RUST }}
                >
                  osobných údajov
                </a>
                .
              </span>
            </label>
            {errors.gdprAccepted && (
              <p
                className="text-xs pl-6"
                style={{ color: RUST, fontStyle: 'italic' }}
                role="alert"
              >
                — {errors.gdprAccepted.message}
              </p>
            )}
          </div>

          {/* ---- SUBMIT ---- */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border-2 py-5 text-sm uppercase transition-colors disabled:opacity-50 hover:bg-[#0a0a0a] hover:text-[#faf6ef]"
              style={{
                borderColor: INK,
                color: INK,
                letterSpacing: '0.25em',
                fontWeight: 600,
                fontFamily: SANS,
                borderRadius: 0,
              }}
            >
              {isSubmitting ? 'Odosielam…' : 'Odoslať prihlášku →'}
            </button>
            <p
              className="mt-4 text-center text-[10px] uppercase opacity-60"
              style={{ letterSpacing: '0.25em' }}
            >
              Odpoveď do 48 hodín &middot; SSL &middot; GDPR
            </p>
          </div>
        </form>
      </section>

      {/* ============== INDEX OF BENEFITS ============== */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div
          className="text-[11px] uppercase mb-12"
          style={{ letterSpacing: '0.25em', color: RUST }}
        >
          — Index &middot; Prečo sa prihlásiť
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {BENEFITS.map((b) => (
            <div
              key={b.n}
              className="pt-6 border-t-2"
              style={{ borderColor: INK }}
            >
              <div className="flex items-baseline gap-6">
                <span
                  className="text-sm"
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    color: RUST,
                    letterSpacing: '0.1em',
                  }}
                >
                  N° {b.n}
                </span>
                <h3
                  className="text-3xl md:text-4xl flex-1"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {b.title}
                </h3>
              </div>
              <p
                className="mt-5 text-base leading-[1.75] max-w-lg"
                style={{ fontFamily: SERIF }}
              >
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== LETTER FROM EDITOR ============== */}
      <section
        className="mx-auto max-w-3xl px-6 py-24 text-center border-t border-[#0a0a0a]/60"
      >
        <div
          className="text-[11px] uppercase mb-8"
          style={{ letterSpacing: '0.25em', color: RUST }}
        >
          — List od redakcie
        </div>
        <p
          className="text-2xl md:text-3xl leading-[1.5]"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          „Veríme, že profesia finančného a realitného poradcu si zaslúži priestor, kde
          reputácia rozhoduje viac než rozpočet na reklamu. Ak zdieľate toto
          presvedčenie, radi vás privítame medzi nami."
        </p>
        <p
          className="mt-10 text-sm"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
          }}
        >
          — Redakcia tvuj specialista, 2026
        </p>
      </section>

      {/* ============== FOOTER CLASSIFIED STRIP ============== */}
      <footer
        className="border-y-2"
        style={{ borderColor: INK }}
      >
        <div className="mx-auto max-w-6xl px-6 py-5 text-center">
          <p
            className="text-[10px] uppercase"
            style={{ letterSpacing: '0.25em' }}
          >
            Application reviewed within 48 hours &middot; Manual review &middot; No
            automatic acceptance
          </p>
        </div>
      </footer>
    </div>
  );
}

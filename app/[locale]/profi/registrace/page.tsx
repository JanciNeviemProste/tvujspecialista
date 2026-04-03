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
import { regions } from '@/mocks/regions';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
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

// ─── Zod schema (identical to original) ───────────────────────────────────────
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
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [error, setError] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const czRegions = regions.filter((r) => r.country === 'CZ');

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      termsAccepted: false as unknown as true,
      gdprAccepted: false as unknown as true,
    },
  });

  // Step navigation
  const goToStep2 = async () => {
    const valid = await trigger(['name', 'email', 'phone']);
    if (valid) setStep(2);
  };

  const goToStep3 = async () => {
    const valid = await trigger(['category', 'location', 'yearsExperience', 'bio']);
    if (valid) setStep(3);
  };

  // Submit (identical to original)
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
        regions: selectedRegions,
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
    {
      emoji: '🔍',
      stat: '78 % lidí',
      title: 'hledá poradce online',
      desc: 'A pokud vás tam nenajdou, zavolají konkurenci. Jednoduše.',
    },
    {
      emoji: '⏱️',
      stat: '15+ hodin týdně',
      title: 'ztracených na hledání klientů',
      desc: 'Průměrný poradce stráví tolik času hledáním nových klientů místo jejich obsluhy.',
    },
    {
      emoji: '⭐',
      stat: '67 % rozhodnutí',
      title: 'závisí na recenzích',
      desc: 'Bez ověřených recenzí ztrácíte důvěru dřív, než se představíte.',
    },
    {
      emoji: '💰',
      stat: 'Až 120 000 Kč ročně',
      title: 'přicházíte o příjmy',
      desc: 'Tolik odhadujeme, že přicházíte o příjmy kvůli slabé online přítomnosti.',
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950',
      title: 'Kvalifikované leady z vašeho regionu',
      desc: 'Zákazníci, kteří aktivně hledají. Žádné studené hovory.',
    },
    {
      icon: UserCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      title: 'Profil, který přesvědčí místo vás',
      desc: 'Certifikace, zkušenosti a úspěchy na jednom místě.',
    },
    {
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950',
      title: 'Recenze, které budují důvěru',
      desc: 'Spokojení klienti zanechají hodnocení. Noví vidí realitu.',
    },
    {
      icon: LayoutDashboard,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950',
      title: 'CRM, který za vás sleduje kontakty',
      desc: 'Kanban pipeline, timeline, export. Nikdy nezapomenete na follow-up.',
    },
    {
      icon: GraduationCap,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950',
      title: 'Akademie pro váš profesní růst',
      desc: 'Exkluzivní kurzy pro poradce a makléře. Vzdělávejte se, vydělejte více.',
    },
    {
      icon: Users,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950',
      title: 'Komunita 300+ specialistů',
      desc: 'Eventy, workshopy, forum. Networkujte s nejlepšími v oboru.',
    },
  ];

  const testimonials = [
    {
      initials: 'MK',
      avatarBg: 'bg-blue-500',
      name: 'Martin K.',
      role: 'Finanční poradce',
      city: 'Praha',
      quote:
        'Za první měsíc jsem získal 4 nové klienty, které bych jinak nikdy nepotkal. Investice času? 2 minuty na registraci. Návratnost? Nedozírná.',
    },
    {
      initials: 'PN',
      avatarBg: 'bg-rose-500',
      name: 'Petra N.',
      role: 'Realitní makléřka',
      city: 'Brno',
      quote:
        'Recenze na profilu mi pomohly získat důvěru zákazníků, kteří mě vůbec neznali. Teď mi volají sami. Bez studených hovorů.',
    },
    {
      initials: 'TV',
      avatarBg: 'bg-green-500',
      name: 'Tomáš V.',
      role: 'Finanční poradce',
      city: 'Ostrava',
      quote:
        'CRM v dashboardu mi ušetřil minimálně 5 hodin týdně. Všechny kontakty přehledně, každý follow-up načas. Prostě funguje.',
    },
  ];

  const statsData = [
    { target: '2847', label: 'zákazníků měsíčně' },
    { target: '312', label: 'aktivních specialistů' },
    { target: '4.8', label: 'průměrné hodnocení' },
    { target: '94', label: '% spokojenost' },
  ];

  const faqItems = [
    {
      q: 'Je registrace opravdu zdarma?',
      a: 'Ano, základní profil je zdarma navždy. Platíte pouze pokud se rozhodnete pro prémiové funkce — více leadů, pokročilé analytiky a prioritní zobrazení.',
    },
    {
      q: 'Kolik klientů mohu realisticky očekávat?',
      a: 'Záleží na vaší kategorii a regionu. Průměrný specialista dostane 3–8 kvalifikovaných poptávek měsíčně. Prémiový profil 2–3× více.',
    },
    {
      q: 'Jak fungují recenze zákazníků?',
      a: 'Po každém uzavřeném případu můžete zákazníkovi poslat žádost o recenzi. Recenze jsou ověřené — zobrazují se jen od skutečných klientů.',
    },
    {
      q: 'Mohu profil kdykoli zrušit?',
      a: 'Samozřejmě. Žádné závazky, žádné storno poplatky. Kdykoliv jedním klikem.',
    },
    {
      q: 'Jaké kategorie specialistů přijímáte?',
      a: 'Aktuálně finanční poradce a realitní makléře. V plánu máme rozšíření o pojišťovací agenty, hypoteční specialisty a daňové poradce.',
    },
    {
      q: 'Jak se lišíte od konkurence?',
      a: 'Nezaměřujeme se na kvantitu, ale kvalitu. Každý zákazník prošel filtrem — ví, co hledá, má reálný zájem. Žádné falešné poptávky.',
    },
    {
      q: 'Musím platit za každý lead?',
      a: 'Ne. Na základním plánu dostanete leady zdarma. Platíte pouze za prémiové funkce jako zvýrazněný profil nebo pokročilé CRM.',
    },
    {
      q: 'Jak dlouho trvá aktivace profilu?',
      a: 'Technicky okamžitě. Po registraci jste v systému. Plná aktivace a indexace profilu proběhne do 24 hodin.',
    },
  ];

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

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <ScrollReveal>
            {/* Urgency badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-400/30 px-5 py-2 text-sm font-semibold text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              100% zdarma &bull; Bez kreditní karty &bull; Aktivace do 24 hodin
            </div>

            {/* H1 */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Každý den přicházíte o&nbsp;klienty,
              <br className="hidden md:block" />
              <span className="text-blue-300"> které nikdy nepotkáte.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 md:text-xl leading-relaxed">
              Zatímco vy spoléháte na doporučení, vaši konkurenti získávají klienty online.
              Každý měsíc. Automaticky.
            </p>

            {/* CTA */}
            <a
              href="#registrace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              Zaregistrovat se zdarma
              <ArrowRight className="h-5 w-5" />
            </a>

            <p className="mt-4 text-sm text-blue-300">
              Již 312 specialistů využívá naši platformu
            </p>
          </ScrollReveal>

          {/* Stats row */}
          <ScrollReveal delay={0.2}>
            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { value: '2 847', label: 'zákazníků / měsíc' },
                { value: '4,8★', label: 'průměrné hodnocení' },
                { value: '312', label: 'specialistů na platformě' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-5"
                >
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="mt-1 text-sm text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 2 — PROBLÉM (pain points)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-orange-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                Poznáváte&nbsp;se?
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Tyhle problémy zná každý poradce. Jen málokdo je aktivně řeší.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {painPoints.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex gap-5 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border-l-4 border-red-400">
                  <span className="text-3xl leading-none mt-1" role="img" aria-label="">
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
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <p className="mt-10 text-center text-sm italic text-gray-400 dark:text-gray-500">
              Tyto problémy má většina specialistů. Ale jen málokdo je aktivně řeší.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 3 — ŘEŠENÍ (benefits)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                Představte si, jak vypadá váš první&nbsp;měsíc
                <br className="hidden md:block" />
                na&nbsp;tvujspecialista.cz
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-6 hover:shadow-md transition-shadow h-full">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${b.bg}`}>
                    <b.icon className={`h-6 w-6 ${b.color}`} />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{b.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 4 — DŮKAZ (social proof)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-blue-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          {/* Animated stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-16">
              {statsData.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    <AnimatedCounter target={s.target} />
                    {s.label === 'průměrné hodnocení' && '★'}
                    {s.label === '% spokojenost' && '%'}
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
                      <p className="text-xs text-gray-400">
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
                Od registrace k&nbsp;prvnímu klientovi za&nbsp;3&nbsp;kroky
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                num: '01',
                icon: UserPlus,
                title: 'Zaregistrujte se za 2 minuty',
                desc: 'Vyplňte základní údaje. Žádná kreditní karta. Žádné závazky.',
              },
              {
                num: '02',
                icon: Edit,
                title: 'Vytvořte profil, který prodává',
                desc: 'Přidejte certifikace, zkušenosti, fotku. Profil pracuje za vás 24/7.',
              },
              {
                num: '03',
                icon: TrendingUp,
                title: 'Přijímejte kvalifikované poptávky',
                desc: 'Zákazníci vás najdou, kontaktují a vy se staráte jen o obchod.',
              },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="mb-1 text-xs font-bold tracking-widest text-blue-500 uppercase">
                    Krok {step.num}
                  </p>
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                Máte otázky? Máme odpovědi.
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
              Vaši budoucí klienti vás právě hledají.
            </h2>
            <p className="mb-10 text-xl text-blue-200">
              Otázka je — najdou vás, nebo vaši konkurenci?
            </p>

            <a
              href="#registrace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              Zaregistrovat se zdarma — trvá 2 minuty
              <ArrowRight className="h-5 w-5" />
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-300">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> Bez závazků
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" /> Bez kreditní karty
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Profil zdarma navždy
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
                Vytvořte si profil&nbsp;zdarma
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Připojte se k&nbsp;312 specialistům, kteří již získávají klienty online.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">

              {/* Step indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Krok {step} ze 3
                  </span>
                  <span className="text-xs text-gray-400">
                    {step === 1 && 'Osobní údaje'}
                    {step === 2 && 'Profesní informace'}
                    {step === 3 && 'Heslo a souhlas'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((s) => (
                    <div
                      key={s}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        s <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tab switcher */}
              <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <Link
                  href="/profi/prihlaseni"
                  className="flex-1 rounded-md py-2.5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
                >
                  {t('tabLogin')}
                </Link>
                <span className="flex-1 rounded-md bg-white dark:bg-gray-600 py-2.5 text-center text-sm font-medium text-gray-900 dark:text-white shadow-sm">
                  {t('tabRegister')}
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

                {/* ── STEP 1: Osobní údaje ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="reg-name" className={labelClass}>
                        Celé jméno <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="Jan Novák"
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
                        E-mail <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="jan@example.com"
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
                        Telefon <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="+420 777 123 456"
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

                    <button
                      type="button"
                      onClick={goToStep2}
                      className="mt-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                    >
                      Pokračovat
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* ── STEP 2: Profesní informace ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reg-category" className={labelClass}>
                          Kategorie <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="reg-category"
                          className={inputClass}
                          aria-invalid={errors.category ? 'true' : undefined}
                          aria-describedby={errors.category ? 'reg-category-error' : undefined}
                          {...register('category')}
                        >
                          <option value="">Vyberte kategorii</option>
                          <option value="Finanční poradce">Finanční poradce</option>
                          <option value="Realitní makléř">Realitní makléř</option>
                        </select>
                        {errors.category && (
                          <p id="reg-category-error" className={errorClass} role="alert">
                            {tValidation(
                              errors.category.message as Parameters<typeof tValidation>[0]
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="reg-location" className={labelClass}>
                          Hlavní region <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="reg-location"
                          className={inputClass}
                          aria-invalid={errors.location ? 'true' : undefined}
                          aria-describedby={errors.location ? 'reg-location-error' : undefined}
                          {...register('location')}
                        >
                          <option value="">Vyberte kraj</option>
                          {czRegions.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        {errors.location && (
                          <p id="reg-location-error" className={errorClass} role="alert">
                            {tValidation(
                              errors.location.message as Parameters<typeof tValidation>[0]
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-experience" className={labelClass}>
                        Let zkušeností <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="reg-experience"
                        type="number"
                        min="0"
                        placeholder="např. 5"
                        className={inputClass}
                        aria-invalid={errors.yearsExperience ? 'true' : undefined}
                        aria-describedby={
                          errors.yearsExperience ? 'reg-experience-error' : undefined
                        }
                        {...register('yearsExperience')}
                      />
                      {errors.yearsExperience && (
                        <p id="reg-experience-error" className={errorClass} role="alert">
                          {tValidation(
                            errors.yearsExperience.message as Parameters<typeof tValidation>[0]
                          )}
                        </p>
                      )}
                    </div>

                    {/* Operating regions checkboxes */}
                    <div>
                      <label className={labelClass}>Kraje, kde působíte</label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Vyberte všechny kraje, ve kterých poskytujete služby.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-3">
                        {czRegions.map((r) => (
                          <label
                            key={r.id}
                            className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-white dark:hover:bg-gray-800 px-2 py-1 transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                              checked={selectedRegions.includes(r.id)}
                              onChange={(e) => {
                                setSelectedRegions((prev) =>
                                  e.target.checked
                                    ? [...prev, r.id]
                                    : prev.filter((id) => id !== r.id)
                                );
                              }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {r.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-bio" className={labelClass}>
                        O sobě <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="reg-bio"
                        rows={4}
                        placeholder="Stručně popište vaši zkušenost, specializaci a co klientům nabízíte..."
                        className={inputClass}
                        aria-invalid={errors.bio ? 'true' : undefined}
                        aria-describedby={errors.bio ? 'reg-bio-error' : undefined}
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p id="reg-bio-error" className={errorClass} role="alert">
                          {tValidation(errors.bio.message as Parameters<typeof tValidation>[0])}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        ← Zpět
                      </button>
                      <button
                        type="button"
                        onClick={goToStep3}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                      >
                        Pokračovat
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Heslo a souhlas ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reg-password" className={labelClass}>
                          Heslo <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-password"
                          type="password"
                          placeholder="Min. 8 znaků"
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
                          Potvrzení hesla <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-confirm-password"
                          type="password"
                          placeholder="Zopakujte heslo"
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
                              errors.confirmPassword.message as Parameters<
                                typeof tValidation
                              >[0]
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
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 shrink-0"
                          {...register('termsAccepted')}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t('termsAgree')}{' '}
                          <Link href="/pravidla" className="text-blue-600 hover:underline">
                            {t('termsLink')}
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
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 shrink-0"
                          {...register('gdprAccepted')}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t('gdprAgree')}{' '}
                          <Link
                            href="/ochrana-osobnich-udaju"
                            className="text-blue-600 hover:underline"
                          >
                            {t('gdprLink')}
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

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        ← Zpět
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? t('submitting') : t('submit')}
                        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  {t('haveAccount')}{' '}
                  <Link href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                    {t('loginHere')}
                  </Link>
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

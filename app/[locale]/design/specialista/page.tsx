import { Link } from '@/i18n/routing';
import { ArrowUpRight, User, Sparkles } from 'lucide-react';

const VARIANTS = [
  {
    id: 'v0',
    name: 'Originál (pred redesignom)',
    tagline: 'Current production — sidebar contact form',
    description:
      'Pôvodná profile stránka — 2-col layout s contact form v sidebari, bio, services, reviews, availability. Blue + Gold. Referenčný bod.',
    palette: ['#3b82f6', '#f59e0b', '#ffffff'],
    conversion: 'sidebar contact form · basic trust signals',
    bg: 'bg-gradient-to-br from-blue-50 via-white to-yellow-50',
    darkBg: 'dark:from-blue-950/40 dark:via-neutral-950 dark:to-yellow-950/20',
  },
  {
    id: 'v1',
    name: 'Trusted Authority',
    tagline: 'Premium concierge booking',
    description:
      'Editorial asymmetric hero, serif italic meno, sticky booking widget s response time guarantee, service menu s cenami, availability calendar, reviews s filtrom. Mercury × Anthropic vibe.',
    palette: ['#4F46E5', '#D97706', '#0C0C14'],
    conversion: 'premium concierge · response guarantee · pricing transparency',
    bg: 'bg-gradient-to-br from-indigo-50 via-white to-amber-50',
    darkBg: 'dark:from-indigo-950/40 dark:via-neutral-950 dark:to-amber-950/20',
  },
  {
    id: 'v2',
    name: 'Modern Tech',
    tagline: 'Linear-style marketplace profile',
    description:
      'Dense data-driven layout, metrics dashboard, terminal response time indicator, mono service tags, availability heatmap, reviews timeline. Geist stack.',
    palette: ['#10b981', '#0f172a', '#f8fafc'],
    conversion: 'data dense · metrics panels · terminal response',
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-slate-50',
    darkBg: 'dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-900',
  },
  {
    id: 'v3',
    name: 'Quiet Luxury',
    tagline: 'Magazine cover story',
    description:
      'Full-bleed portrait hero, editorial name treatment, pull-quote bio, minimal "Apply for consultation" CTA, pricing ako pricing list, reviews ako listy. Fraunces display.',
    palette: ['#0f0f0f', '#c9a96e', '#faf6ef'],
    conversion: 'magazine cover · editorial prestige · letters format',
    bg: 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100',
    darkBg: 'dark:from-neutral-950 dark:via-stone-950 dark:to-neutral-900',
  },
  {
    id: 'v4',
    name: 'Bold Fintech',
    tagline: 'Direct booking hero',
    description:
      'Oversized meno, giant "BOOK NOW" button, chunky stat blocks, loud reviews s rating badges, inline calendar, video intro player. Space Grotesk brutalist.',
    palette: ['#6d28d9', '#84cc16', '#0f0a1e'],
    conversion: 'direct action · inline booking · video intro',
    bg: 'bg-gradient-to-br from-violet-100 via-white to-lime-50',
    darkBg: 'dark:from-violet-950/40 dark:via-neutral-950 dark:to-lime-950/20',
  },
  {
    id: 'v5',
    name: 'Print Editorial',
    tagline: 'Feature article profile',
    description:
      'Newspaper feature story style, drop cap bio, classified-ad services, "Schedule an interview" CTA, reviews ako published quotes s bylines. Rust accent.',
    palette: ['#0a0a0a', '#faf6ef', '#c8410b'],
    conversion: 'feature article · published reviews · interview tone',
    bg: 'bg-gradient-to-br from-[#faf6ef] via-stone-50 to-[#faf6ef]',
    darkBg: 'dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
  },
] as const;

export default function DesignSpecialistaIndexPage() {
  return (
    <div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950"
      style={{ fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-amber-500">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white">tvujspecialista.cz</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Specialist Profile Concepts · April 2026</div>
            </div>
          </div>
          <Link
            href="/design"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            ← Späť na prehľad
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <User className="h-3 w-3" />
            6 Concepts · Specialist Profile
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-7xl">
            Ktorá verzia{' '}
            <span className="italic" style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: '#4F46E5' }}>
              prekonvertuje klienta?
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            Šesť rôznych prístupov k prezentácii profilu špecialistu. Každý variant má iný booking flow, trust signals,
            a spôsob, ako podať bio a služby. Pozri si ktorú verziu by ste chceli pre produkčný redesign.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((variant) => (
            <Link
              key={variant.id}
              href={`/design/specialista/${variant.id}` as '/design/specialista/v1'}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className={`relative mb-6 -mx-8 -mt-8 h-36 overflow-hidden ${variant.bg} ${variant.darkBg}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-3">
                    {variant.palette.map((color) => (
                      <div
                        key={color}
                        className="h-12 w-12 rounded-full ring-4 ring-white/30 dark:ring-black/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
                  {variant.id.toUpperCase()}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{variant.name}</h2>
              <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">{variant.tagline}</p>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {variant.description}
              </p>

              <div className="mt-6 border-t border-neutral-100 pt-4 text-xs dark:border-neutral-800">
                <div className="text-neutral-500 dark:text-neutral-500">CONVERSION</div>
                <div className="mt-1 font-medium text-neutral-700 dark:text-neutral-300">{variant.conversion}</div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                Pozrieť
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-all group-hover:bg-neutral-900 group-hover:text-white dark:bg-neutral-800 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

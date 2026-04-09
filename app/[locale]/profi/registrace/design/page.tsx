import { Link } from '@/i18n/routing';
import { ArrowUpRight, UserPlus, Sparkles } from 'lucide-react';

const VARIANTS = [
  {
    id: 'v0',
    name: 'Originál (pred redesignom)',
    tagline: 'Current production — full-funnel landing page',
    description:
      'Pôvodná registračná stránka — blue + gold + Inter, 10+ sekcií (hero, pain points, before/after, benefits, testimonials, how it works, FAQ, final CTA, form). Referenčný bod.',
    palette: ['#3b82f6', '#f59e0b', '#ffffff'],
    conversion: 'full-funnel SaaS landing page · form at bottom',
    bg: 'bg-gradient-to-br from-blue-50 via-white to-yellow-50',
    darkBg: 'dark:from-blue-950/40 dark:via-neutral-950 dark:to-yellow-950/20',
  },
  {
    id: 'v1',
    name: 'Trusted Authority',
    tagline: 'Premium invite-only application',
    description:
      'Editorial indigo/amber s Instrument Serif italickými akcentmi. Social proof feed, password strength indicator, inline validation, trust stack pri CTA. Pridaj sa k elitnému kruhu pocit.',
    palette: ['#4F46E5', '#D97706', '#0C0C14'],
    conversion: 'prestige anchoring · social proof feed · trust stack',
    bg: 'bg-gradient-to-br from-indigo-50 via-white to-amber-50',
    darkBg: 'dark:from-indigo-950/40 dark:via-neutral-950 dark:to-amber-950/20',
  },
  {
    id: 'v2',
    name: 'Modern Tech',
    tagline: 'Developer-first onboarding',
    description:
      'Geist + mono, terminal-style form flow, real-time validation console, KPI dashboard preview. Linear/Vercel signup.',
    palette: ['#10b981', '#0f172a', '#f8fafc'],
    conversion: 'effort anchor · live validation console · KPI preview',
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-slate-50',
    darkBg: 'dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-900',
  },
  {
    id: 'v3',
    name: 'Quiet Luxury',
    tagline: 'Editorial application letter',
    description:
      'Split-screen s portrait fotkou, Fraunces serif dropcap, form ako klasická pracovná prihláška. Slow, deliberate, prestige.',
    palette: ['#0f0f0f', '#c9a96e', '#faf6ef'],
    conversion: 'editorial prestige · slow commitment · letter format',
    bg: 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100',
    darkBg: 'dark:from-neutral-950 dark:via-stone-950 dark:to-neutral-900',
  },
  {
    id: 'v4',
    name: 'Bold Fintech',
    tagline: 'Get hired. Now.',
    description:
      'Oversized display "ZARÁBAŤ. UŽ.", chunky color blocks, benefits v brutalist kartách, LIMITED SPOTS marquee. Loud, direct, urgency.',
    palette: ['#6d28d9', '#84cc16', '#0f0a1e'],
    conversion: 'urgency · scarcity · loud direct CTA',
    bg: 'bg-gradient-to-br from-violet-100 via-white to-lime-50',
    darkBg: 'dark:from-violet-950/40 dark:via-neutral-950 dark:to-lime-950/20',
  },
  {
    id: 'v5',
    name: 'Print Editorial',
    tagline: 'Classified application',
    description:
      'Newspaper masthead, article-style benefits s dropcaps, form ako application letter s serif fields, rust accent. Formal prestige.',
    palette: ['#0a0a0a', '#faf6ef', '#c8410b'],
    conversion: 'newspaper classified · formal commitment',
    bg: 'bg-gradient-to-br from-[#faf6ef] via-stone-50 to-[#faf6ef]',
    darkBg: 'dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
  },
] as const;

export default function RegistraceDesignIndexPage() {
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
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Registration Concepts · April 2026</div>
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
            <UserPlus className="h-3 w-3" />
            6 Concepts · Registration
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-7xl">
            Ktorá verzia{' '}
            <span className="italic" style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: '#4F46E5' }}>
              prekonvertuje najviac?
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            Šesť rôznych konverzných prístupov k registrácii nového špecialistu. Každý variant má inú psychológiu,
            layout formulára a sociálny dôkaz.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((variant) => (
            <Link
              key={variant.id}
              href={`/profi/registrace/design/${variant.id}` as '/profi/registrace/design/v1'}
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

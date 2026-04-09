import { Link } from '@/i18n/routing';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const VARIANTS = [
  {
    id: 'v0',
    name: 'Originál (pred redesignom)',
    tagline: 'Current production — Blue + Gold + Inter',
    description:
      'Pôvodná verzia tvujspecialista.cz pred redesignom — čistý SaaS layout so štandardnými modrými CTA a zlatými akcentmi, 10 centrovaných sekcií (hero, problém, ako to funguje, kategórie, testimonials, benefity, stats, CTA, FAQ, finálny CTA). Referenčný bod pre porovnanie.',
    palette: ['#3b82f6', '#f59e0b', '#ffffff'],
    font: 'Inter',
    vibe: 'current production · clean · SaaS standard',
    bg: 'bg-gradient-to-br from-blue-50 via-white to-yellow-50',
    darkBg: 'dark:from-blue-950/40 dark:via-neutral-950 dark:to-yellow-950/20',
  },
  {
    id: 'v1',
    name: 'Trusted Authority',
    tagline: 'Asymmetric editorial, Indigo + Amber',
    description:
      'Serif italic display mixed with sans body, editorial 60/40 asymmetric hero, floating glass chips around a premium specialist card preview. Feels like Mercury × Anthropic.',
    palette: ['#4F46E5', '#D97706', '#0C0C14'],
    font: 'Plus Jakarta Sans + Instrument Serif',
    vibe: 'trustworthy · premium · fintech',
    bg: 'bg-gradient-to-br from-indigo-50 via-white to-amber-50',
    darkBg: 'dark:from-indigo-950/40 dark:via-neutral-950 dark:to-amber-950/20',
  },
  {
    id: 'v2',
    name: 'Modern Tech',
    tagline: 'Centered bold display, Emerald + Slate',
    description:
      'Tight Geist typography, dense rows, mono accents, grid overlay background. Feels like Linear × Vercel — sharp, technical, modern.',
    palette: ['#10b981', '#0f172a', '#f8fafc'],
    font: 'Geist Sans + Geist Mono',
    vibe: 'sharp · technical · 2026 SaaS',
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-slate-50',
    darkBg: 'dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-900',
  },
  {
    id: 'v3',
    name: 'Quiet Luxury',
    tagline: 'Editorial split-screen, Charcoal + Champagne',
    description:
      'Big Fraunces serif display, split-screen photo + headline, massive whitespace, zero-radius minimal CTAs. Feels like a fashion magazine meeting Mercury.',
    palette: ['#0f0f0f', '#c9a96e', '#faf6ef'],
    font: 'Fraunces + Inter Tight',
    vibe: 'editorial · luxe · understated',
    bg: 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100',
    darkBg: 'dark:from-neutral-950 dark:via-stone-950 dark:to-neutral-900',
  },
  {
    id: 'v4',
    name: 'Bold Fintech',
    tagline: 'Brutalist color blocks, Violet + Lime',
    description:
      'Space Grotesk oversized type, full-bleed color blocks, diagonal elements, rounded mega-radius. Feels like Ramp × Cash App — bold statement.',
    palette: ['#6d28d9', '#84cc16', '#0f0a1e'],
    font: 'Space Grotesk + Space Mono',
    vibe: 'bold · energetic · statement',
    bg: 'bg-gradient-to-br from-violet-100 via-white to-lime-50',
    darkBg: 'dark:from-violet-950/40 dark:via-neutral-950 dark:to-lime-950/20',
  },
  {
    id: 'v5',
    name: 'Print Editorial',
    tagline: 'Newspaper asymmetric grid, Cream + Ink',
    description:
      'Fraunces serif display with drop caps, cream paper background, asymmetric newspaper grid, rust accent. Feels like a luxury print magazine.',
    palette: ['#0a0a0a', '#faf6ef', '#c8410b'],
    font: 'Fraunces + Inter',
    vibe: 'editorial · print · minimalist',
    bg: 'bg-gradient-to-br from-[#faf6ef] via-stone-50 to-[#faf6ef]',
    darkBg: 'dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
  },
] as const;

export default function DesignIndexPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" style={{ fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-amber-500">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white">tvujspecialista.cz</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Design Concepts · April 2026</div>
            </div>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            ← Späť na hlavný web
          </Link>
        </div>
      </div>

      {/* Hero intro */}
      <div className="container mx-auto px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            3 Pages · 6 Concepts each
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-7xl">
            Ktorý sa páči{' '}
            <span className="italic" style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: '#4F46E5' }}>
              najviac?
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            Šesť úplne odlišných vizuálnych konceptov pre tri kľúčové stránky — homepage, registrácia špecialistu,
            a detail profilu špecialistu. Každý má inú paletu, typografiu, a konverzný prístup.
          </p>

          {/* Quick navigation to 3 sections */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#homepage"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            >
              🏠 Homepage
            </Link>
            <Link
              href="/profi/registrace/design"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-900 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200"
            >
              ✍️ Registrácia špecialistu →
            </Link>
            <Link
              href="/specialista/design"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
            >
              👤 Profil špecialistu →
            </Link>
          </div>
        </div>

        <div id="homepage" className="mt-24 mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Homepage · 6 konceptov
          </h2>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Variant cards — bento-ish grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((variant, index) => (
            <Link
              key={variant.id}
              href={`/design/${variant.id}` as '/design/v1'}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 ${
                index === 0 ? 'lg:col-span-1' : ''
              }`}
            >
              {/* Gradient preview header */}
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

              <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4 text-xs dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-500">FONT</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{variant.font}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-500">VIBE</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{variant.vibe}</span>
                </div>
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

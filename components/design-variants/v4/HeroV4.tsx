'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Star, Shield, TrendingUp } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroV4() {
  return (
    <section
      data-theme="v4"
      className="relative min-h-screen overflow-hidden bg-background"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* BIG OVERSIZED DISPLAY — breaks out of container (nav handled by HeaderV4 above) */}
      <div className="relative">
        {/* Marquee diagonal tag behind */}
        <div className="pointer-events-none absolute -top-10 left-0 right-0 -rotate-2 overflow-hidden whitespace-nowrap">
          <div className="bg-accent py-3">
            <div className="flex items-center gap-8 px-6 text-sm font-bold uppercase tracking-wider text-accent-foreground animate-marquee-slow" style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                  ★ OVERENÝ MARKETPLACE ★ 2 500+ ŠPECIALISTOV ★ ZDARMA PRE KLIENTOV ★ 4.9 HODNOTENIE
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative px-6 pt-32 pb-12 lg:px-12 lg:pt-40">
          <div className="mx-auto max-w-6xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              LIVE · 2 500+ ŠPECIALISTOV
            </motion.div>

            {/* OVERSIZED DISPLAY */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
              className="text-[clamp(3.5rem,11vw,11rem)] font-black leading-[0.85] tracking-[-0.05em] text-foreground"
            >
              NÁJDI<br />
              <span className="inline-block rounded-3xl bg-primary px-6 py-2 text-primary-foreground">
                SVOJHO
              </span>
              <br />
              ŠPECIALISTU
              <span className="inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-3xl bg-accent ml-4">
                <ArrowRight className="h-[60%] w-[60%] text-accent-foreground" strokeWidth={3} />
              </span>
            </motion.h1>

            {/* Subtitle + CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
              className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12"
            >
              <p className="text-xl leading-relaxed text-muted-foreground lg:col-span-6">
                Overené profily. Reálne recenzie. Nula fake hodnotení. Toto nie
                je ďalší katalóg — toto je marketplace postavený na dôvere,
                transparentnosti a výsledkoch.
              </p>

              <div className="flex flex-col gap-3 lg:col-span-6 lg:items-end lg:justify-center">
                <Link
                  href="/hledat"
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background shadow-[0_8px_0_hsl(var(--accent))] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_hsl(var(--accent))]"
                >
                  Začať teraz
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:rotate-[-45deg]">
                    <ArrowRight className="h-4 w-4" strokeWidth={3} />
                  </div>
                </Link>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}>
                  ~ 2 minúty · zdarma ~
                </div>
              </div>
            </motion.div>

            {/* BIG STAT BLOCKS — brutalist */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
              className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              {[
                { value: '2 500', suffix: '+', label: 'ŠPECIALISTOV', icon: Star, color: 'primary' },
                { value: '15K', suffix: '+', label: 'RECENZIÍ', icon: Shield, color: 'accent' },
                { value: '4.9', suffix: '★', label: 'HODNOTENIE', icon: TrendingUp, color: 'primary' },
                { value: '<24', suffix: 'h', label: 'ODPOVEĎ', icon: Zap, color: 'accent' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`relative overflow-hidden rounded-3xl border-4 border-foreground p-6 ${
                    i % 2 === 0 ? 'bg-card' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${i % 2 === 0 ? 'text-primary' : 'text-accent'}`}
                    strokeWidth={3}
                  />
                  <div className="mt-3 text-5xl font-black leading-none tracking-tight">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

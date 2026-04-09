'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Terminal, Zap } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroV2() {
  return (
    <section
      data-theme="v2"
      className="relative isolate min-h-screen overflow-hidden bg-background pt-8 font-v2"
      style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 bg-grid opacity-100" />
      {/* Radial gradient spotlight */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.12),transparent_60%)]" />

      {/* Top status bar — mono style */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        className="relative mx-auto mt-6 flex max-w-fit items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs backdrop-blur"
        style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="font-semibold text-foreground">marketplace-v4.2.0</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">live · CS/SK/EN/PL</span>
      </motion.div>

      <div className="container mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Centered bold display */}
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
            className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-7xl lg:text-[clamp(4rem,9vw,8rem)]"
          >
            Marketplace specialistů.
            <br />
            <span className="text-primary">Postavený na dôvere.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
            className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Overené profily. Transparentné recenzie. Žiadne náhodné poradcovia.
            Iba 2 500+ špecialistov, ktorí vedia, čo robia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/hledat"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_10px_30px_-10px_hsl(var(--primary)/0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_20px_40px_-10px_hsl(var(--primary)/0.7)]"
            >
              Začať hľadanie
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/profi/registrace"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <Terminal className="h-4 w-4" />
              Pre špecialistov
            </Link>
          </motion.div>

          {/* Mono code-style stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
            style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
          >
            {[
              { label: 'SPECIALISTS', value: '2,500+' },
              { label: 'REVIEWS', value: '15K+' },
              { label: 'RATING', value: '4.9★' },
              { label: 'UPTIME', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-5 text-left">
                <div className="text-[10px] font-medium tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Feature pills row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs"
            style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
          >
            {[
              { label: 'verified-id', icon: Star },
              { label: 'certified', icon: Zap },
              { label: 'real-reviews', icon: Star },
              { label: 'no-hidden-fees', icon: Zap },
              { label: '24h-response', icon: Zap },
            ].map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground"
              >
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Feature grid — like Linear's feature blocks */}
        <div className="mx-auto mt-32 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: 'Overené profily',
              description: 'Každý špecialista prechádza ID verifikáciou a kontrolou certifikátov.',
              icon: Star,
            },
            {
              title: 'Transparentné recenzie',
              description: 'Iba hodnotenia od reálnych klientov, ktorí skutočne využili službu.',
              icon: Zap,
            },
            {
              title: 'Smart matching',
              description: 'Algoritmus spáruje klienta s najvhodnejším špecialistom v jeho okolí.',
              icon: Terminal,
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <feature.icon className="h-5 w-5 text-primary" strokeWidth={2.5} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAV2() {
  return (
    <section data-theme="v2" className="relative overflow-hidden bg-background py-32" style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      {/* Top spotlight */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)]" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs"
            style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-foreground">ready</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">waiting for input</span>
          </div>

          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-7xl">
            Start in{' '}
            <span className="text-primary">60 seconds.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            No signup required to browse. No agent spam. No hidden fees. Just verified specialists
            ready to help.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/hledat"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_10px_30px_-10px_hsl(var(--primary)/0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_20px_40px_-10px_hsl(var(--primary)/0.7)]"
            >
              Start searching
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/profi/registrace"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <Terminal className="h-4 w-4" />
              I'm a specialist
            </a>
          </div>

          {/* Mono meta footer */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
          >
            <span>free: true</span>
            <span className="opacity-40">|</span>
            <span>verified: 2500+</span>
            <span className="opacity-40">|</span>
            <span>rating: 4.9/5</span>
            <span className="opacity-40">|</span>
            <span>response: &lt;24h</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

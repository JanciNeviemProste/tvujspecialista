'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAV1() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 -z-10 gradient-mesh" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-balance text-display-2 font-bold tracking-tight text-foreground lg:text-display-1">
            Začni{' '}
            <span className="text-serif-italic font-normal text-primary">dnes.</span>
            <br />
            Výsledky{' '}
            <span className="text-serif-italic font-normal text-primary">zajtra.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            2 500+ overených špecialistov čaká na tvoj prvý kontakt. Zdarma, bez záväzkov, bez rizika.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href="/hledat"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background shadow-elevation-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5"
            >
              <Search className="h-4 w-4" />
              Najsť špecialistu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/profi/registrace"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-md transition-all hover:bg-background hover:-translate-y-0.5"
            >
              Som špecialista
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Bezplatné pre klientov
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              100% overení špecialisti
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              4.9★ priemerné hodnotenie
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAV4() {
  return (
    <section
      data-theme="v4"
      className="relative overflow-hidden bg-primary py-24 sm:py-32"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Lime diagonal stripe behind */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 -rotate-2 overflow-hidden whitespace-nowrap">
        <div className="bg-accent py-3">
          <div
            className="animate-marquee-slow flex items-center gap-8 px-6 text-sm font-bold uppercase tracking-wider text-accent-foreground"
            style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                ★ BEZ POPLATKOV ★ ZADARMO ★ 2 500+ ŠPECIALISTOV ★ OVERENÝ MARKETPLACE
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-5xl"
        >
          <h2 className="text-[clamp(3rem,11vw,11rem)] font-black leading-[0.85] tracking-[-0.05em] text-primary-foreground">
            ZAČNI
            <br />
            <span className="inline-block rounded-3xl bg-accent px-6 py-2 text-accent-foreground">
              TERAZ
            </span>
            .
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-12 max-w-2xl text-xl font-bold text-primary-foreground/90 sm:text-2xl"
          >
            2 500+ overených špecialistov. Zadarmo pre klientov. Žiadne skryté poplatky. Žiadne
            bullshit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="/hledat"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-10 py-5 text-lg font-black uppercase tracking-wider text-accent-foreground shadow-[0_8px_0_hsl(var(--primary-foreground))] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_hsl(var(--primary-foreground))]"
            >
              NAJDI ŠPECIALISTU
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-[-45deg]">
                <ArrowRight className="h-5 w-5" strokeWidth={3} />
              </div>
            </a>
            <div
              className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/80"
              style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
            >
              ~ ZADARMO · 2 MIN ~
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

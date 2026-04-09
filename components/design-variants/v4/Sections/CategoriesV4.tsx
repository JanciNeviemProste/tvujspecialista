'use client';

import { motion } from 'framer-motion';
import { Briefcase, Home, ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CategoriesV4() {
  return (
    <section
      data-theme="v4"
      className="relative bg-background py-24 sm:py-32"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Chunky label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 inline-block rounded-3xl bg-accent px-6 py-3 text-sm font-black uppercase tracking-wider text-accent-foreground"
          style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
        >
          → KATEGÓRIE
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-foreground"
        >
          VYBER SI.
          <br />
          A JEDEŠ.
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Financial advisor */}
          <motion.a
            href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative overflow-hidden rounded-3xl border-4 border-foreground bg-primary p-8 text-primary-foreground transition-all hover:-translate-y-1 sm:p-10"
          >
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl transition-all group-hover:bg-accent/50" />

            <div className="relative z-10">
              <Briefcase className="h-10 w-10 text-accent" strokeWidth={3} />

              <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-75" style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}>
                01 / FINANCE
              </div>
              <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                FINANČNÝ
                <br />
                PORADCA
              </h3>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {['Hypotéky', 'Poistenie', 'Investície', 'Úvery'].map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider backdrop-blur"
                  >
                    {tag}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <div className="text-6xl font-black leading-none tracking-tight">1.4K+</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider opacity-75">
                    špecialistov
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_6px_0_hsl(var(--foreground))] transition-all group-hover:-translate-y-1 group-hover:shadow-[0_8px_0_hsl(var(--foreground))]">
                  <ArrowRight className="h-6 w-6" strokeWidth={3} />
                </div>
              </div>
            </div>
          </motion.a>

          {/* Real estate agent */}
          <motion.a
            href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="group relative overflow-hidden rounded-3xl border-4 border-foreground bg-accent p-8 text-accent-foreground transition-all hover:-translate-y-1 sm:p-10"
          >
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl transition-all group-hover:bg-primary/50" />

            <div className="relative z-10">
              <Home className="h-10 w-10 text-primary" strokeWidth={3} />

              <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-75" style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}>
                02 / REAL ESTATE
              </div>
              <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                REALITNÝ
                <br />
                MAKLÉR
              </h3>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {['Predaj', 'Kúpa', 'Prenájom', 'Komerčné'].map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full border-2 border-accent-foreground/30 bg-accent-foreground/10 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider backdrop-blur"
                  >
                    {tag}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <div className="text-6xl font-black leading-none tracking-tight">1.0K+</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider opacity-75">
                    špecialistov
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_0_hsl(var(--foreground))] transition-all group-hover:-translate-y-1 group-hover:shadow-[0_8px_0_hsl(var(--foreground))]">
                  <ArrowRight className="h-6 w-6" strokeWidth={3} />
                </div>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

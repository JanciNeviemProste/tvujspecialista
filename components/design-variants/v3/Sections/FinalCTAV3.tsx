'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAV3() {
  return (
    <section
      data-theme="v3"
      className="relative border-t border-foreground/10 bg-background py-32 sm:py-44"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-5xl text-center"
        >
          <div
            className="mb-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            style={{ letterSpacing: '0.3em' }}
          >
            — Začiatok konverzácie —
          </div>

          <h2
            className="text-[clamp(3rem,9vw,9rem)] leading-[0.88] tracking-[-0.02em] text-foreground"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            Čakáme
            <br />
            <em className="italic text-accent">vás.</em>
          </h2>

          <p className="mx-auto mt-12 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            2 500+ overených špecialistov. Žiadne formuláre, žiadne spam hovory. Jednoduchý prvý
            krok — a zvyšok je na vás.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:justify-center"
          >
            <a
              href="/hledat"
              className="group inline-flex items-center gap-4 bg-foreground px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-all hover:bg-accent hover:text-accent-foreground"
              style={{ letterSpacing: '0.2em' }}
            >
              Nájsť špecialistu
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
            <div
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              style={{ letterSpacing: '0.2em' }}
            >
              <span className="text-accent">—</span> Bezplatné pre klientov
            </div>
          </motion.div>

          {/* Footer meta line */}
          <div className="mt-24 flex flex-wrap items-center justify-center gap-8 border-t border-foreground/15 pt-10 text-xs uppercase tracking-[0.2em] text-muted-foreground" style={{ letterSpacing: '0.2em' }}>
            <div>
              <div className="text-foreground" style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400, fontSize: '1.5rem' }}>2 500</div>
              Špecialisti
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div>
              <div className="text-foreground" style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400, fontSize: '1.5rem' }}>4.9 ★</div>
              Priemerné hodnotenie
            </div>
            <div className="h-8 w-px bg-foreground/20" />
            <div>
              <div className="text-foreground" style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400, fontSize: '1.5rem' }}>15 000</div>
              Spokojných klientov
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

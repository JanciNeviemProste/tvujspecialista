'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAV5() {
  return (
    <section
      data-theme="v5"
      className="border-t-2 border-foreground bg-background py-24 sm:py-36"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-6xl"
        >
          {/* Editorial eyebrow */}
          <div className="mb-10 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-16 bg-foreground" />
            Pozvánka do kolekcie
            <span className="h-px w-16 bg-foreground" />
          </div>

          <h2
            className="text-center text-[clamp(3rem,10vw,10rem)] leading-[0.88] tracking-[-0.03em] text-foreground"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            Začiatok vašej
            <br />
            <em className="italic text-accent">konverzácie.</em>
          </h2>

          <p className="mx-auto mt-10 max-w-xl text-center text-lg italic leading-relaxed text-muted-foreground">
            2 500+ overených špecialistov. Žiadne formuláre. Žiadne spam hovory. Jednoduchý prvý
            krok — a zvyšok je na vás.
          </p>

          <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <a
              href="/hledat"
              className="group inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
              style={{ letterSpacing: '0.2em' }}
            >
              Nájsť špecialistu
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/profi/registrace"
              className="group inline-flex items-center gap-3 border-2 border-foreground bg-background px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              style={{ letterSpacing: '0.2em' }}
            >
              Som špecialista
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Bottom classifieds-style stats */}
          <div className="mx-auto mt-24 grid max-w-4xl grid-cols-2 border-y-2 border-foreground py-10 sm:grid-cols-4">
            {[
              { value: '2 500', label: 'Specialistov' },
              { value: '15 000', label: 'Recenzií' },
              { value: '4.9 ★', label: 'Hodnotenie' },
              { value: '< 24h', label: 'Odpoveď' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`border-foreground/25 px-4 text-center ${i > 0 ? 'border-l' : ''}`}
              >
                <div
                  className="text-3xl leading-none text-foreground sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                >
                  {stat.value}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

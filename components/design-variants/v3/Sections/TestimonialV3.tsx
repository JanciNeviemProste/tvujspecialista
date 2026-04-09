'use client';

import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function TestimonialV3() {
  return (
    <section
      data-theme="v3"
      className="relative bg-background py-28 sm:py-40"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-4xl"
        >
          {/* Editorial eyebrow */}
          <div
            className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            style={{ letterSpacing: '0.3em' }}
          >
            <span className="h-px w-16 bg-foreground/40" />
            List od klientky
            <span className="h-px w-16 bg-foreground/40" />
          </div>

          {/* Opening quotation mark */}
          <div
            className="mb-4 text-[6rem] leading-none text-accent"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            "
          </div>

          {/* Featured letter-style testimonial */}
          <blockquote
            className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4] tracking-[-0.01em] text-foreground"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            Začala som hľadať hypotéku ako väčšina ľudí — cez Google, veľké porovnávače, s pocitom
            že všetci chcú len províziu. Tvůj specialista bol{' '}
            <em className="italic text-accent">iný</em>. Namiesto nátlaku mi dali zoznam troch
            overených poradcov. Všetci odpovedali do 24 hodín. Vybrala som si jedného, ktorý mi
            vysvetlil nielen produkt, ale aj jeho dôsledky o 10 rokov dopredu. Žiadne prekvapenia,
            žiadne skryté poplatky.
          </blockquote>

          {/* Signature line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mt-16 flex items-end justify-between border-t border-foreground/20 pt-8"
          >
            <div>
              <div
                className="text-2xl text-foreground"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                — Martina Kováčová
              </div>
              <div
                className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                style={{ letterSpacing: '0.2em' }}
              >
                Klientka · Bratislava · Marec 2026
              </div>
            </div>
            <div
              className="hidden text-right text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block"
              style={{ letterSpacing: '0.2em' }}
            >
              <div className="text-2xl text-foreground" style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}>
                ★★★★★
              </div>
              <div className="mt-1">Verifikovaná recenzia</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

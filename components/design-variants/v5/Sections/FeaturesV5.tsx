'use client';

import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    num: 'N° 01',
    title: 'Overené profily',
    description:
      'Každý špecialista prechádza kontrolou ID, certifikátov a profesijnej histórie. Žiadne automatické registrácie.',
  },
  {
    num: 'N° 02',
    title: 'Reálne recenzie',
    description:
      'Hodnotenie môžu dať iba klienti so spárovanou službou. Systém eliminuje fake reviews.',
  },
  {
    num: 'N° 03',
    title: 'Transparentné ceny',
    description:
      'Sadzby uvedené vopred v profile. Žiadne skryté provízie, žiadne prekvapenia.',
  },
  {
    num: 'N° 04',
    title: 'Smart matching',
    description:
      'Algoritmus párovania podľa potrieb klienta, lokality a špecializácie — nie podľa platby.',
  },
  {
    num: 'N° 05',
    title: 'Rýchla odozva',
    description:
      'Priemerná odpoveď do 24 hodín. Žiadne čakanie týždne na prvý kontakt.',
  },
  {
    num: 'N° 06',
    title: 'Zdarma pre klientov',
    description:
      'Kompletné vyhľadávanie, porovnanie a kontakt sú úplne bezplatné. Navždy.',
  },
];

export function FeaturesV5() {
  return (
    <section
      data-theme="v5"
      className="border-t border-foreground/20 bg-background py-20 sm:py-28"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="h-px w-16 bg-foreground" />
          Index — Princípy platformy
          <span className="h-px flex-1 bg-foreground" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mb-20 max-w-4xl text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-foreground"
          style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
        >
          Šesť{' '}
          <em className="italic text-accent">princípov.</em>
          <br />
          Žiadne ústupky.
        </motion.h2>

        {/* Newspaper 2-col grid */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="border-t border-foreground/25 pt-8"
            >
              <div
                className="mb-3 text-xs uppercase tracking-[0.25em] text-accent"
                style={{ letterSpacing: '0.25em' }}
              >
                {feature.num}
              </div>
              <h3
                className="text-2xl leading-tight tracking-tight text-foreground sm:text-3xl"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                {feature.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.7] text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

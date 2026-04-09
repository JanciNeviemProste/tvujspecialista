'use client';

import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    num: '01',
    title: 'Overené profily',
    description:
      'Každý špecialista prechádza manuálnou verifikáciou — kontrola ID, certifikátov, profesijnej histórie. Žiadne automatické akceptácie.',
  },
  {
    num: '02',
    title: 'Reálne recenzie',
    description:
      'Hodnotenie môžu dať iba klienti, ktorí službu skutočne využili. Systém overuje každú recenziu prostredníctvom kontrolovaného spárovania.',
  },
  {
    num: '03',
    title: 'Transparentné ceny',
    description:
      'Žiadne skryté provízie. Špecialista uvádza svoje sadzby vopred v profile. Vy rozhodujete s úplnými informáciami.',
  },
  {
    num: '04',
    title: 'Bez náhody',
    description:
      'Matching algoritmus spáruje klienta s najvhodnejším špecialistom podľa potrieb, lokality a špecializácie — nie podľa kto platí za pozíciu.',
  },
];

export function FeaturesV3() {
  return (
    <section
      data-theme="v3"
      className="border-t border-foreground/10 bg-background py-28 sm:py-40"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-5"
          >
            <div className="sticky top-24">
              <div
                className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground"
                style={{ letterSpacing: '0.3em' }}
              >
                Princípy · 01 – 04
              </div>
              <h2
                className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                Kurovaný<br />
                <em className="italic text-accent">marketplace.</em>
              </h2>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
                Štyri princípy, na ktorých stojí celá platforma. Žiadne promo rošády, žiadne skryté
                dohody s agentmi. Iba jasné pravidlá, ktoré chránia klienta aj špecialistu.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — feature list */}
          <div className="lg:col-span-7">
            <div className="space-y-16 lg:space-y-20">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                  className="border-t border-foreground/15 pt-10"
                >
                  <div className="grid grid-cols-12 gap-6">
                    <div
                      className="col-span-12 text-sm uppercase tracking-[0.2em] text-accent sm:col-span-2"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      {feature.num}
                    </div>
                    <div className="col-span-12 sm:col-span-10">
                      <h3
                        className="text-3xl text-foreground sm:text-4xl"
                        style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                      >
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

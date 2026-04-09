'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroV5() {
  return (
    <section
      data-theme="v5"
      className="relative min-h-screen bg-background"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Main editorial grid (masthead + nav strip handled by HeaderV5 above) */}
      <div className="container mx-auto px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN — headline + dropcap body (8 cols) */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              <span className="h-px w-12 bg-foreground" />
              Feature · Marketplace
              <span className="h-px w-12 bg-foreground" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: EASE }}
              className="text-[clamp(3rem,8vw,8rem)] leading-[0.88] tracking-[-0.03em] text-foreground"
              style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
            >
              Kde dôvera
              <br />
              stretáva{' '}
              <em className="italic text-accent">remeslo.</em>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
              className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2"
            >
              {/* First column with dropcap */}
              <div className="relative">
                <p className="text-[15px] leading-[1.7] text-foreground">
                  <span
                    className="float-left mr-2 mt-1 text-[5rem] leading-[0.85] text-accent"
                    style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                  >
                    H
                  </span>
                  ľadanie správneho finančného poradcu alebo realitného
                  makléra nemusí byť lotéria. Vybrali sme 2 500 špecialistov,
                  ktorých viete spoľahlivo porovnať — podľa skutočných recenzií,
                  transparentných cien a overenej praxe.
                </p>
              </div>

              {/* Second column */}
              <div>
                <p className="text-[15px] leading-[1.7] text-foreground">
                  Žiadne reklamné rošády. Žiadne schované provízie. Iba
                  odborníci, ktorí vedia svoje, a klienti, ktorí vedia,
                  čo chcú.{' '}
                  <span className="italic text-muted-foreground">
                    Tvůj specialista funguje ako kurovaná
                    editorial platforma — každý profil prechádza výberom.
                  </span>
                </p>

                <div className="mt-8">
                  <Link
                    href="/hledat"
                    className="group inline-flex items-center gap-3 border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent hover:border-accent"
                  >
                    Prehliadnuť marketplace
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — sidebar with photo + meta (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: EASE }}
            className="lg:col-span-4"
          >
            <div className="border border-foreground/20">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=90"
                  alt="Specialistka"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover grayscale"
                  priority
                />
              </div>
              <div className="border-t border-foreground/20 p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                  Portrét
                </div>
                <h3
                  className="mt-2 text-2xl leading-tight text-foreground"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                >
                  Eva Nováková
                  <br />
                  <em className="italic text-muted-foreground text-lg">Finanční poradkyňa</em>
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  „Pracujem s klientami, ktorí chcú viac než
                  iba hypotéku — chcú plán, ktorý ich prežije.
                  Praha, 12 rokov praxe."
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-4 text-xs text-muted-foreground">
                  <span>4.9 ★ · 127 recenzií</span>
                  <Link href="/specialista/eva-novakova" className="font-bold text-foreground hover:text-accent">
                    Profil →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats strip — editorial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          className="mt-20 grid grid-cols-2 border-t border-b border-foreground py-8 text-center sm:grid-cols-4"
        >
          {[
            { value: '2 500', label: 'Specialisté' },
            { value: '15 000', label: 'Recenzií' },
            { value: '4.9', label: 'Hodnotenie' },
            { value: '98%', label: 'Spokojnosť' },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-foreground/10 first:border-l-0 px-4">
              <div
                className="text-4xl leading-none text-foreground"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                {stat.value}
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

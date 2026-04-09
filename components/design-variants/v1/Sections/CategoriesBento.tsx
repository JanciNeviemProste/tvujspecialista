'use client';

import { motion } from 'framer-motion';
import { Briefcase, Home, ArrowUpRight, Check } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CategoriesBentoV1() {
  return (
    <section className="relative bg-secondary/40 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kategórie
          </div>
          <h2 className="text-balance text-display-3 font-bold tracking-tight text-foreground">
            Dve profesie.{' '}
            <span className="text-serif-italic font-normal text-primary">Jedna platforma.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Financial advisor card — featured */}
          <motion.a
            href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevation-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-elevation-4 sm:p-10"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl transition-all duration-700 group-hover:bg-primary/25" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-indigo">
                <Briefcase className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Finančný poradca
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Hypotéky, poistenie, investície a úvery. Jedno miesto, desiatky overených
                špecialistov.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  'Hypotéky a refinance',
                  'Poistné produkty',
                  'Investičné portfóliá',
                  'Úverové konzultácie',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-primary">
                <span>1 450+ špecialistov</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.a>

          {/* Real estate agent card */}
          <motion.a
            href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevation-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-elevation-4 sm:p-10"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl transition-all duration-700 group-hover:bg-accent/25" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-premium">
                <Home className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Realitný maklér
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Predaj, kúpa, prenájom a komerčné nehnuteľnosti. Poradenstvo od ľudí, čo poznajú
                lokálny trh.
              </p>

              <ul className="mt-8 space-y-3">
                {['Predaj nehnuteľností', 'Kúpa s konzultáciou', 'Prenájmy a správa', 'Komerčné projekty'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                      <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-accent">
                <span>1 050+ špecialistov</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

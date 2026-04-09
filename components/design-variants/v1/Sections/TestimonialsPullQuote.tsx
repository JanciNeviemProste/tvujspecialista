'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURED = {
  quote:
    'Konečne marketplace, ktorý funguje. Za tri dni som mala tri ponuky od overených finančných poradcov a vybrala som si toho, ktorý mi sedel. Bez telefonátov zo strany agentov, bez nátlaku.',
  name: 'Martina K.',
  role: 'Klientka · Bratislava',
  rating: 5,
};

const SMALL_QUOTES = [
  {
    quote: 'Jednoduché, rýchle, bez reklám. Presne to čo som hľadal.',
    name: 'Peter S.',
    role: 'Praha',
  },
  {
    quote: 'Overený maklér mi pomohol predať byt nad očakávaním.',
    name: 'Jana M.',
    role: 'Brno',
  },
  {
    quote: 'Hypotéku som vybavila za týždeň. Doporučím.',
    name: 'Zuzana L.',
    role: 'Košice',
  },
];

export function TestimonialsPullQuoteV1() {
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
            Recenzie
          </div>
          <h2 className="text-balance text-display-3 font-bold tracking-tight text-foreground">
            15 000+ spokojných{' '}
            <span className="text-serif-italic font-normal text-primary">klientov.</span>
          </h2>
        </motion.div>

        {/* Featured pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-elevation-3 sm:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10">
            <Quote className="mb-6 h-12 w-12 text-primary/30" strokeWidth={1.5} />
            <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
              <span className="text-serif-italic font-normal">„</span>
              {FEATURED.quote}
              <span className="text-serif-italic font-normal">"</span>
            </blockquote>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <div>
                <div className="text-base font-bold text-foreground">{FEATURED.name}</div>
                <div className="text-sm text-muted-foreground">{FEATURED.role}</div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(FEATURED.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" strokeWidth={0} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small quotes grid */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {SMALL_QUOTES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
              className="rounded-2xl border border-border bg-card p-6 shadow-elevation-1 transition-shadow duration-500 hover:shadow-elevation-3"
            >
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">„{item.quote}"</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{item.name}</span> · {item.role}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

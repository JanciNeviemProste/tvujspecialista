'use client';

import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const QUOTES = [
  {
    handle: 'martina.k',
    role: 'Client',
    location: 'Bratislava',
    quote:
      'Finally a marketplace that works. Got 3 verified offers in 3 days and picked the one that fit. Zero agent spam.',
    rating: '5.0',
  },
  {
    handle: 'peter.s',
    role: 'Client',
    location: 'Prague',
    quote:
      'Simple, fast, ad-free. Exactly what I was looking for. The mortgage process took 7 days.',
    rating: '5.0',
  },
  {
    handle: 'jana.m',
    role: 'Client',
    location: 'Brno',
    quote:
      'Verified broker helped me sell my apartment above expectations. Recommend 10/10.',
    rating: '5.0',
  },
  {
    handle: 'zuzana.l',
    role: 'Client',
    location: 'Košice',
    quote: 'Mortgage done in a week. The specialist was responsive, honest about fees, professional.',
    rating: '5.0',
  },
];

export function TestimonialsV2() {
  return (
    <section data-theme="v2" className="relative bg-background py-24" style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl">
          <div className="mb-3 flex items-center gap-3 text-xs font-mono text-muted-foreground" style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}>
            <Terminal className="h-3 w-3" />
            ~/reviews --verified --limit 4
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Real clients. <span className="text-primary">Real results.</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.handle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg sm:p-8"
            >
              {/* Terminal-style header */}
              <div
                className="mb-4 flex items-center justify-between border-b border-border/50 pb-3 text-xs text-muted-foreground"
                style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-2">@{q.handle}</span>
                </div>
                <span className="text-primary">★ {q.rating}</span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg leading-relaxed text-foreground">
                {q.quote}
              </blockquote>

              {/* Meta */}
              <div
                className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"
                style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
              >
                <span className="text-primary">//</span>
                <span>{q.role}</span>
                <span>·</span>
                <span>{q.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

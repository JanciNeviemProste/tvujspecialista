'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const QUOTES = [
  {
    quote: 'ZA 3 DNI · 3 OVERENÉ PONUKY · 0 AGENT SPAMU',
    name: 'MARTINA K.',
    location: 'BRATISLAVA',
    color: 'primary',
  },
  {
    quote: 'HYPOTÉKA VYBAVENÁ ZA TÝŽDEŇ. DOPORUČÍM.',
    name: 'ZUZANA L.',
    location: 'KOŠICE',
    color: 'accent',
  },
  {
    quote: 'MAKLÉR MI PREDAL BYT NAD OČAKÁVANÍM.',
    name: 'JANA M.',
    location: 'BRNO',
    color: 'primary',
  },
];

export function TestimonialsV4() {
  return (
    <section
      data-theme="v4"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 inline-block rounded-3xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground"
          style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
        >
          ★ REAL REVIEWS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-foreground"
        >
          LUDIA O NÁS
          <br />
          <span className="text-accent">HOVORIA.</span>
        </motion.h2>

        <div className="space-y-6">
          {QUOTES.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={`relative overflow-hidden rounded-3xl border-4 border-foreground p-8 sm:p-12 ${
                q.color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
              }`}
            >
              <div className="flex items-start gap-6">
                <Quote
                  className={`h-12 w-12 flex-shrink-0 ${q.color === 'primary' ? 'text-accent' : 'text-primary'}`}
                  strokeWidth={3}
                  fill="currentColor"
                />
                <div className="flex-1">
                  <blockquote className="text-2xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    {q.quote}
                  </blockquote>
                  <div
                    className="mt-6 text-xs font-bold uppercase tracking-[0.2em] opacity-80"
                    style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
                  >
                    — {q.name} · {q.location} · ★★★★★
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Star, Clock, Gift, Terminal } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified profiles',
    description: 'ID verification + certificate check for every specialist on the platform.',
    code: 'verified: true',
  },
  {
    icon: Star,
    title: 'Real reviews',
    description: 'Only verified clients can leave reviews. Zero fake ratings.',
    code: 'reviews: verified',
  },
  {
    icon: Zap,
    title: 'Smart matching',
    description: 'Algorithm matches client with specialist based on needs and location.',
    code: 'algorithm: v4.2',
  },
  {
    icon: Clock,
    title: '<24h response',
    description: 'Average first response time. No ghosting, no waiting weeks.',
    code: 'response: ≤24h',
  },
  {
    icon: Gift,
    title: 'Free for clients',
    description: 'Complete search + comparison + contact is 100% free forever.',
    code: 'pricing: 0',
  },
  {
    icon: Terminal,
    title: 'Transparent pricing',
    description: 'Specialist fees are shown upfront. No hidden commissions.',
    code: 'hidden_fees: 0',
  },
];

export function FeaturesGridV2() {
  return (
    <section data-theme="v2" className="relative bg-secondary/30 py-24" style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl">
          <div className="mb-3 flex items-center gap-3 text-xs font-mono text-muted-foreground" style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}>
            <Terminal className="h-3 w-3" />
            ~/features
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Six features. <span className="text-primary">Zero fluff.</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <feature.icon className="h-5 w-5 text-primary" strokeWidth={2.5} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <div
                className="mt-4 inline-block rounded bg-secondary px-2 py-1 text-[10px] text-muted-foreground"
                style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
              >
                {feature.code}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Zap, Clock, Gift, Target } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  { icon: ShieldCheck, title: 'OVERENÍ', desc: 'ID + certifikáty kontrolujeme manuálne.', color: 'primary' },
  { icon: Star, title: 'FÉR REVIEWS', desc: 'Len overení klienti. Žiadne fake.', color: 'accent' },
  { icon: Zap, title: 'RÝCHLOSŤ', desc: 'Algoritmus spáruje za sekundy.', color: 'primary' },
  { icon: Clock, title: '<24 HOD', desc: 'Priemerná odpoveď špecialistu.', color: 'accent' },
  { icon: Gift, title: 'ZDARMA', desc: 'Nula poplatkov pre klientov.', color: 'primary' },
  { icon: Target, title: 'TRANSPARENTNÉ', desc: 'Ceny vopred. Žiadne skryté.', color: 'accent' },
];

export function FeaturesV4() {
  return (
    <section
      data-theme="v4"
      className="relative bg-secondary/30 py-24 sm:py-32"
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 inline-block rounded-3xl bg-foreground px-6 py-3 text-sm font-black uppercase tracking-wider text-background"
          style={{ fontFamily: 'var(--font-v4-mono), ui-monospace, monospace' }}
        >
          6 REASONS →
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-foreground"
        >
          PREČO <span className="italic text-primary">MY?</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className={`group relative overflow-hidden rounded-3xl border-4 border-foreground p-6 transition-all hover:-translate-y-1 sm:p-8 ${
                feature.color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
              }`}
            >
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                  feature.color === 'primary' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                }`}
              >
                <feature.icon className="h-7 w-7" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{feature.title}</h3>
              <p className="mt-3 text-sm font-semibold opacity-80">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

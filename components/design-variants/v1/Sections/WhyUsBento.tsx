'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Gift, Zap, Clock, Users } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Overené profily',
    description: 'Každý špecialista prešiel ID verifikáciou a kontrolou certifikátov.',
    size: 'col-span-12 md:col-span-6 row-span-2',
    color: 'primary',
    featured: true,
  },
  {
    icon: Star,
    title: 'Reálne recenzie',
    description: 'Žiadne fake hodnotenia — iba od ľudí ktorí reálne využili službu.',
    size: 'col-span-12 sm:col-span-6 md:col-span-3',
    color: 'accent',
  },
  {
    icon: Gift,
    title: 'Zdarma pre klientov',
    description: 'Kompletné vyhľadávanie a porovnanie je úplne bezplatné.',
    size: 'col-span-12 sm:col-span-6 md:col-span-3',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Smart matching',
    description: 'Algoritmus nájde najvhodnejšieho špecialistu pre vaše potreby.',
    size: 'col-span-12 sm:col-span-6 md:col-span-3',
    color: 'accent',
  },
  {
    icon: Clock,
    title: 'Do 24 hodín',
    description: 'Priemerná odpoveď špecialistu. Žiadne týždne čakania.',
    size: 'col-span-12 sm:col-span-6 md:col-span-3',
    color: 'primary',
  },
];

export function WhyUsBentoV1() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Prečo my
          </div>
          <h2 className="text-balance text-display-3 font-bold tracking-tight text-foreground">
            Marketplace postavený{' '}
            <span className="text-serif-italic font-normal text-primary">na dôvere.</span>
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Päť vecí, ktoré nás odlišujú od iných marketplace.
          </p>
        </motion.div>

        <div className="bento-grid">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className={`${feature.size} relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevation-2 transition-all duration-500 hover:shadow-elevation-4 sm:p-8`}
            >
              {feature.featured && (
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl" />
              )}

              <div className="relative z-10 flex h-full flex-col">
                <div
                  className={`mb-5 inline-flex items-center justify-center ${
                    feature.featured ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl'
                  } ${
                    feature.color === 'primary'
                      ? 'bg-gradient-to-br from-primary to-primary/70 shadow-indigo'
                      : 'bg-gradient-to-br from-accent to-accent/70 shadow-premium'
                  }`}
                >
                  <feature.icon className={`${feature.featured ? 'h-6 w-6' : 'h-5 w-5'} text-white`} strokeWidth={2.5} />
                </div>

                <h3
                  className={`${
                    feature.featured ? 'text-2xl sm:text-3xl' : 'text-lg'
                  } font-bold tracking-tight text-foreground`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${feature.featured ? 'mt-3 text-base' : 'mt-2 text-sm'} leading-relaxed text-muted-foreground`}
                >
                  {feature.description}
                </p>

                {feature.featured && (
                  <div className="mt-auto pt-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                      <Users className="h-4 w-4" strokeWidth={2.5} />
                      2 500+ overených špecialistov
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

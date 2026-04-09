'use client';

import { useTranslations } from 'next-intl';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, Users, Award, Sparkles, Target, Clock } from 'lucide-react';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export function BentoStats() {
  const t = useTranslations('home.v2.stats');

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('eyebrow')}
          </div>
          <h2 className="text-balance text-display-3 font-bold tracking-tight text-foreground">
            {t.rich('title', {
              serif: (chunks) => (
                <span className="text-serif-italic font-normal text-primary">{chunks}</span>
              ),
            })}
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">{t('subtitle')}</p>
        </motion.div>

        {/* Bento grid — 12 col asymmetric */}
        <div className="bento-grid">
          {/* Featured stat — large left */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeIn}
            className="col-span-12 row-span-2 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevation-2 transition-shadow duration-500 hover:shadow-elevation-4 md:col-span-6 md:p-10"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-indigo">
                <Users className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="text-display-2 font-bold leading-none tracking-tight text-foreground">
                  <AnimatedCounter target={t('featured.value')} />
                </div>
                <div className="mt-3 text-base font-semibold text-foreground">
                  {t('featured.label')}
                </div>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {t('featured.description')}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                <TrendingUp className="h-4 w-4" />
                {t('featured.trend')}
              </div>
            </div>

            {/* Decorative gradient orb */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl" />
          </motion.div>

          {/* Smaller stats */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeIn}
            className="col-span-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevation-2 transition-shadow duration-500 hover:shadow-elevation-3 md:col-span-3"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Award className="h-5 w-5 text-accent" strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <AnimatedCounter target={t('cell1.value')} />
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">{t('cell1.label')}</div>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeIn}
            className="col-span-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevation-2 transition-shadow duration-500 hover:shadow-elevation-3 md:col-span-3"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <AnimatedCounter target={t('cell2.value')} />
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">{t('cell2.label')}</div>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeIn}
            className="col-span-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevation-2 transition-shadow duration-500 hover:shadow-elevation-3 md:col-span-3"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <AnimatedCounter target={t('cell3.value')} />
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">{t('cell3.label')}</div>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeIn}
            className="col-span-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevation-2 transition-shadow duration-500 hover:shadow-elevation-3 md:col-span-3"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <AnimatedCounter target={t('cell4.value')} />
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">{t('cell4.label')}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

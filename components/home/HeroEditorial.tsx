'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Search, Star, ShieldCheck } from 'lucide-react';
import { SpecialistCardV2 } from '@/components/shared/SpecialistCardV2';

const heroPreviewSpecialist = {
  slug: 'eva-novakova',
  name: 'Eva Nováková',
  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  verified: true,
  topSpecialist: true,
  category: 'Finanční poradkyně',
  location: 'Praha',
  rating: 4.9,
  reviewsCount: 127,
  bio: 'Specializace na hypotéky a investice pro mladé rodiny. 12 let zkušeností.',
};

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export function HeroEditorial() {
  const t = useTranslations('home.v2.hero');

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10 gradient-mesh" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />

      {/* Floating decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-mesh-drift" />
      <div className="pointer-events-none absolute -right-32 top-64 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-[120px] animate-mesh-drift" style={{ animationDelay: '7s' }} />

      <div className="container mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT — Editorial copy (60%) */}
          <div className="lg:col-span-7 lg:pr-4">
            {/* Eyebrow */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('eyebrow')}
            </motion.div>

            {/* Headline — mixed serif + sans */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-balance text-display-2 font-bold tracking-tight text-foreground lg:text-display-1"
            >
              {t.rich('title', {
                serif: (chunks) => (
                  <span className="text-serif-italic font-normal text-primary">
                    {chunks}
                  </span>
                ),
              })}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/hledat"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-elevation-3 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5"
              >
                <Search className="h-4 w-4" />
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/profi/registrace"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-7 py-4 text-base font-semibold text-foreground backdrop-blur-md transition-all hover:bg-background hover:-translate-y-0.5"
              >
                {t('ctaSecondary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <div className="flex items-center gap-3">
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-muted"
                      style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">{t('trustNumber')}</div>
                  <div className="text-xs text-muted-foreground">{t('trustLabel')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" strokeWidth={0} />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">4.9</span>
                  <span className="text-muted-foreground"> · {t('reviewsLabel')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="font-medium text-foreground">{t('verifiedLabel')}</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Floating specialist preview card (40%) */}
          <div className="relative lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: EASE_OUT_EXPO }}
              className="relative mx-auto w-full max-w-[380px] px-2 sm:px-0 lg:max-w-none lg:px-4"
            >
              {/* Floating chip — rating (top right, outside card) */}
              <motion.div
                initial={{ opacity: 0, y: -16, x: 16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="absolute right-0 top-6 z-20 hidden lg:block"
              >
                <div className="glass-premium animate-float rounded-2xl px-4 py-3 shadow-elevation-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
                      <Star className="h-4 w-4 fill-accent text-accent" strokeWidth={0} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold leading-none text-foreground">4.9</span>
                        <span className="text-xs text-muted-foreground">/ 5</span>
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('chipReviews')}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating chip — verified (bottom left, outside card) */}
              <motion.div
                initial={{ opacity: 0, y: 16, x: -16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="absolute -bottom-4 left-0 z-20 hidden lg:block"
                style={{ animationDelay: '2s' }}
              >
                <div className="glass-premium animate-float rounded-2xl px-4 py-3 shadow-elevation-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                      <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-sm font-bold leading-none text-foreground">
                        {t('chipVerified')}
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('chipVerifiedSub')}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <SpecialistCardV2 specialist={heroPreviewSpecialist} tilt />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

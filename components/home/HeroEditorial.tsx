'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Search, Star, ShieldCheck } from 'lucide-react';
import { SpecialistCardV2 } from '@/components/shared/SpecialistCardV2';
import { EditableText } from '@/components/editor/EditableText';

const PREVIEW_PHOTO = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80';

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
  const tPreview = useTranslations('home.v2.hero.preview');

  const heroPreviewSpecialist = {
    slug: 'eva-novakova',
    name: tPreview('name'),
    photo: PREVIEW_PHOTO,
    verified: true,
    topSpecialist: true,
    category: tPreview('category'),
    location: tPreview('location'),
    rating: 4.9,
    reviewsCount: 127,
    bio: tPreview('bio'),
  };

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
              <EditableText tKey="home.v2.hero.eyebrow">{t('eyebrow')}</EditableText>
            </motion.div>

            {/* Headline — mixed serif + sans */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-balance text-display-2 font-bold tracking-tight text-foreground lg:text-display-1"
            >
              <EditableText
                tKey="home.v2.hero.title"
                rawValue={(t.raw('title') as string).replace(/<serif>(.*?)<\/serif>/g, '[$1]')}
              >
              {t.rich('title', {
                serif: (chunks) => (
                  <span className="text-serif-italic font-normal text-primary">
                    {chunks}
                  </span>
                ),
              })}
              </EditableText>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              <EditableText tKey="home.v2.hero.subtitle">{t('subtitle')}</EditableText>
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
                <EditableText tKey="home.v2.hero.ctaPrimary">{t('ctaPrimary')}</EditableText>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/profi/registrace"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-7 py-4 text-base font-semibold text-foreground backdrop-blur-md transition-all hover:bg-background hover:-translate-y-0.5"
              >
                <EditableText tKey="home.v2.hero.ctaSecondary">{t('ctaSecondary')}</EditableText>
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
                {/* Avatar stack — real specialist photos from pexels (whitelisted in next.config) */}
                <div className="flex -space-x-2">
                  {[
                    {
                      src: 'https://images.pexels.com/photos/5060991/pexels-photo-5060991.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
                      alt: 'Jan Novák',
                    },
                    {
                      src: 'https://images.pexels.com/photos/7550900/pexels-photo-7550900.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
                      alt: 'Petra Svobodová',
                    },
                    {
                      src: 'https://images.pexels.com/photos/7648248/pexels-photo-7648248.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
                      alt: 'Martin Dvořák',
                    },
                    {
                      src: 'https://images.pexels.com/photos/7222279/pexels-photo-7222279.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
                      alt: 'Jana Horáková',
                    },
                  ].map((avatar) => (
                    <div
                      key={avatar.alt}
                      className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-muted"
                    >
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        fill
                        sizes="36px"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">
                    <EditableText tKey="home.v2.hero.trustNumber">{t('trustNumber')}</EditableText>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <EditableText tKey="home.v2.hero.trustLabel">{t('trustLabel')}</EditableText>
                  </div>
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
                  <span className="text-muted-foreground"> · <EditableText tKey="home.v2.hero.reviewsLabel">{t('reviewsLabel')}</EditableText></span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="font-medium text-foreground">
                  <EditableText tKey="home.v2.hero.verifiedLabel">{t('verifiedLabel')}</EditableText>
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Specialist preview card (40%) */}
          <div className="relative lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: EASE_OUT_EXPO }}
              className="relative mx-auto w-full max-w-[380px] px-2 sm:px-0 lg:max-w-none lg:px-4"
            >
              <SpecialistCardV2 specialist={heroPreviewSpecialist} tilt />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PremiumHeader } from '@/components/layout/PremiumHeader';
import { HeroEditorial } from '@/components/home/HeroEditorial';
import { LogoMarquee } from '@/components/home/LogoMarquee';
import { BentoStats } from '@/components/home/BentoStats';
import { FAQ } from '@/components/home/FAQ';
import { TestimonialCard } from '@/components/home/TestimonialCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { StaggerGrid, StaggerItem } from '@/components/shared/StaggerGrid';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { EditableText } from '@/components/editor/EditableText';
import {
  ShieldAlert,
  Clock,
  Coins,
  Search,
  Users,
  Send,
  Briefcase,
  Home,
  ShieldCheck,
  Star,
  Gift,
  Unlock,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function HomePageClient() {
  const t = useTranslations('home');
  const nav = useTranslations('common.nav');
  const footer = useTranslations('common.footer');

  const faqItems = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
  ];

  const testimonials = [
    {
      quote: t('testimonials.items.t1.quote'),
      name: t('testimonials.items.t1.name'),
      location: t('testimonials.items.t1.location'),
      rating: t('testimonials.items.t1.rating'),
    },
    {
      quote: t('testimonials.items.t2.quote'),
      name: t('testimonials.items.t2.name'),
      location: t('testimonials.items.t2.location'),
      rating: t('testimonials.items.t2.rating'),
    },
    {
      quote: t('testimonials.items.t3.quote'),
      name: t('testimonials.items.t3.name'),
      location: t('testimonials.items.t3.location'),
      rating: t('testimonials.items.t3.rating'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      <main id="main-content">
        {/* 1. HERO — Editorial asymmetric */}
        <HeroEditorial />

        {/* 2. LOGO MARQUEE — Trust strip */}
        <LogoMarquee />

        {/* 3. BENTO STATS */}
        <BentoStats />

        {/* 4. PROBLEM */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.problem.title">{t('problem.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  <EditableText tKey="home.problem.subtitle">{t('problem.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20">
                    <ShieldAlert className="h-7 w-7 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.problem.trust.title">{t('problem.trust.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.problem.trust.description">{t('problem.trust.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20">
                    <Clock className="h-7 w-7 text-orange-500 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.problem.time.title">{t('problem.time.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.problem.time.description">{t('problem.time.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                    <Coins className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.problem.fees.title">{t('problem.fees.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.problem.fees.description">{t('problem.fees.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.howItWorks.title">{t('howItWorks.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground">
                  <EditableText tKey="home.howItWorks.subtitle">{t('howItWorks.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 transition-transform duration-300 hover:scale-110">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div className="mb-3 flex justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.howItWorks.step1.title">{t('howItWorks.step1.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.howItWorks.step1.description">{t('howItWorks.step1.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 transition-transform duration-300 hover:scale-110">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div className="mb-3 flex justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.howItWorks.step2.title">{t('howItWorks.step2.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.howItWorks.step2.description">{t('howItWorks.step2.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 transition-transform duration-300 hover:scale-110">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <div className="mb-3 flex justify-center">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    <EditableText tKey="home.howItWorks.step3.title">{t('howItWorks.step3.title')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <EditableText tKey="home.howItWorks.step3.description">{t('howItWorks.step3.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
            <ScrollReveal delay={0.3}>
              <div className="text-center mt-10">
                <Link
                  href="/hledat"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-indigo"
                >
                  <EditableText tKey="home.howItWorks.cta">{t('howItWorks.cta')}</EditableText>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. CATEGORIES */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.categories.title">{t('categories.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  <EditableText tKey="home.categories.subtitle">{t('categories.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <Link
                  href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce"
                  className="group block rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    <EditableText tKey="home.categories.financialAdvisor">{t('categories.financialAdvisor')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    <EditableText tKey="home.categories.financialAdvisorDesc">{t('categories.financialAdvisorDesc')}</EditableText>
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.financialAdvisorFeatures.mortgages">{t('categories.financialAdvisorFeatures.mortgages')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.financialAdvisorFeatures.insurance">{t('categories.financialAdvisorFeatures.insurance')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.financialAdvisorFeatures.investments">{t('categories.financialAdvisorFeatures.investments')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.financialAdvisorFeatures.loans">{t('categories.financialAdvisorFeatures.loans')}</EditableText>
                    </li>
                  </ul>
                  <div className="text-sm font-medium text-primary group-hover:underline">
                    <EditableText tKey="home.categories.showSpecialists">{t('categories.showSpecialists')}</EditableText>
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link
                  href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99"
                  className="group block rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 transition-transform duration-300 group-hover:scale-110">
                    <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    <EditableText tKey="home.categories.realEstateAgent">{t('categories.realEstateAgent')}</EditableText>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    <EditableText tKey="home.categories.realEstateAgentDesc">{t('categories.realEstateAgentDesc')}</EditableText>
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.realEstateAgentFeatures.sale">{t('categories.realEstateAgentFeatures.sale')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.realEstateAgentFeatures.purchase">{t('categories.realEstateAgentFeatures.purchase')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.realEstateAgentFeatures.rental">{t('categories.realEstateAgentFeatures.rental')}</EditableText>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <EditableText tKey="home.categories.realEstateAgentFeatures.commercial">{t('categories.realEstateAgentFeatures.commercial')}</EditableText>
                    </li>
                  </ul>
                  <div className="text-sm font-medium text-primary group-hover:underline">
                    <EditableText tKey="home.categories.showSpecialists">{t('categories.showSpecialists')}</EditableText>
                  </div>
                </Link>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.testimonials.title">{t('testimonials.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground">
                  <EditableText tKey="home.testimonials.subtitle">{t('testimonials.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {testimonials.map((item, i) => (
                <StaggerItem key={i}>
                  <TestimonialCard
                    quote={item.quote}
                    name={item.name}
                    location={item.location}
                    rating={item.rating}
                    verifiedLabel={t('testimonials.verifiedClient')}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* 6. BENEFITS */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.benefits.title">{t('benefits.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  <EditableText tKey="home.benefits.subtitle">{t('benefits.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    <EditableText tKey="home.benefits.verified.title">{t('benefits.verified.title')}</EditableText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <EditableText tKey="home.benefits.verified.description">{t('benefits.verified.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                    <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    <EditableText tKey="home.benefits.reviews.title">{t('benefits.reviews.title')}</EditableText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <EditableText tKey="home.benefits.reviews.description">{t('benefits.reviews.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20">
                    <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    <EditableText tKey="home.benefits.free.title">{t('benefits.free.title')}</EditableText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <EditableText tKey="home.benefits.free.description">{t('benefits.free.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-card border border-border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20">
                    <Unlock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    <EditableText tKey="home.benefits.noStrings.title">{t('benefits.noStrings.title')}</EditableText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <EditableText tKey="home.benefits.noStrings.description">{t('benefits.noStrings.description')}</EditableText>
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* 7. STATS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
                <EditableText tKey="home.stats.title">{t('stats.title')}</EditableText>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    <AnimatedCounter target={t('stats.specialistsCount')} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <EditableText tKey="home.stats.specialists">{t('stats.specialists')}</EditableText>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    <AnimatedCounter target={t('stats.customersCount')} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <EditableText tKey="home.stats.customers">{t('stats.customers')}</EditableText>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    <AnimatedCounter target={t('stats.successRateValue')} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <EditableText tKey="home.stats.successRate">{t('stats.successRate')}</EditableText>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    <AnimatedCounter target={t('stats.avgRatingValue')} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <EditableText tKey="home.stats.avgRating">{t('stats.avgRating')}</EditableText>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 8. CTA SPECIALIST */}
        <section className="relative overflow-hidden bg-foreground py-20 sm:py-28">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                <EditableText tKey="home.ctaSpecialist.title">{t('ctaSpecialist.title')}</EditableText>
              </h2>
              <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
                <EditableText tKey="home.ctaSpecialist.subtitle">{t('ctaSpecialist.subtitle')}</EditableText>
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-sm text-background/80">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span><EditableText tKey="home.ctaSpecialist.benefit1">{t('ctaSpecialist.benefit1')}</EditableText></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span><EditableText tKey="home.ctaSpecialist.benefit2">{t('ctaSpecialist.benefit2')}</EditableText></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span><EditableText tKey="home.ctaSpecialist.benefit3">{t('ctaSpecialist.benefit3')}</EditableText></span>
                </div>
              </div>
              <Link
                href="/profi/registrace"
                className="inline-flex items-center gap-2 rounded-lg bg-background px-8 py-3.5 text-base font-semibold text-foreground hover:bg-background/90 transition-all shadow-elevation-3 hover:-translate-y-0.5 hover:shadow-elevation-5"
              >
                <EditableText tKey="home.ctaSpecialist.button">{t('ctaSpecialist.button')}</EditableText>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  <EditableText tKey="home.faq.title">{t('faq.title')}</EditableText>
                </h2>
                <p className="text-lg text-muted-foreground">
                  <EditableText tKey="home.faq.subtitle">{t('faq.subtitle')}</EditableText>
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <FAQ items={faqItems} />
            </ScrollReveal>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                <EditableText tKey="home.finalCta.title">{t('finalCta.title')}</EditableText>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                <EditableText tKey="home.finalCta.subtitle">{t('finalCta.subtitle')}</EditableText>
              </p>
              <Link
                href="/hledat"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-indigo hover:-translate-y-0.5 hover:shadow-indigo-lg"
              >
                <Search className="h-5 w-5" />
                <EditableText tKey="home.finalCta.button">{t('finalCta.button')}</EditableText>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold dark:text-foreground">tvujspecialista.cz</h3>
              <p className="text-sm text-muted-foreground"><EditableText tKey="common.footer.description">{footer('description')}</EditableText></p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground"><EditableText tKey="common.footer.forCustomers">{footer('forCustomers')}</EditableText></h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/hledat" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.nav.searchSpecialist">{nav('searchSpecialist')}</EditableText></Link></li>
                <li><Link href="/o-nas" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.footer.aboutUs">{footer('aboutUs')}</EditableText></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground"><EditableText tKey="common.footer.forSpecialists">{footer('forSpecialists')}</EditableText></h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/profi/dashboard/ceny" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.nav.pricing">{nav('pricing')}</EditableText></Link></li>
                <li><Link href="/profi/prihlaseni" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.footer.login">{footer('login')}</EditableText></Link></li>
                <li><Link href="/profi/registrace" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.footer.registration">{footer('registration')}</EditableText></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground"><EditableText tKey="common.footer.legalInfo">{footer('legalInfo')}</EditableText></h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pravidla" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.footer.rules">{footer('rules')}</EditableText></Link></li>
                <li><Link href="/ochrana-osobnich-udaju" className="text-muted-foreground hover:text-primary transition-colors"><EditableText tKey="common.footer.privacy">{footer('privacy')}</EditableText></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t dark:border-border pt-8 text-center text-sm text-muted-foreground">
            {footer('copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}

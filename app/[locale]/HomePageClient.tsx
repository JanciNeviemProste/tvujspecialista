'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { FAQ } from '@/components/home/FAQ';
import { TestimonialCard } from '@/components/home/TestimonialCard';
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
  CheckCircle,
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
    <div className="min-h-screen bg-white dark:bg-background">
      <PublicHeader />

      <main id="main-content">
        {/* 1. HERO */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-background dark:via-background dark:to-muted/30 py-20 sm:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-foreground max-w-4xl mx-auto leading-tight">
              {t('hero.title')}
            </h1>
            <p className="mb-10 text-lg sm:text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="/hledat"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors shadow-lg shadow-blue-600/25"
              >
                <Search className="h-5 w-5" />
                {t('hero.cta')}
              </Link>
              <Link
                href="/profi/registrace"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-card px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted transition-colors"
              >
                {t('hero.ctaSpecialist')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-sm text-gray-500 dark:text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{t('hero.trustVerified')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{t('hero.trustClients')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{t('hero.trustFree')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROBLEM */}
        <section className="bg-gray-50 dark:bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('problem.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
                {t('problem.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 sm:p-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20">
                  <ShieldAlert className="h-7 w-7 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('problem.trust.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('problem.trust.description')}
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 sm:p-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20">
                  <Clock className="h-7 w-7 text-orange-500 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('problem.time.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('problem.time.description')}
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 sm:p-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                  <Coins className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('problem.fees.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('problem.fees.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground">
                {t('howItWorks.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-primary/20">
                  <span className="text-xl font-bold text-blue-600 dark:text-primary">1</span>
                </div>
                <div className="mb-3 flex justify-center">
                  <Search className="h-6 w-6 text-blue-600 dark:text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('howItWorks.step1.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('howItWorks.step1.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-primary/20">
                  <span className="text-xl font-bold text-blue-600 dark:text-primary">2</span>
                </div>
                <div className="mb-3 flex justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('howItWorks.step2.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('howItWorks.step2.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-primary/20">
                  <span className="text-xl font-bold text-blue-600 dark:text-primary">3</span>
                </div>
                <div className="mb-3 flex justify-center">
                  <Send className="h-6 w-6 text-blue-600 dark:text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('howItWorks.step3.title')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <Link
                href="/hledat"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors"
              >
                {t('howItWorks.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. CATEGORIES */}
        <section className="bg-gray-50 dark:bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('categories.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
                {t('categories.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <Link
                href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce"
                className="group rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-primary/50"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-primary/10">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('categories.financialAdvisor')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                  {t('categories.financialAdvisorDesc')}
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.financialAdvisorFeatures.mortgages')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.financialAdvisorFeatures.insurance')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.financialAdvisorFeatures.investments')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.financialAdvisorFeatures.loans')}
                  </li>
                </ul>
                <div className="text-sm font-medium text-blue-600 dark:text-primary group-hover:underline">
                  {t('categories.showSpecialists')}
                </div>
              </Link>
              <Link
                href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99"
                className="group rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-primary/50"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('categories.realEstateAgent')}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                  {t('categories.realEstateAgentDesc')}
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.realEstateAgentFeatures.sale')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.realEstateAgentFeatures.purchase')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.realEstateAgentFeatures.rental')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {t('categories.realEstateAgentFeatures.commercial')}
                  </li>
                </ul>
                <div className="text-sm font-medium text-blue-600 dark:text-primary group-hover:underline">
                  {t('categories.showSpecialists')}
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('testimonials.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground">
                {t('testimonials.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {testimonials.map((item, i) => (
                <TestimonialCard
                  key={i}
                  quote={item.quote}
                  name={item.name}
                  location={item.location}
                  rating={item.rating}
                  verifiedLabel={t('testimonials.verifiedClient')}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 6. BENEFITS */}
        <section className="bg-gray-50 dark:bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('benefits.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
                {t('benefits.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-primary" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('benefits.verified.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {t('benefits.verified.description')}
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                  <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('benefits.reviews.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {t('benefits.reviews.description')}
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20">
                  <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('benefits.free.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {t('benefits.free.description')}
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20">
                  <Unlock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground mb-2">
                  {t('benefits.noStrings.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {t('benefits.noStrings.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. STATS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground text-center mb-12">
              {t('stats.title')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary mb-1">
                  {t('stats.specialistsCount')}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  {t('stats.specialists')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary mb-1">
                  {t('stats.customersCount')}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  {t('stats.customers')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary mb-1">
                  {t('stats.successRateValue')}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  {t('stats.successRate')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary mb-1">
                  {t('stats.avgRatingValue')}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  {t('stats.avgRating')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CTA SPECIALIST */}
        <section className="bg-blue-600 dark:bg-primary py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('ctaSpecialist.title')}
            </h2>
            <p className="text-lg text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              {t('ctaSpecialist.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{t('ctaSpecialist.benefit1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{t('ctaSpecialist.benefit2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{t('ctaSpecialist.benefit3')}</span>
              </div>
            </div>
            <Link
              href="/profi/registrace"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-600 dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              {t('ctaSpecialist.button')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                {t('faq.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground">
                {t('faq.subtitle')}
              </p>
            </div>
            <FAQ items={faqItems} />
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="bg-gray-50 dark:bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t('finalCta.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('finalCta.subtitle')}
            </p>
            <Link
              href="/hledat"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors shadow-lg shadow-blue-600/25"
            >
              <Search className="h-5 w-5" />
              {t('finalCta.button')}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold dark:text-foreground">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">{footer('description')}</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">{footer('forCustomers')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/hledat" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{nav('searchSpecialist')}</Link></li>
                <li><Link href="/o-nas" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{footer('aboutUs')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">{footer('forSpecialists')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ceny" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{nav('pricing')}</Link></li>
                <li><Link href="/profi/prihlaseni" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{footer('login')}</Link></li>
                <li><Link href="/profi/registrace" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{footer('registration')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">{footer('legalInfo')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pravidla" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{footer('rules')}</Link></li>
                <li><Link href="/ochrana-osobnich-udaju" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">{footer('privacy')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t dark:border-border pt-8 text-center text-sm text-gray-600 dark:text-muted-foreground">
            {footer('copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}

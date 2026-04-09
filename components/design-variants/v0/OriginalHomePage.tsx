'use client';

/**
 * V0 — Original homepage (pre-redesign snapshot).
 * Content extracted from git commit 0f57dc8f — the pristine homepage state
 * before the Trusted Authority redesign. Preserved verbatim (hardcoded blue/gray
 * classes included) so V0 shows the genuine "before" state to reviewers.
 *
 * Uses the real PublicHeader component to give V0 full authentic pre-redesign
 * navigation experience (ThemeToggle, LocaleSwitcher, "Jsem specialista"
 * dropdown, MobileNav, NotificationBell). DesignSwitcher at bottom handles
 * variant navigation; PublicHeader handles site navigation — no conflict.
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { FAQ } from '@/components/home/FAQ';
import { TestimonialCard } from '@/components/home/TestimonialCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { StaggerGrid, StaggerItem } from '@/components/shared/StaggerGrid';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
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

export function OriginalHomePage() {
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
    <div className="min-h-screen bg-white dark:bg-neutral-950" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Real PublicHeader — authentic pre-redesign navigation */}
      <PublicHeader />

      <main id="main-content">
        {/* 1. HERO */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 sm:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
              {t('hero.title')}
            </h1>
            <p className="mb-10 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="/hledat"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                <Search className="h-5 w-5" />
                {t('hero.cta')}
              </Link>
              <Link
                href="/profi/registrace"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
              >
                {t('hero.ctaSpecialist')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-sm text-gray-500 dark:text-gray-400">
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
        <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('problem.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('problem.subtitle')}
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20">
                    <ShieldAlert className="h-7 w-7 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('problem.trust.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {t('problem.trust.description')}
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20">
                    <Clock className="h-7 w-7 text-orange-500 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('problem.time.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {t('problem.time.description')}
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
                    <Coins className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('problem.fees.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {t('problem.fees.description')}
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('howItWorks.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('howItWorks.subtitle')}
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { num: '1', icon: Search, title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.description') },
                { num: '2', icon: Users, title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.description') },
                { num: '3', icon: Send, title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.description') },
              ].map((step) => (
                <StaggerItem key={step.num}>
                  <div className="text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 transition-transform duration-300 hover:scale-110">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{step.num}</span>
                    </div>
                    <div className="mb-3 flex justify-center">
                      <step.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <ScrollReveal delay={0.3}>
              <div className="text-center mt-10">
                <Link
                  href="/hledat"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t('howItWorks.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. CATEGORIES */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('categories.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('categories.subtitle')}
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <Link
                  href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce"
                  className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/40 transition-transform duration-300 group-hover:scale-110">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('categories.financialAdvisor')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t('categories.financialAdvisorDesc')}
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.financialAdvisorFeatures.mortgages')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.financialAdvisorFeatures.insurance')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.financialAdvisorFeatures.investments')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.financialAdvisorFeatures.loans')}</li>
                  </ul>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                    {t('categories.showSpecialists')}
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link
                  href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99"
                  className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 transition-transform duration-300 group-hover:scale-110">
                    <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('categories.realEstateAgent')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t('categories.realEstateAgentDesc')}
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.realEstateAgentFeatures.sale')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.realEstateAgentFeatures.purchase')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.realEstateAgentFeatures.rental')}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{t('categories.realEstateAgentFeatures.commercial')}</li>
                  </ul>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                    {t('categories.showSpecialists')}
                  </div>
                </Link>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('testimonials.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('testimonials.subtitle')}
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
        <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('benefits.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('benefits.subtitle')}
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: ShieldCheck, bg: 'bg-blue-50 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400', title: t('benefits.verified.title'), desc: t('benefits.verified.description') },
                { icon: Star, bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-500 dark:text-yellow-400', title: t('benefits.reviews.title'), desc: t('benefits.reviews.description') },
                { icon: Gift, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400', title: t('benefits.free.title'), desc: t('benefits.free.description') },
                { icon: Unlock, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600 dark:text-purple-400', title: t('benefits.noStrings.title'), desc: t('benefits.noStrings.description') },
              ].map((b, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full ${b.bg}`}>
                      <b.icon className={`h-6 w-6 ${b.color}`} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{b.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* 7. STATS */}
        <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
                {t('stats.title')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {[
                  { key: 'specialistsCount', label: 'specialists' },
                  { key: 'customersCount', label: 'customers' },
                  { key: 'successRateValue', label: 'successRate' },
                  { key: 'avgRatingValue', label: 'avgRating' },
                ].map((s) => (
                  <div key={s.key} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      <AnimatedCounter target={t(`stats.${s.key}`)} />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {t(`stats.${s.label}`)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 8. CTA SPECIALIST */}
        <section className="bg-blue-600 dark:bg-blue-700 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('ctaSpecialist.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('ctaSpecialist.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-sm text-blue-100">
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /><span>{t('ctaSpecialist.benefit1')}</span></div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /><span>{t('ctaSpecialist.benefit2')}</span></div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /><span>{t('ctaSpecialist.benefit3')}</span></div>
              </div>
              <Link
                href="/profi/registrace"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-600 hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t('ctaSpecialist.button')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4 max-w-3xl">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('faq.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('faq.subtitle')}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <FAQ items={faqItems} />
            </ScrollReveal>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('finalCta.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                {t('finalCta.subtitle')}
              </p>
              <Link
                href="/hledat"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Search className="h-5 w-5" />
                {t('finalCta.button')}
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-gray-900 dark:text-white">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{footer('description')}</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">{footer('forCustomers')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/hledat" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{nav('searchSpecialist')}</Link></li>
                <li><Link href="/o-nas" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{footer('aboutUs')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">{footer('forSpecialists')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/profi/dashboard/ceny" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{nav('pricing')}</Link></li>
                <li><Link href="/profi/prihlaseni" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{footer('login')}</Link></li>
                <li><Link href="/profi/registrace" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{footer('registration')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">{footer('legalInfo')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pravidla" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{footer('rules')}</Link></li>
                <li><Link href="/ochrana-osobnich-udaju" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{footer('privacy')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-300">
            {footer('copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}

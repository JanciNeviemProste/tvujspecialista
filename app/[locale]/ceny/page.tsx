'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { PricingCard } from '@/components/subscriptions/PricingCard';
import { PricingPlan, SubscriptionType } from '@/types/subscriptions';
import { useCreateCheckout, useMyActiveSubscription } from '@/lib/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';

export default function PricingPage() {
  const { user } = useAuth();
  const { data: activeSubscription } = useMyActiveSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(null);
  const t = useTranslations('pricing');
  const tCommon = useTranslations('common');

  const pricingPlans: PricingPlan[] = [
    {
      type: SubscriptionType.MARKETPLACE,
      name: t('plans.monthly.name'),
      description: t('plans.monthly.description'),
      monthlyPrice: 1250,
      features: [
        t('plans.monthly.features.profile'),
        t('plans.monthly.features.catalog'),
        t('plans.monthly.features.leads'),
        t('plans.monthly.features.reviews'),
        t('plans.monthly.features.basicStats'),
        t('plans.monthly.features.emailSupport'),
        t('plans.monthly.features.forumAccess'),
        t('plans.monthly.features.academyCourses'),
      ],
      cta: t('plans.monthly.cta'),
    },
    {
      type: SubscriptionType.PREMIUM,
      name: t('plans.yearly.name'),
      description: t('plans.yearly.description'),
      monthlyPrice: 12500,
      recommended: true,
      features: [
        t('plans.yearly.features.allMonthly'),
        t('plans.yearly.features.savings'),
        t('plans.yearly.features.highlighted'),
        t('plans.yearly.features.analytics'),
        t('plans.yearly.features.prioritySupport'),
        t('plans.yearly.features.webinars'),
        t('plans.yearly.features.events'),
      ],
      cta: t('plans.yearly.cta'),
    },
  ];

  const comparisonFeatures = [
    {
      category: t('comparison.marketplace'),
      features: [
        { name: t('plans.monthly.features.profile'), monthly: true, yearly: true },
        { name: t('plans.monthly.features.catalog'), monthly: true, yearly: true },
        { name: t('plans.monthly.features.leads'), monthly: true, yearly: true },
        { name: t('plans.monthly.features.reviews'), monthly: true, yearly: true },
        { name: t('plans.monthly.features.basicStats'), monthly: true, yearly: true },
        { name: t('plans.yearly.features.highlighted'), monthly: false, yearly: true },
        { name: t('plans.yearly.features.analytics'), monthly: false, yearly: true },
      ],
    },
    {
      category: t('comparison.education'),
      features: [
        { name: t('plans.monthly.features.academyCourses'), monthly: true, yearly: true },
        { name: t('plans.monthly.features.forumAccess'), monthly: true, yearly: true },
        { name: t('comparison.exclusiveWebinars'), monthly: false, yearly: true },
        { name: t('comparison.communityEvents'), monthly: false, yearly: true },
      ],
    },
    {
      category: t('comparison.support'),
      features: [
        { name: t('plans.monthly.features.emailSupport'), monthly: true, yearly: true },
        { name: t('plans.yearly.features.prioritySupport'), monthly: false, yearly: true },
      ],
    },
  ];

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
  ];

  const educationCheckout = useCreateCheckout(SubscriptionType.EDUCATION);
  const marketplaceCheckout = useCreateCheckout(SubscriptionType.MARKETPLACE);
  const premiumCheckout = useCreateCheckout(SubscriptionType.PREMIUM);

  const handleSelectPlan = (type: SubscriptionType) => {
    if (!user) {
      window.location.href = '/prihlasenie?redirect=/ceny';
      return;
    }

    setSelectedPlan(type);

    switch (type) {
      case SubscriptionType.EDUCATION:
        educationCheckout.mutate();
        break;
      case SubscriptionType.MARKETPLACE:
        marketplaceCheckout.mutate();
        break;
      case SubscriptionType.PREMIUM:
        premiumCheckout.mutate();
        break;
    }
  };

  const isLoading = (type: SubscriptionType) => {
    return (
      selectedPlan === type &&
      (educationCheckout.isPending || marketplaceCheckout.isPending || premiumCheckout.isPending)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white dark:from-background to-gray-50 dark:to-muted/30">
      {/* Header */}
      <header className="border-b bg-white dark:bg-card sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
            tvujspecialista.cz
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/hledat" className="text-sm font-medium hover:text-primary transition-colors">
              {tCommon('nav.search')}
            </Link>
            <Link href="/ceny" className="text-sm font-medium text-primary">
              {tCommon('nav.pricing')}
            </Link>
            {user ? (
              <Link href="/profi/dashboard">
                <Button size="sm">{tCommon('nav.dashboard')}</Button>
              </Link>
            ) : (
              <Link href="/profi/registrace">
                <Button size="sm">{tCommon('nav.register')}</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {user ? (
              <Link href="/profi/dashboard">
                <Button size="sm">{tCommon('nav.dashboard')}</Button>
              </Link>
            ) : (
              <Link href="/profi/registrace">
                <Button size="sm">{tCommon('nav.register')}</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-12 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.type}
                plan={plan}
                isRecommended={plan.recommended}
                currentPlan={activeSubscription?.subscriptionType === plan.type}
                onSelectPlan={() => handleSelectPlan(plan.type)}
                isLoading={isLoading(plan.type)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="border-t bg-white dark:bg-background py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-bold">{t('comparison.title')}</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b dark:border-border">
                  <th className="py-4 text-left text-xs sm:text-sm font-semibold">{t('comparison.feature')}</th>
                  <th className="py-4 text-center text-xs sm:text-sm font-semibold">{t('comparison.monthlyLabel')}</th>
                  <th className="py-4 text-center text-xs sm:text-sm font-semibold">{t('comparison.yearlyLabel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-border">
                {comparisonFeatures.map((category) => (
                  <>
                    <tr key={category.category} className="bg-gray-50 dark:bg-muted/30">
                      <td colSpan={3} className="py-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-foreground">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name}>
                        <td className="py-4 text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{feature.name}</td>
                        <td className="py-4 text-center">
                          {feature.monthly ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-gray-300" />
                          )}
                        </td>
                        <td className="py-4 text-center">
                          {feature.yearly ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-gray-300" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">{t('faq.title')}</h2>
          <div className="mx-auto max-w-3xl space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-foreground">{faq.question}</h3>
                <p className="text-gray-600 dark:text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t('cta.title')}</h2>
          <p className="mb-8 text-lg">
            {t('cta.subtitle')}
          </p>
          {!user && (
            <Link href="/profi/registrace">
              <Button size="lg" variant="secondary">
                {t('cta.button')}
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

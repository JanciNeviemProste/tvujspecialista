'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PricingCard } from '@/components/subscriptions/PricingCard';
import { PricingPlan, SubscriptionType } from '@/types/subscriptions';
import { useCreateCheckout, useMyActiveSubscription } from '@/lib/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';

const pricingPlans: PricingPlan[] = [
  {
    type: SubscriptionType.MARKETPLACE,
    name: 'Mesačné členstvo',
    description: 'Plný prístup k platforme na 1 mesiac',
    monthlyPrice: 1250,
    features: [
      'Profil specialistu v marketplace',
      'Zobrazenie v katalógu a vyhľadávaní',
      'Príjem dopytov od klientov',
      'Správa recenzií a hodnotení',
      'Základná štatistika profilu',
      'E-mailová podpora',
      'Prístup ku komunitnému fóru',
      'Kurzy v Academy sekcii',
    ],
    cta: 'Začať za 50 €/mesiac',
  },
  {
    type: SubscriptionType.PREMIUM,
    name: 'Ročné členstvo',
    description: 'Plný prístup za zvýhodnenú cenu — úspora 100 €/rok',
    monthlyPrice: 12500,
    recommended: true,
    features: [
      'Všetko z mesačného plánu',
      'Úspora 100 € oproti mesačnej platbe',
      'Zvýraznený profil vo výsledkoch',
      'Rozšírená analytika a štatistiky',
      'Prioritná podpora',
      'Prístup k exkluzívnym webinárom',
      'Komunitné eventy a networking',
    ],
    cta: 'Získať za 500 €/rok',
  },
];

const comparisonFeatures = [
  {
    category: 'Marketplace',
    features: [
      { name: 'Profil specialistu v marketplace', monthly: true, yearly: true },
      { name: 'Zobrazenie v katalógu a vyhľadávaní', monthly: true, yearly: true },
      { name: 'Príjem dopytov od klientov', monthly: true, yearly: true },
      { name: 'Správa recenzií a hodnotení', monthly: true, yearly: true },
      { name: 'Základná štatistika profilu', monthly: true, yearly: true },
      { name: 'Zvýraznený profil vo výsledkoch', monthly: false, yearly: true },
      { name: 'Rozšírená analytika a štatistiky', monthly: false, yearly: true },
    ],
  },
  {
    category: 'Vzdelávanie a komunita',
    features: [
      { name: 'Kurzy v Academy sekcii', monthly: true, yearly: true },
      { name: 'Prístup ku komunitnému fóru', monthly: true, yearly: true },
      { name: 'Exkluzívne webináre', monthly: false, yearly: true },
      { name: 'Komunitné eventy a networking', monthly: false, yearly: true },
    ],
  },
  {
    category: 'Podpora',
    features: [
      { name: 'E-mailová podpora', monthly: true, yearly: true },
      { name: 'Prioritná podpora', monthly: false, yearly: true },
    ],
  },
];

const faqs = [
  {
    question: 'Môžem zmeniť plán kedykoľvek?',
    answer:
      'Áno, plán môžete kedykoľvek upgradovať alebo downgradovať. Pri upgrade sa rozdiel prepočíta proporcionálne. Pri downgrade zmena nastane na konci aktuálneho billing cyklu.',
  },
  {
    question: 'Ako funguje fakturácia?',
    answer:
      'Všetky plány sú fakturované mesačne. Platba prebieha automaticky cez Stripe na začiatku každého billing obdobia.',
  },
  {
    question: 'Môžem zrušiť predplatné?',
    answer:
      'Áno, predplatné môžete zrušiť kedykoľvek bez viazanosti. Budete mať prístup do konca plateného obdobia.',
  },
  {
    question: 'Aký je rozdiel medzi mesačným a ročným plánom?',
    answer:
      'Ročný plán zahŕňa všetko z mesačného plánu plus exkluzívne bonusy (webináre, VIP podpora, account manager). Navyše ušetríte 100 € ročne oproti mesačnej platbe.',
  },
  {
    question: 'Je možné vyskúšať pred zakúpením?',
    answer:
      'Momentálne neponúkame trial obdobie, ale môžete si zakúpiť ľubovoľný plán a zrušiť ho kedykoľvek bez sankcií.',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { data: activeSubscription } = useMyActiveSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(null);

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
              Hľadať
            </Link>
            <Link href="/ceny" className="text-sm font-medium text-primary">
              Ceny
            </Link>
            {user ? (
              <Link href="/profi/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/profi/registrace">
                <Button size="sm">Registrácia zdarma</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {user ? (
              <Link href="/profi/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/profi/registrace">
                <Button size="sm">Registrácia</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Jednoduché a transparentné ceny
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground">
            Vyberte si plán, ktorý najlepšie vyhovuje vašim potrebám. Začnite hneď, žiadne
            skryté poplatky.
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
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-bold">Porovnanie funkcií</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b dark:border-border">
                  <th className="py-4 text-left text-xs sm:text-sm font-semibold">Funkcia</th>
                  <th className="py-4 text-center text-xs sm:text-sm font-semibold">Mesačné (50 €)</th>
                  <th className="py-4 text-center text-xs sm:text-sm font-semibold">Ročné (500 €)</th>
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
          <h2 className="mb-12 text-center text-3xl font-bold">Často kladené otázky</h2>
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
          <h2 className="mb-4 text-3xl font-bold">Pripravení začať?</h2>
          <p className="mb-8 text-lg">
            Pripojte sa k stovkám profesionálov, ktorí už využívajú našu platformu
          </p>
          {!user && (
            <Link href="/profi/registrace">
              <Button size="lg" variant="secondary">
                Registrovať sa zdarma
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function HomePageClient() {
  const t = useTranslations('home');
  const nav = useTranslations('common.nav');
  const footer = useTranslations('common.footer');

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <PublicHeader />

      <main id="main-content">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-foreground">
              {t('hero.title')}
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-gray-600 dark:text-muted-foreground">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl sm:text-3xl font-bold dark:text-foreground">{t('categories.title')}</h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <Link href="/hledat?category=Finan%C4%8Dn%C3%AD%20poradce" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl" aria-hidden="true">&#x1F4BC;</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">{t('categories.financialAdvisor')}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  {t('categories.financialAdvisorDesc')}
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">{t('categories.showSpecialists')} &rarr;</div>
              </Link>
              <Link href="/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl" aria-hidden="true">&#x1F3E0;</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">{t('categories.realEstateAgent')}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  {t('categories.realEstateAgentDesc')}
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">{t('categories.showSpecialists')} &rarr;</div>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-gray-50 dark:bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">{t('stats.specialistsCount')}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">{t('stats.specialists')}</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">{t('stats.customersCount')}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">{t('stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">{t('stats.successRateValue')}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">{t('stats.successRate')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 dark:bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold">{t('cta.title')}</h2>
            <p className="mb-8 text-lg sm:text-xl">{t('cta.subtitle')}</p>
            <Link href="/profi/registrace" className="inline-block rounded bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-blue-600 dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors">
              {t('cta.button')}
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

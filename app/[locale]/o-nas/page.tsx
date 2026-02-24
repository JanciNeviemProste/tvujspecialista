import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['/og-image.jpg'],
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tCommon = await getTranslations('common');

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <PublicHeader />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">{t('title')}</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('mission.title')}</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {t('mission.description')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('why.title')}</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {t('why.p1')}
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {t('why.p2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('offer.title')}</h2>
            <div className="space-y-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">{t('offer.forCustomers')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>{t('offer.customerFeatures.profiles')}</li>
                  <li>{t('offer.customerFeatures.compare')}</li>
                  <li>{t('offer.customerFeatures.free')}</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">{t('offer.forSpecialists')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>{t('offer.specialistFeatures.leads')}</li>
                  <li>{t('offer.specialistFeatures.profile')}</li>
                  <li>{t('offer.specialistFeatures.tools')}</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('values.title')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">{t('values.transparency')}</strong>
                  <span className="text-gray-700"> {t('values.transparencyDesc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">{t('values.quality')}</strong>
                  <span className="text-gray-700"> {t('values.qualityDesc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">{t('values.simplicity')}</strong>
                  <span className="text-gray-700"> {t('values.simplicityDesc')}</span>
                </div>
              </li>
            </ul>
          </section>

          <section className="rounded-lg bg-blue-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('joinUs.title')}</h2>
            <p className="mb-4 text-gray-700">
              {t('joinUs.description')}
            </p>
            <div className="flex gap-4">
              <Link
                href="/hledat"
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {tCommon('actions.findSpecialist')}
              </Link>
              <Link
                href="/profi/registrace"
                className="rounded-md border border-blue-600 px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {tCommon('actions.becomeSpecialist')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

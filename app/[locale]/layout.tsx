import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Providers } from '../providers';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import { SkipLink } from '@/components/a11y/SkipLink';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    cs: 'Najděte ověřeného specialistu | tvujspecialista.cz',
    sk: 'Nájdite overeného špecialistu | tvujspecialista.cz',
    pl: 'Znajdź zweryfikowanego specjalistę | tvujspecialista.cz',
    en: 'Find a verified specialist | tvujspecialista.cz',
  };

  const descriptions: Record<string, string> = {
    cs: 'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK.',
    sk: 'Marketplace na hľadanie overených špecialistov v oblasti financií a nehnuteľností v ČR a SR.',
    pl: 'Marketplace do wyszukiwania zweryfikowanych specjalistów w dziedzinie finansów i nieruchomości.',
    en: 'Marketplace for finding verified specialists in finance and real estate.',
  };

  return {
    metadataBase: new URL('https://tvujspecialista.cz'),
    title: titles[locale] || titles.cs,
    description: descriptions[locale] || descriptions.cs,
    keywords: ['realitný makléř', 'finanční poradce', 'hypotéky', 'pojištění', 'nemovitosti', 'kurzy', 'Academy', 'Community'],
    authors: [{ name: 'TvujSpecialista.cz' }],
    manifest: '/manifest.json',
    alternates: {
      canonical: `/${locale}`,
      languages: {
        cs: '/cs',
        sk: '/sk',
        pl: '/pl',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'sk' ? 'sk_SK' : locale === 'pl' ? 'pl_PL' : 'en_US',
      url: `https://tvujspecialista.cz/${locale}`,
      siteName: 'TvujSpecialista.cz',
      title: titles[locale] || titles.cs,
      description: descriptions[locale] || descriptions.cs,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TvujSpecialista.cz',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.cs,
      description: descriptions[locale] || descriptions.cs,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SkipLink />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Providers>
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}

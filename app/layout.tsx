import '@/styles/globals.css'
import { Providers } from './providers'
import { Metadata } from 'next'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import { SkipLink } from '@/components/a11y/SkipLink'

export const metadata: Metadata = {
  metadataBase: new URL('https://tvujspecialista.cz'),
  title: 'Najděte ověřeného specialistu | tvujspecialista.cz',
  description: 'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK. Prémiová edu-komunitná platforma pre realitných agentov a finančných poradcov.',
  keywords: ['realitný makléř', 'finanční poradce', 'hypotéky', 'pojištění', 'nemovitosti', 'kurzy', 'Academy', 'Community'],
  authors: [{ name: 'TvujSpecialista.cz' }],
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://tvujspecialista.cz',
    siteName: 'TvujSpecialista.cz',
    title: 'Najděte ověřeného specialistu | tvujspecialista.cz',
    description: 'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK.',
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
    title: 'Najděte ověřeného specialistu | tvujspecialista.cz',
    description: 'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SkipLink />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

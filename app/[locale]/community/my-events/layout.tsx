import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'community' });
  return { title: t('metadata.title'), description: t('metadata.description'), robots: { index: false, follow: false } };
}

export default function MyEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

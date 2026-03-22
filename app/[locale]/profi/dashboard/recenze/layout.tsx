import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.reviews.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

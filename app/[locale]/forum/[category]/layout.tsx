import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forum' });
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

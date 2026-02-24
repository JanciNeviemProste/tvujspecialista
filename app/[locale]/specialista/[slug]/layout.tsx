import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const t = await getTranslations({ locale, namespace: 'specialist.metadata' });
  return {
    title: t('title', { name }),
    description: t('description', { name, category: '', location: '' }),
  };
}

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

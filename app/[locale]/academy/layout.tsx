import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import AcademyLayoutClient from './AcademyLayoutClient';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'academy' });
  return { title: t('metadata.title'), description: t('metadata.description') };
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <AcademyLayoutClient>{children}</AcademyLayoutClient>;
}

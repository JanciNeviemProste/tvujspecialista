import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'academy' });
  return { title: t('metadata.title'), description: t('metadata.description') };
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

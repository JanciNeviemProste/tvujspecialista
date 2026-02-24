import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ForumLayoutClient from './ForumLayoutClient';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forum' });
  return { title: t('metadata.title'), description: t('metadata.description') };
}

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <ForumLayoutClient>{children}</ForumLayoutClient>;
}

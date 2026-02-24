import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register.metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { setRequestLocale } from 'next-intl/server';
import HomePageClient from './HomePageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageClient />;
}

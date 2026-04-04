import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { SpecialistJsonLd } from '@/components/seo/JsonLd';
import SpecialistPageClient from './SpecialistPageClient';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';

export default async function SpecialistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations('specialist');
  const tCommon = await getTranslations('common');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';

  let specialist: SpecialistDetail | null = null;
  try {
    const res = await fetch(`${apiUrl}/specialists/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      specialist = await res.json();
    } else if (res.status === 404) {
      notFound(); // proper 404 HTTP response
    }
    // for other errors (500 etc.), specialist stays null — render error UI below
  } catch {
    // fetch failed — specialist stays null
  }

  if (!specialist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <PublicHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-900">{t('notFound')}</h2>
            <p className="mb-4 text-red-600">
              {t('notFoundDesc')}
            </p>
            <Link
              href="/hledat"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {tCommon('actions.backToSearch')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SpecialistJsonLd specialist={specialist} />
      <SpecialistPageClient specialist={specialist} />
    </>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { academyApi } from '@/lib/api/academy';
import { Award, Download, Printer } from 'lucide-react';
import { use } from 'react';
import { format } from 'date-fns';
import { cs, sk, enUS, pl } from 'date-fns/locale';
import { useLocale } from 'next-intl';

const dateFnsLocaleMap: Record<string, typeof cs> = { cs, sk, en: enUS, pl };

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const t = useTranslations('academy.certificate');
  const locale = useLocale();

  const { data: cert, isLoading, error } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => academyApi.getCertificate(id).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-900">{t('notFound')}</h2>
          <p className="text-red-600">{t('notFoundDesc')}</p>
        </div>
      </div>
    );
  }

  const completedDate = cert.completedAt
    ? format(new Date(cert.completedAt), 'd. MMMM yyyy', { locale: dateFnsLocaleMap[locale] || cs })
    : '';

  const studentName = user?.name || t('student');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Print / Download buttons */}
      <div className="mb-6 flex justify-end gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          {t('print')}
        </button>
      </div>

      {/* Certificate */}
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-4 border-amber-400 bg-white p-8 sm:p-12 shadow-xl print:shadow-none print:border-2">
          {/* Top ornament line */}
          <div className="mb-8 flex justify-center">
            <div className="h-1 w-24 rounded bg-amber-400" />
          </div>

          {/* Award icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
              <Award className="h-10 w-10 text-amber-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mb-8 text-center text-lg text-gray-500">{t('subtitle')}</p>

          {/* Recipient */}
          <div className="mb-8 text-center">
            <p className="mb-1 text-sm uppercase tracking-wider text-gray-500">{t('awardedTo')}</p>
            <p className="text-3xl font-bold text-blue-600 sm:text-4xl">{studentName}</p>
          </div>

          {/* Course info */}
          <div className="mb-8 text-center">
            <p className="mb-1 text-sm uppercase tracking-wider text-gray-500">{t('forCompleting')}</p>
            <p className="text-xl font-semibold text-gray-900">{cert.courseName}</p>
            <p className="mt-1 text-sm text-gray-500">
              {cert.courseLevel} • {cert.courseCategory}
            </p>
          </div>

          {/* Date */}
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-500">
              {t('completedOn', { date: completedDate })}
            </p>
          </div>

          {/* Bottom ornament */}
          <div className="flex justify-center">
            <div className="h-1 w-24 rounded bg-amber-400" />
          </div>

          {/* Platform branding */}
          <p className="mt-6 text-center text-xs text-gray-400">
            tvujspecialista.cz • {t('verifiedCertificate')}
          </p>
        </div>
      </div>
    </div>
  );
}

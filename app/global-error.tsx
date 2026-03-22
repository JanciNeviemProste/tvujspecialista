'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

const messages = {
  cs: { title: 'Něco se pokazilo', description: 'Omlouváme se za potíže.', retry: 'Zkusit znovu', home: 'Zpět na hlavní stránku' },
  sk: { title: 'Niečo sa pokazilo', description: 'Ospravedlňujeme sa za problémy.', retry: 'Skúsiť znova', home: 'Späť na hlavnú stránku' },
  en: { title: 'Something went wrong', description: 'We apologize for the inconvenience.', retry: 'Try again', home: 'Back to homepage' },
  pl: { title: 'Coś poszło nie tak', description: 'Przepraszamy za niedogodności.', retry: 'Spróbuj ponownie', home: 'Powrót na stronę główną' },
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // Detect locale from URL
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const localeMatch = path.match(/^\/(cs|sk|en|pl)\//);
  const locale = (localeMatch?.[1] || 'cs') as keyof typeof messages;
  const t = messages[locale];

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="mb-6 text-gray-600">{t.description}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t.retry}
            </button>
            <a href="/" className="rounded-lg border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
              {t.home}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

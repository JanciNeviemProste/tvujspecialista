'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';

const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  sk: '🇸🇰',
  pl: '🇵🇱',
  en: '🇬🇧',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common.locale');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label={t('switchLanguage')}
      className="rounded-md border border-gray-300 dark:border-border bg-white dark:bg-background dark:text-foreground px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeFlags[loc]} {t(loc)}
        </option>
      ))}
    </select>
  );
}

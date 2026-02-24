'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  sk: '🇸🇰',
  pl: '🇵🇱',
  en: '🇬🇧',
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common.locale');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('switchLanguage')}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-border bg-white dark:bg-background px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted transition-colors"
      >
        <Globe className="h-4 w-4 text-gray-500 dark:text-muted-foreground" />
        <span>{localeFlags[locale]}</span>
        <span className="uppercase text-xs">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95 duration-150">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelect(loc)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                loc === locale
                  ? 'bg-blue-50 dark:bg-primary/10 text-blue-600 dark:text-primary font-medium'
                  : 'text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted'
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span>{t(loc)}</span>
              {loc === locale && (
                <svg className="ml-auto h-4 w-4 text-blue-600 dark:text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

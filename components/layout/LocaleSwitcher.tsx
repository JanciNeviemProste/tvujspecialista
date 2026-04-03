'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

function Flag({ locale, className = 'h-4 w-6' }: { locale: Locale; className?: string }) {
  switch (locale) {
    case 'cs':
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#d7141a" />
          <rect width="640" height="240" fill="#fff" />
          <polygon points="0,0 320,240 0,480" fill="#11457e" />
        </svg>
      );
    case 'sk':
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#ee1c25" />
          <rect width="640" height="320" fill="#0b4ea2" />
          <rect width="640" height="160" fill="#fff" />
          <path d="M233 370.5c-43-20-130-67-130-175 0-108 0-130 0-130h260s0 22 0 130c0 108-87 155-130 175z" fill="#fff" />
          <path d="M233 360c-39-18-118-61-118-160 0-99 0-118 0-118h236s0 19 0 118c0 99-79 142-118 160z" fill="#ee1c25" />
          <path d="M233 82v54h-54v36h54v54h36v-54h54v-36h-54V82z" fill="#fff" />
          <path d="M175 286c16 26 38 46 58 60 20-14 42-34 58-60-19 4-39 6-58 6s-39-2-58-6z" fill="#0b4ea2" />
        </svg>
      );
    case 'pl':
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#dc143c" />
          <rect width="640" height="240" fill="#fff" />
        </svg>
      );
    case 'en':
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#012169" />
          <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" fill="#fff" />
          <path d="M424 281l216 159v40L369 281zM241 301l-6 35L53 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" fill="#c8102e" />
          <path d="M241 0v480h160V0zM0 160v160h640V160z" fill="#fff" />
          <path d="M0 193v96h640v-96zM274 0v480h96V0z" fill="#c8102e" />
        </svg>
      );
  }
}

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
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Globe className="h-4 w-4 text-gray-500" />
        <Flag locale={locale} className="h-3.5 w-5 rounded-[2px]" />
        <span className="uppercase text-xs">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95 duration-150">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelect(loc)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                loc === locale
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Flag locale={loc} className="h-4 w-6 rounded-[2px] flex-shrink-0" />
              <span>{t(loc)}</span>
              {loc === locale && (
                <svg className="ml-auto h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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

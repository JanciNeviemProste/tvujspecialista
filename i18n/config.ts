export const locales = ['cs', 'sk', 'pl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'cs';

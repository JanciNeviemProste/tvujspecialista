import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tvujspecialista.cz';

  // Generate disallow rules for all locales
  const protectedPaths = [
    '/profi/dashboard/',
    '/my-account/',
    '/academy/my-learning/',
    '/academy/learn/',
    '/community/my-events/',
  ];

  const disallow = [
    '/api/',
    ...locales.flatMap((locale) =>
      protectedPaths.map((path) => `/${locale}${path}`)
    ),
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

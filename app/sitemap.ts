import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tvujspecialista.cz';

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/hledat', changeFrequency: 'daily', priority: 0.9 },
    { path: '/ceny', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/kontakt', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/o-nas', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/pravidla', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/ochrana-osobnich-udaju', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/academy', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/academy/courses', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/community', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/community/events', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/profi/prihlaseni', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/profi/registrace', changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Generate URLs for all locales
  const staticEntries = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: locale === defaultLocale ? route.priority : route.priority * 0.9,
    }))
  );

  // Dynamic: specialist profiles
  let specialistEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/specialists?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      specialistEntries = (data.specialists || []).flatMap((s: { slug: string; updatedAt: string }) =>
        locales.map((locale) => ({
          url: `${baseUrl}/${locale}/specialista/${s.slug}`,
          lastModified: new Date(s.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: locale === defaultLocale ? 0.9 : 0.8,
        }))
      );
    }
  } catch {
    // API unavailable — skip dynamic entries
  }

  return [...staticEntries, ...specialistEntries];
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

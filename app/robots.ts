import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tvujspecialista.cz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profi/dashboard/',
          '/my-account/',
          '/academy/my-learning/',
          '/academy/learn/',
          '/community/my-events/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

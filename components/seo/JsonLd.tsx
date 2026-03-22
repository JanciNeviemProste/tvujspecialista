interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const organizationDescriptions = {
  cs: 'Najděte ověřeného finančního specialistu ve vašem okolí.',
  sk: 'Nájdite overeného finančného špecialistu vo vašom okolí.',
  en: 'Find a verified financial specialist in your area.',
  pl: 'Znajdź zweryfikowanego specjalistę finansowego w Twojej okolicy.',
};

export function OrganizationJsonLd({ locale = 'cs' }: { locale?: string }) {
  const description = organizationDescriptions[locale as keyof typeof organizationDescriptions] || organizationDescriptions.cs;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TvujSpecialista.cz',
        url: 'https://tvujspecialista.cz',
        logo: 'https://tvujspecialista.cz/images/icon-512.png',
        description,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Czech', 'Slovak', 'English', 'Polish'],
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TvujSpecialista.cz',
        url: 'https://tvujspecialista.cz',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://tvujspecialista.cz/hledat?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  provider,
  url,
}: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Course',
        name,
        description,
        provider: {
          '@type': 'Organization',
          name: provider,
        },
        url,
      }}
    />
  );
}

export function SpecialistJsonLd({
  specialist,
}: {
  specialist: {
    name: string;
    photo?: string;
    category: string;
    bio: string;
    rating: number;
    reviewsCount: number;
    location: string;
    services: string[];
  };
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: specialist.name,
    image: specialist.photo,
    jobTitle: specialist.category,
    description: specialist.bio?.substring(0, 200),
    areaServed: specialist.location,
    knowsAbout: specialist.services,
  };

  if (specialist.reviewsCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: specialist.rating,
      reviewCount: specialist.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonJsonLd({
  name,
  url,
  jobTitle,
  image,
  rating,
  reviewCount,
}: {
  name: string;
  url: string;
  jobTitle: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        url,
        jobTitle,
        ...(image && { image }),
        ...(rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount: reviewCount || 0,
            bestRating: 5,
          },
        }),
      }}
    />
  );
}

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

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TvujSpecialista.cz',
        url: 'https://tvujspecialista.cz',
        logo: 'https://tvujspecialista.cz/images/icon-512.png',
        description:
          'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Czech', 'Slovak'],
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

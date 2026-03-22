import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';

  try {
    const res = await fetch(`${apiUrl}/events/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { title: 'Event | tvujspecialista.cz' };
    }

    const event = await res.json();
    const title = `${event.title} | tvujspecialista.cz`;
    const description = event.description?.substring(0, 160) || '';

    return {
      title,
      description,
      openGraph: {
        title: event.title,
        description,
        images: event.imageUrl
          ? [{ url: event.imageUrl, width: 1200, height: 630 }]
          : [],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Event | tvujspecialista.cz' };
  }
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

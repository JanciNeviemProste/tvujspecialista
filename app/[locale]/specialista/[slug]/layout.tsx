import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';

  try {
    const res = await fetch(`${apiUrl}/specialists/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { title: 'Specialist | tvujspecialista.cz' };
    }

    const specialist = await res.json();
    const title = `${specialist.name} — ${specialist.category} | tvujspecialista.cz`;
    const description = specialist.bio?.substring(0, 160) || '';

    return {
      title,
      description,
      openGraph: {
        title: `${specialist.name} — ${specialist.category}`,
        description,
        images: specialist.photo
          ? [{ url: specialist.photo, width: 400, height: 400 }]
          : [],
        type: 'profile',
      },
    };
  } catch {
    return { title: 'Specialist | tvujspecialista.cz' };
  }
}

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

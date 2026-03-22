import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';

  try {
    const res = await fetch(`${apiUrl}/courses/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { title: 'Course | tvujspecialista.cz' };
    }

    const course = await res.json();
    const title = `${course.title} | tvujspecialista.cz`;
    const description = course.description?.substring(0, 160) || '';

    return {
      title,
      description,
      openGraph: {
        title: course.title,
        description,
        images: course.thumbnailUrl
          ? [{ url: course.thumbnailUrl, width: 1200, height: 630 }]
          : [],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Course | tvujspecialista.cz' };
  }
}

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

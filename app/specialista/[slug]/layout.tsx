import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${name} | TvůjSpecialista.cz`,
    description: `Profil specialisty ${name} na TvůjSpecialista.cz. Zobrazit recenze, služby a kontaktní informace.`,
  };
}

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

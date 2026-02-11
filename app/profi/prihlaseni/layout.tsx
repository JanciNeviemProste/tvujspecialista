import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Přihlášení | TvůjSpecialista.cz',
  description: 'Přihlaste se do svého účtu na TvůjSpecialista.cz a spravujte své leady, recenze a profil specialisty.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

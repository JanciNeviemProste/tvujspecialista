import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrace specialisty | TvůjSpecialista.cz',
  description: 'Zaregistrujte se jako specialista na TvůjSpecialista.cz. Získejte kvalitní leady a rozšiřte své podnikání. 14 dní zdarma.',
};

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

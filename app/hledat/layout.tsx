import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hledat specialisty | tvujspecialista.cz',
  description: 'Najděte ověřeného finančního poradce nebo realitního makléře ve vašem okolí. Filtrujte podle kategorie, lokality a hodnocení.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

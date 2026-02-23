import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ceník | tvujspecialista.cz',
  description: 'Přehled cenových plánů pro specialisty. Education, Marketplace a Bundle balíčky pro rozvoj vaší praxe.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

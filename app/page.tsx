import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Najděte ověřeného specialistu | tvujspecialista.cz',
  description:
    'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK. Porovnejte, přečtěte si recenze a kontaktujte ty nejlepší.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}

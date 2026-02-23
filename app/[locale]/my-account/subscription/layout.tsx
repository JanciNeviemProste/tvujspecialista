import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Predplatné | Môj účet | tvujspecialista.cz',
  description: 'Spravujte svoje predplatné a fakturačné údaje.',
  robots: { index: false, follow: false },
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt | tvujspecialista.cz',
  description: 'Kontaktujte nás s dotazy ohledně platformy tvujspecialista.cz. Email, telefon a kontaktní formulář.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

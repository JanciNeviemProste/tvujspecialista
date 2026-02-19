import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moje udalosti | Komunita | tvujspecialista.cz',
  description: 'Prehľad vašich registrácií a účastí na komunitných udalostiach.',
  robots: { index: false, follow: false },
};

export default function MyEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

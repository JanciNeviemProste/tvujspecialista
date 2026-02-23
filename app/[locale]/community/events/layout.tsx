import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Udalosti | Komunita | tvujspecialista.cz',
  description: 'Objavte workshopy, networkingové akcie a konferencie pre špecialistov z oblasti nehnuteľností a financií.',
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

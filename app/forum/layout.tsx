import { Metadata } from 'next';
import ForumLayoutClient from './ForumLayoutClient';

export const metadata: Metadata = {
  title: 'Fórum | tvujspecialista.cz',
  description: 'Diskusné fórum pre realitných maklérov a finančných poradcov. Zdieľajte skúsenosti, rady a odborné znalosti.',
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <ForumLayoutClient>{children}</ForumLayoutClient>;
}

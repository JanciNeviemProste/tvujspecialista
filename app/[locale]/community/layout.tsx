import { Metadata } from 'next';
import CommunityLayoutClient from './CommunityLayoutClient';

export const metadata: Metadata = {
  title: 'Komunita | tvujspecialista.cz',
  description: 'Připojte se ke komunitě specialistů. Workshopy, webináře a networkingové akce pro profesionály.',
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <CommunityLayoutClient>{children}</CommunityLayoutClient>;
}

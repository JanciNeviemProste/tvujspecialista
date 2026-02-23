import { Metadata } from 'next';
import AcademyLayoutClient from './AcademyLayoutClient';

export const metadata: Metadata = {
  title: 'Akademie | tvujspecialista.cz',
  description: 'Prémiové online kurzy pro realitní agenty a finanční poradce. Rozvíjejte své dovednosti s experty z praxe.',
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <AcademyLayoutClient>{children}</AcademyLayoutClient>;
}

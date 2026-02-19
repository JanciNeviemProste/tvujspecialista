import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moje vzdelávanie | Akademie | tvujspecialista.cz',
  description: 'Sledujte svoj pokrok v kurzoch a pokračujte vo vzdelávaní.',
  robots: { index: false, follow: false },
};

export default function MyLearningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

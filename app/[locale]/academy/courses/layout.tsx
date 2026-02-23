import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalóg kurzov | Akademie | tvujspecialista.cz',
  description: 'Prehliadajte naše kurzy pre realitných agentov a finančných poradcov. Filtrujte podľa kategórie a úrovne.',
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

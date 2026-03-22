import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning | tvujspecialista.cz',
  robots: { index: false, follow: false },
};

export default function LearnCourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

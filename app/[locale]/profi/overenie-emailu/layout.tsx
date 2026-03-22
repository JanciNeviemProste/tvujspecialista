import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email verification | tvujspecialista.cz',
  description: 'Verify your email address.',
  robots: { index: false, follow: false },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

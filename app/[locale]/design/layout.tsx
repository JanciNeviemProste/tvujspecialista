import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Variants — tvujspecialista.cz',
  description: 'Preview of 5 design concepts for tvujspecialista.cz',
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

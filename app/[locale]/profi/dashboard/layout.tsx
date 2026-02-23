import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const metadata: Metadata = {
  title: 'Dashboard | tvujspecialista.cz',
  description: 'Spravujte svoje leady, dealy, provízie a profil na jednom mieste.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      {children}
    </ProtectedRoute>
  );
}

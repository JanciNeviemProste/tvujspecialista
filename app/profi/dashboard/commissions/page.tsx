'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCommissions, useCommissionStats } from '@/lib/hooks/useCommissions';
import { Commission, CommissionStatus } from '@/types/commissions';
import { CommissionStats } from '@/components/commissions/CommissionStats';
import { CommissionCard } from '@/components/commissions/CommissionCard';
import { CommissionStatsSkeleton, CommissionCardSkeleton } from '@/components/commissions/LoadingStates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function CommissionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: commissions, isLoading: commissionsLoading } = useMyCommissions();
  const { data: stats, isLoading: statsLoading } = useCommissionStats();

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  // Loading state
  if (authLoading || commissionsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <CommissionStatsSkeleton />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CommissionCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // Filter commissions
  const pendingCommissions = commissions?.filter((c) => c.status === CommissionStatus.PENDING) || [];
  const paidCommissions = commissions?.filter((c) => c.status === CommissionStatus.PAID) || [];
  const invoicedCommissions = commissions?.filter((c) => c.status === CommissionStatus.INVOICED) || [];

  // Handler
  const handlePayCommission = (commission: Commission) => {
    // Redirect to payment page
    router.push(`/profi/dashboard/commissions/${commission.id}/pay`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provízie</h1>
          <p className="text-muted-foreground">Prehľad vašich provízií z úspešných dealov</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <CommissionStats stats={stats} />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Čakajúce ({pendingCommissions.length})
            </TabsTrigger>
            <TabsTrigger value="invoiced">
              Vyfakturované ({invoicedCommissions.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Zaplatené ({paidCommissions.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending commissions */}
          <TabsContent value="pending" className="space-y-4">
            {pendingCommissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Žiadne čakajúce provízie</h3>
                <p className="text-muted-foreground">
                  Všetky provízie sú zaplatené alebo nemáte žiadne dealy
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingCommissions.map((commission) => (
                  <CommissionCard
                    key={commission.id}
                    commission={commission}
                    onPay={handlePayCommission}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Invoiced commissions */}
          <TabsContent value="invoiced" className="space-y-4">
            {invoicedCommissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">Žiadne vyfakturované provízie</h3>
                <p className="text-muted-foreground">
                  Tu sa zobrazia provízie, ktoré boli vyfakturované
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoicedCommissions.map((commission) => (
                  <CommissionCard
                    key={commission.id}
                    commission={commission}
                    onPay={handlePayCommission}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Paid commissions */}
          <TabsContent value="paid" className="space-y-4">
            {paidCommissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Žiadne zaplatené provízie</h3>
                <p className="text-muted-foreground">
                  Tu sa zobrazia provízie, ktoré ste zaplatili
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paidCommissions.map((commission) => (
                  <CommissionCard
                    key={commission.id}
                    commission={commission}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

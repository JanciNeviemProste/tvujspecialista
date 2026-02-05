'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCommissions } from '@/lib/hooks/useCommissions';
import { commissionsApi } from '@/lib/api/commissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

// NOTE: This page requires @stripe/stripe-js and @stripe/react-stripe-js to be installed
// Run: npm install @stripe/stripe-js @stripe/react-stripe-js

export default function CommissionPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const commissionId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const { data: commissions, isLoading: commissionsLoading } = useMyCommissions();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commission = commissions?.find((c) => c.id === commissionId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/profi/prihlaseni');
    }
  }, [authLoading, user, router]);

  // Get commission if not found
  useEffect(() => {
    if (!commissionsLoading && !commission) {
      setError('Provízia nebola nájdená');
    }
  }, [commissionsLoading, commission]);

  // Get payment intent
  useEffect(() => {
    if (commission && !clientSecret && !isLoadingPayment) {
      loadPaymentIntent();
    }
  }, [commission]);

  const loadPaymentIntent = async () => {
    if (!commission) return;

    setIsLoadingPayment(true);
    setError(null);

    try {
      const { data } = await commissionsApi.payCommission(commission.id);
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Chyba pri načítavaní platby');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleBack = () => {
    router.push('/profi/dashboard/commissions');
  };

  // Loading state
  if (authLoading || commissionsLoading || isLoadingPayment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-5xl">⏳</div>
              <p className="text-muted-foreground">Načítavam...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !commission) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na provízie
          </Button>

          <Card variant="elevated">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Chyba</h2>
              <p className="text-muted-foreground mb-4">{error || 'Provízia nebola nájdená'}</p>
              <Button onClick={handleBack}>
                Späť na provízie
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Späť na provízie
        </Button>

        {/* Commission summary */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <CardTitle>Prehľad provízií</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commission.deal && (
              <div>
                <p className="text-sm text-muted-foreground">Deal</p>
                <p className="font-medium">{commission.deal.customerName}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Hodnota dealu</p>
                <p className="font-medium">{formatCurrency(commission.dealValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sazba provízií</p>
                <p className="font-medium">{commission.commissionRate}%</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Suma na zaplatenie</p>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(commission.commissionAmount)}
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Splatnosť</p>
              <p className="font-medium">
                {format(new Date(commission.dueDate), 'd. MMMM yyyy', { locale: sk })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment form - requires Stripe Elements */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Platba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Stripe Elements Required</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pre dokončenie platby je potrebné nainštalovať Stripe knižnice:
              </p>
              <code className="block p-3 bg-muted rounded text-sm mb-4">
                npm install @stripe/stripe-js @stripe/react-stripe-js
              </code>
              <p className="text-xs text-muted-foreground">
                Po inštalácii tu bude Stripe CardElement pre bezpečnú platbu.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Zrušiť
              </Button>
              <Button disabled className="flex-1">
                Zaplatiť {formatCurrency(commission.commissionAmount)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-lg bg-muted">
          <h4 className="font-semibold mb-2">Postup integrácie Stripe:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Nainštalujte Stripe knižnice (príkaz vyššie)</li>
            <li>Vytvorte PaymentForm komponent s CardElement</li>
            <li>Implementujte confirmCardPayment() s clientSecret</li>
            <li>Po úspešnej platbe redirect na commissions stránku</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

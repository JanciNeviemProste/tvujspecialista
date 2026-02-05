'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCommissions } from '@/lib/hooks/useCommissions';
import { commissionsApi } from '@/lib/api/commissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '@/components/commissions';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CommissionPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const commissionId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const { data: commissions, isLoading: commissionsLoading } = useMyCommissions();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setPaymentError(null);

    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push('/profi/dashboard/commissions?payment=success');
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
    setPaymentSuccess(false);
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

        {/* Payment form with Stripe Elements */}
        {paymentSuccess ? (
          <Card variant="elevated">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Platba úspešná!</h2>
              <p className="text-muted-foreground mb-4">
                Vaša platba bola úspešne spracovaná. Budete presmerovaní na zoznam provízií...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Platba kartou</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    amount={commission.commissionAmount}
                    commissionId={commissionId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-4 text-4xl">⏳</div>
                  <p className="text-muted-foreground">Načítavam platobné údaje...</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Späť na provízie
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

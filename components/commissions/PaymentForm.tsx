'use client';

import { useState, FormEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  commissionId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({
  clientSecret,
  amount,
  commissionId,
  onSuccess,
  onError
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  // CardElement styling that supports dark mode using CSS variables
  const cardElementOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        iconColor: 'hsl(var(--foreground))',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: false,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        // Handle error
        const errorMessage = stripeError.message || 'Platba zlyhala';
        setError(errorMessage);
        onError(errorMessage);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        onSuccess();
      } else {
        // Unexpected state
        const errorMessage = 'Neočakávaný stav platby';
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Chyba pri spracovaní platby';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Element Container */}
      <div className="space-y-2">
        <label htmlFor="card-element" className="text-sm font-medium">
          Platobná karta
        </label>
        <div className="p-4 border rounded-lg bg-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <CardElement
            id="card-element"
            options={cardElementOptions}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) {
                setError(e.error.message);
              } else {
                setError(null);
              }
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          Všetky platby sú zabezpečené pomocou Stripe
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || !cardComplete}
        loading={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          'Spracováva sa...'
        ) : (
          <>Zaplatiť {formatCurrency(amount)}</>
        )}
      </Button>

      {/* Test Card Info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 rounded-lg bg-muted text-xs">
          <p className="font-semibold mb-1">Testovacie karty:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>Úspešná platba: 4242 4242 4242 4242</li>
            <li>Zamietnutá platba: 4000 0000 0000 0002</li>
            <li>CVC: Akékoľvek 3 čísla | Dátum: Budúcnosť</li>
          </ul>
        </div>
      )}
    </form>
  );
}

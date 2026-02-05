# Enhanced Deals & Commissions Frontend - Setup Guide

## Úspešne implementované komponenty ✅

### Fáza 1: Infraštruktúra
- ✅ TypeScript typy (`types/deals.ts`, `types/commissions.ts`)
- ✅ API clients (`lib/api/deals.ts`, `lib/api/commissions.ts`)
- ✅ Custom hooks (`lib/hooks/useDeals.ts`, `lib/hooks/useCommissions.ts`)

### Fáza 2: UI Komponenty
- ✅ `components/deals/DealCard.tsx` - Card s deal informáciami
- ✅ `components/deals/DealKanban.tsx` - Kanban board pre dealy
- ✅ `components/deals/DealValueModal.tsx` - Modal pre nastavenie hodnoty dealu
- ✅ `components/deals/CloseDealModal.tsx` - Modal pre uzavretie dealu
- ✅ `components/deals/LoadingStates.tsx` - Skeleton loadery
- ✅ `components/commissions/CommissionCard.tsx` - Card s commission info
- ✅ `components/commissions/CommissionStats.tsx` - Štatistiky provízií
- ✅ `components/commissions/LoadingStates.tsx` - Skeleton loadery
- ✅ `components/ui/label.tsx` - Label komponent (pridaný)

### Fáza 3: Stránky
- ✅ `app/profi/dashboard/deals/page.tsx` - Deal pipeline stránka
- ✅ `app/profi/dashboard/commissions/page.tsx` - Commissions dashboard
- ✅ `app/profi/dashboard/commissions/[id]/pay/page.tsx` - Payment stránka (skeleton)
- ✅ Aktualizovaný `app/profi/dashboard/page.tsx` - pridané linky na nové moduly

## Potrebné dokončiť 🚧

### 1. Nainštalovať dependencies

```bash
# Toast notifications (odporúčané: sonner)
npm install sonner

# Stripe Elements (pre commission payments)
npm install @stripe/stripe-js @stripe/react-stripe-js

# Drag & Drop (voliteľné, pre Kanban)
npm install @dnd-kit/core @dnd-kit/sortable
```

### 2. Aktualizovať toast v stránkach

V súboroch:
- `app/profi/dashboard/deals/page.tsx`
- `app/profi/dashboard/commissions/page.tsx`

Nahradiť:
```typescript
// Simple toast replacement
const toast = {
  success: (msg: string) => alert(msg),
  error: (msg: string) => alert(msg),
  info: (msg: string) => alert(msg),
};
```

Za:
```typescript
import { toast } from 'sonner';
```

A pridať do root layoutu Toaster:
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 3. Implementovať Stripe Payment Form

Vytvoriť `components/commissions/PaymentForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      onError(error.message || 'Platba zlyhala');
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Spracováva sa...' : `Zaplatiť ${formatCurrency(amount)}`}
      </Button>
    </form>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
```

### 4. Aktualizovať Payment Page

V `app/profi/dashboard/commissions/[id]/pay/page.tsx` pridať:

```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/commissions/PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// V komponente nahradiť placeholder za:
{clientSecret && (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <PaymentForm
      clientSecret={clientSecret}
      amount={commission.commissionAmount}
      onSuccess={() => {
        toast.success('Platba bola úspešná!');
        router.push('/profi/dashboard/commissions?payment=success');
      }}
      onError={(error) => {
        toast.error(error);
      }}
    />
  </Elements>
)}
```

### 5. Pridať Drag & Drop do Kanban (voliteľné)

Aktualizovať `components/deals/DealKanban.tsx`:

```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

// Implementovať drag handlers
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    // Update deal status
    const dealId = active.id;
    const newStatus = over.id; // column status
    onStatusChange?.({ id: dealId, status: newStatus });
  }
};
```

### 6. Environment Variables

Pridať do `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 7. Backend API Endpoints Check

Uistite sa, že backend má tieto endpointy:

**Deals:**
- `GET /api/deals/my` - Získať moje dealy
- `PATCH /api/deals/:id/status` - Zmeniť status dealu
- `PATCH /api/deals/:id/value` - Nastaviť hodnotu dealu
- `PATCH /api/deals/:id/close` - Uzavrieť deal
- `POST /api/deals/:id/reopen` - Znovu otvoriť deal
- `POST /api/deals/:id/notes` - Pridať poznámku

**Commissions:**
- `GET /api/commissions/my` - Získať moje provízie
- `GET /api/commissions/my/stats` - Získať štatistiky provízií
- `POST /api/commissions/:id/pay` - Iniciovať platbu (vráti clientSecret)

### 8. Testovanie

1. **Deal Pipeline:**
   - Vytvorte testovací deal v databáze
   - Skúste zmeniť status v Kanban view
   - Nastavte hodnotu dealu
   - Uzavrite deal ako WON (malo by vytvoriť commission)

2. **Commissions:**
   - Po uzavretí dealu skontrolujte, či sa vytvorila commission
   - Skúste zaplatiť commission (vyžaduje Stripe test mode)
   - Overte, že sa commission status zmenil na PAID

3. **Responsive Design:**
   - Testujte na mobile, tablet, desktop
   - Kanban board by mal mať horizontal scroll na mobile

## Známe obmedzenia a TODO

- [ ] Drag & Drop nie je implementovaný (vyžaduje @dnd-kit)
- [ ] Toast notifications používajú alert() (vyžaduje sonner)
- [ ] Stripe payment form je placeholder (vyžaduje Stripe packages)
- [ ] Deal detail modal nie je implementovaný
- [ ] Filtrovanie a sorting v list view je základné
- [ ] Chýba pagination pre veľké počty dealov
- [ ] Analytics/grafy nie sú implementované

## Status Colors

Pre konzistentný dizajn:

**Deal Status:**
- NEW: gray
- CONTACTED: blue
- QUALIFIED: cyan
- IN_PROGRESS: orange
- CLOSED_WON: green
- CLOSED_LOST: red

**Commission Status:**
- PENDING: orange/warning
- INVOICED: blue/default
- PAID: green/success
- WAIVED: gray/secondary

## Použité Shadcn UI komponenty

- Card, CardHeader, CardTitle, CardContent, CardFooter
- Button
- Badge
- Input
- Label (novo vytvorený)
- Tabs, TabsList, TabsTrigger, TabsContent
- Progress (existujúce)
- Avatar (existujúce)

## Súbory ktoré boli vytvorené/upravené

**Vytvorené (23 súborov):**
1. `types/deals.ts`
2. `types/commissions.ts`
3. `lib/api/deals.ts`
4. `lib/api/commissions.ts`
5. `lib/hooks/useDeals.ts`
6. `lib/hooks/useCommissions.ts`
7. `components/deals/DealCard.tsx`
8. `components/deals/DealKanban.tsx`
9. `components/deals/DealValueModal.tsx`
10. `components/deals/CloseDealModal.tsx`
11. `components/deals/LoadingStates.tsx`
12. `components/deals/index.ts`
13. `components/commissions/CommissionCard.tsx`
14. `components/commissions/CommissionStats.tsx`
15. `components/commissions/LoadingStates.tsx`
16. `components/commissions/index.ts`
17. `components/ui/label.tsx`
18. `app/profi/dashboard/deals/page.tsx`
19. `app/profi/dashboard/commissions/page.tsx`
20. `app/profi/dashboard/commissions/[id]/pay/page.tsx`
21. `DEALS_COMMISSIONS_SETUP.md`

**Upravené (1 súbor):**
1. `app/profi/dashboard/page.tsx` - pridané linky na Deal Pipeline a Provízie

## Next Steps

1. Nainštalovať dependencies (sonner, Stripe packages)
2. Implementovať PaymentForm komponent
3. Otestovať kompletný flow: deal creation → close → commission payment
4. Pridať error handling a loading states
5. Implementovať real-time updates (optional)
6. Pridať analytics dashboard (optional)

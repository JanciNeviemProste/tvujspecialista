# 3-Tier Subscription System - Implementation Summary

## Prehľad

Implementovaný 3-tier subscription systém s nasledujúcimi plánmi:

### Subscription Types

1. **Education** (799 Kč/mes)
   - Prístup ku všetkým kurzom v Academy
   - Videolekcie s odborníkmi
   - Študijné materiály na stiahnutie
   - Certifikáty po absolvovaní
   - Komunitný prístup k diskusiám
   - Email podpora

2. **Marketplace** (1,999 Kč/mes)
   - Deals pipeline management
   - Commission tracking systém
   - Premium listing v marketplace
   - Lead management nástroje
   - Pokročilá analytika predajov
   - CRM integrácie
   - Prioritná podpora

3. **Premium** (2,499 Kč/mes) ⭐ RECOMMENDED
   - Všetko z Education plánu
   - Všetko z Marketplace plánu
   - Exkluzívne webináre a events
   - Osobný account manager
   - API prístup
   - White-label možnosti
   - VIP podpora 24/7
   - **Úspora 20%** oproti obom plánom samostatne

## Backend Implementácia

### 1. Database Entity Updates

**Súbor:** `backend/src/database/entities/subscription.entity.ts`

Pridané polia:
- `userId` - link na user entity
- `subscriptionType` - enum (education/marketplace/premium)
- `stripeSubscriptionItemId` - pre Stripe update operations
- `scheduledDowngradeTo` - pre scheduled downgrades
- `TRIALING` status

### 2. Subscriptions Module

**Nové súbory:**
- `backend/src/subscriptions/subscriptions.service.ts`
- `backend/src/subscriptions/subscriptions.controller.ts`
- `backend/src/subscriptions/subscriptions.module.ts`

**Metódy:**
- `createEducationCheckout()` - vytvorenie Education subscription
- `createMarketplaceCheckout()` - vytvorenie Marketplace subscription
- `createPremiumCheckout()` - vytvorenie Premium subscription
- `upgradeSubscription()` - okamžitý upgrade s proration
- `downgradeSubscription()` - scheduled downgrade na koniec periody
- `cancelSubscription()` - zrušenie subscription
- `resumeSubscription()` - obnovenie zrušeného subscription
- `getCustomerPortalUrl()` - Stripe billing portal

### 3. Enhanced Subscription Guard

**Súbor:** `backend/src/academy/guards/subscription.guard.ts`

Access control:
- Academy routes: vyžadujú Education alebo Premium
- Deals/Commissions routes: vyžadujú Marketplace alebo Premium
- Kontrola expirácie subscription

### 4. Stripe Service Updates

**Súbor:** `backend/src/stripe/stripe.service.ts`

- Rozšírený `handleCheckoutCompleted()` pre subscription types
- Rozšírený `handleSubscriptionUpdated()` pre scheduled downgrades
- Support pre všetky 3 subscription types

### 5. API Endpoints

```
POST /subscriptions/education/checkout
POST /subscriptions/marketplace/checkout
POST /subscriptions/premium/checkout
GET  /subscriptions/my
GET  /subscriptions/my/active
POST /subscriptions/:id/upgrade
POST /subscriptions/:id/downgrade
POST /subscriptions/:id/cancel
POST /subscriptions/:id/resume
GET  /subscriptions/portal
```

## Frontend Implementácia

### 1. TypeScript Types

**Súbor:** `types/subscriptions.ts`

Definície pre:
- `Subscription` interface
- `SubscriptionType` enum
- `SubscriptionStatus` enum
- `PricingPlan` interface

### 2. API Client

**Súbor:** `lib/api/subscriptions.ts`

Axios client pre všetky subscription operácie.

### 3. Custom Hooks

**Súbor:** `lib/hooks/useSubscriptions.ts`

React Query hooks:
- `useMySubscriptions()` - načítanie všetkých subscriptions
- `useMyActiveSubscription()` - aktívna subscription
- `useCreateCheckout()` - vytvorenie Stripe checkout
- `useUpgradeSubscription()` - upgrade subscription
- `useDowngradeSubscription()` - downgrade subscription
- `useCancelSubscription()` - zrušenie subscription
- `useResumeSubscription()` - obnovenie subscription
- `useCustomerPortal()` - Stripe customer portal

### 4. Components

**Nové komponenty:**

`components/subscriptions/PricingCard.tsx`
- Pricing card component
- Responsive design
- Recommended badge support
- Loading states

`components/subscriptions/SubscriptionBadge.tsx`
- Badge component pre subscription type/status
- Color-coded pre rôzne typy
- Lokalizované labely

### 5. Pages

#### Pricing Page
**Súbor:** `app/ceny/page.tsx`

Features:
- 3 pricing cards s feature comparison
- Interactive plan selection
- Stripe checkout integration
- Feature comparison table
- FAQ section
- Responsive design

#### Subscription Management Page
**Súbor:** `app/my-account/subscription/page.tsx`

Features:
- Aktuálne subscription info
- Upgrade/downgrade dialogs
- Cancel/resume subscription
- Stripe customer portal link
- Scheduled changes notification
- Feature list pre aktuálny plán

## Access Control

### Academy Routes
```typescript
// Vyžaduje: EDUCATION alebo PREMIUM subscription
/academy/*
/courses/*
```

### Marketplace Routes
```typescript
// Vyžaduje: MARKETPLACE alebo PREMIUM subscription
/deals/*
/commissions/*
/profi/dashboard/deals
/profi/dashboard/commissions
```

## Upgrade/Downgrade Logic

### Upgrade
- Okamžitá zmena subscription
- Proration: rozdiel v cene prepočítaný proporcionálne
- Prístup k novým features ihneď

### Downgrade
- Scheduled na koniec billing cyklu
- No proration: platba bez dodatočných poplatkov
- Prístup k súčasným features do konca obdobia
- Pole `scheduledDowngradeTo` uložené v DB

### Cancel
- Subscription označený ako canceled
- Prístup do konca plateného obdobia
- Možnosť resume do konca obdobia

## Environment Variables

### Backend (.env)
```env
# Stripe Price IDs - User Subscription Types
STRIPE_EDUCATION_PRICE_ID=price_xxxxx
STRIPE_MARKETPLACE_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_xxxxx
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## Database Migration

### SQL Migration
Spustiť: `backend/migration-3-tier-subscriptions.sql`

Migrácia pridá:
- Nové stĺpce do subscriptions table
- Indexy pre performance
- Foreign key constraints
- Check constraints pre data integrity

Detaily v: `backend/MIGRATION_GUIDE.md`

## Stripe Configuration

### 1. Vytvoriť Products

V Stripe Dashboard vytvoriť 3 products:

1. **Education Plan**
   - Name: Education
   - Price: 799 CZK
   - Recurring: Monthly
   - Description: Academy access subscription

2. **Marketplace Plan**
   - Name: Marketplace
   - Price: 1999 CZK
   - Recurring: Monthly
   - Description: Deals & commissions platform

3. **Premium Plan**
   - Name: Premium
   - Price: 2499 CZK
   - Recurring: Monthly
   - Description: Complete solution with Academy + Marketplace

### 2. Webhook Setup

URL: `https://your-domain.com/stripe/webhook`

Events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

### 3. Customer Portal

Povoliť v Stripe Dashboard:
- Settings → Billing → Customer portal
- Enable: Update payment method, Cancel subscription

## Testing Checklist

### Backend
- [ ] POST /subscriptions/education/checkout vytvára valid session
- [ ] POST /subscriptions/marketplace/checkout vyžaduje specialist account
- [ ] POST /subscriptions/premium/checkout funguje pre všetkých users
- [ ] GET /subscriptions/my vracia user subscriptions
- [ ] Upgrade z Education na Premium (proration)
- [ ] Downgrade z Premium na Education (scheduled)
- [ ] Cancel subscription (cancel_at_period_end)
- [ ] Resume canceled subscription
- [ ] Stripe webhook handling pre všetky events
- [ ] SubscriptionGuard blokuje Academy bez Education/Premium
- [ ] SubscriptionGuard blokuje Deals/Commissions bez Marketplace/Premium

### Frontend
- [ ] Pricing page zobrazuje všetky 3 plány
- [ ] Feature comparison table je kompletná
- [ ] Checkout redirect funguje
- [ ] Subscription management page zobrazuje aktívne subscription
- [ ] Upgrade dialog funguje správne
- [ ] Downgrade dialog funguje správne
- [ ] Cancel dialog s potvrdením
- [ ] Resume button pre canceled subscriptions
- [ ] Customer portal redirect funguje
- [ ] Badges zobrazujú správne farby a labels
- [ ] Responsive design na mobile

### Integration
- [ ] Complete checkout flow (Stripe → webhook → DB update)
- [ ] Upgrade flow (UI → API → Stripe → DB)
- [ ] Downgrade flow (UI → API → Stripe → scheduled change)
- [ ] Cancel flow (UI → API → Stripe → cancel_at_period_end)
- [ ] Access control (guarded routes pre Academy/Marketplace)

## Deployment Steps

1. **Database Migration**
   ```bash
   psql -U user -d database -f backend/migration-3-tier-subscriptions.sql
   ```

2. **Update Environment Variables**
   - Pridať Stripe Price IDs do backend .env
   - Pridať Stripe Publishable Key do frontend .env.local

3. **Deploy Backend**
   ```bash
   cd backend
   npm run build
   npm run start:prod
   ```

4. **Deploy Frontend**
   ```bash
   npm run build
   npm run start
   ```

5. **Stripe Webhook Configuration**
   - Nastaviť production webhook URL
   - Získať webhook signing secret
   - Pridať do backend .env

6. **Test Production**
   - Vytvoriť test subscription
   - Overiť webhook delivery
   - Otestovať access control

## Maintenance

### Monitoring
- Stripe Dashboard → Payments
- Stripe Dashboard → Subscriptions
- Database queries na subscription stats
- Backend logs pre webhook events

### Common Issues

**Webhook nie je prijatý:**
- Overiť webhook URL v Stripe Dashboard
- Overiť STRIPE_WEBHOOK_SECRET v .env
- Skontrolovať firewall/CORS settings

**Checkout redirect nefunguje:**
- Overiť NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Overiť success_url/cancel_url v checkout session

**Access denied na Academy:**
- Overiť subscription status v DB
- Overiť currentPeriodEnd nie je expired
- Overiť subscriptionType je EDUCATION alebo PREMIUM

## Support

Pre issues alebo questions:
- Backend logs: `backend/logs/`
- Frontend console errors
- Stripe Dashboard → Events pre webhook debugging
- Database queries pre subscription state

## Ďalšie vylepšenia (future)

- [ ] Ročné subscription s discount
- [ ] Trial period (7 alebo 14 dní)
- [ ] Promo codes/Coupons
- [ ] Team/Enterprise plans
- [ ] Usage-based billing
- [ ] Subscription analytics dashboard
- [ ] Email notifications pre expiration
- [ ] Auto-upgrade recommendations

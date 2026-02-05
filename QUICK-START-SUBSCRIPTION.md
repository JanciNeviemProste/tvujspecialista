# Quick Start Guide - 3-Tier Subscription System

## 🚀 Rýchly Štart (5 minút)

### 1. Install Dependencies

```bash
# Frontend
npm install @radix-ui/react-dialog @radix-ui/react-separator @stripe/stripe-js date-fns sonner class-variance-authority

# Backend
cd backend
npm install
cd ..
```

### 2. Database Migration

```bash
# Backup first!
pg_dump -U tvujspecialista -d tvujspecialista > backup.sql

# Run migration
psql -U tvujspecialista -d tvujspecialista -f backend/migration-3-tier-subscriptions.sql
```

### 3. Stripe Setup

1. Ísť na [Stripe Dashboard](https://dashboard.stripe.com)
2. Vytvoriť 3 Products:
   - **Education**: 799 CZK/month recurring
   - **Marketplace**: 1999 CZK/month recurring
   - **Premium**: 2499 CZK/month recurring
3. Skopírovať Price IDs

### 4. Environment Variables

**Backend** (`backend/.env`):
```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_EDUCATION_PRICE_ID=price_xxx
STRIPE_MARKETPLACE_PRICE_ID=price_yyy
STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_zzz
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 5. Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Skopírovať webhook secret do backend `.env`

### 6. Start Development

```bash
# Backend (terminal 1)
cd backend
npm run start:dev

# Frontend (terminal 2)
npm run dev
```

### 7. Test Checkout Flow

1. Otvoriť: http://localhost:3000/ceny
2. Kliknúť na "Začať sa vzdelávať" (Education plán)
3. Prihlásiť sa (ak nie ste)
4. Redirect na Stripe checkout
5. Test platba: `4242 4242 4242 4242`, CVC: `123`, Dátum: budúcnosť
6. Potvrdiť
7. Redirect späť na `/my-account/subscription?payment=success`

## 🧪 Test Cards (Stripe Test Mode)

```
Úspešná platba:    4242 4242 4242 4242
Platba zamietnutá: 4000 0000 0000 0002
3D Secure:         4000 0025 0000 3155
```

## 📍 Hlavné URLs

```
Pricing Page:       /ceny
Subscription Mgmt:  /my-account/subscription
Academy:            /academy (vyžaduje Education/Premium)
Deals:              /profi/dashboard/deals (vyžaduje Marketplace/Premium)
```

## ✅ Verify Installation

### Backend Check
```bash
curl http://localhost:3001/subscriptions/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Check
1. Otvoriť DevTools
2. Network tab
3. Reload `/ceny`
4. Skontrolovať: Žiadne 404 errors na komponenty

### Database Check
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'subscriptions';

-- Should show: userId, subscriptionType, scheduledDowngradeTo
```

## 🐛 Common Issues

### "Cannot find module '@radix-ui/react-dialog'"
```bash
npm install @radix-ui/react-dialog
```

### "STRIPE_EDUCATION_PRICE_ID is not defined"
Pridať do `backend/.env`

### Webhook nie je prijatý
1. Check Stripe Dashboard → Events
2. Verify webhook secret v `.env`
3. Test webhook delivery v Stripe Dashboard

### Access denied na Academy
1. Check subscription status v DB
2. Verify subscription type (EDUCATION alebo PREMIUM)
3. Check currentPeriodEnd nie je expired

## 📚 Next Steps

Po úspešnom teste:
1. ✅ Otestovať upgrade flow
2. ✅ Otestovať downgrade flow
3. ✅ Otestovať cancel/resume
4. ✅ Otestovať access control
5. ✅ Pripraviť production Stripe account
6. ✅ Deploy

## 📖 Dokumentácia

- **Kompletná dokumentácia:** `3-TIER-SUBSCRIPTION-IMPLEMENTATION.md`
- **Migration guide:** `backend/MIGRATION_GUIDE.md`
- **Summary report:** `SUBSCRIPTION-IMPLEMENTATION-SUMMARY.md`

## 💬 Support

Pre otázky a problémy:
1. Check dokumentáciu vyššie
2. Stripe logs: Dashboard → Events
3. Backend logs: `backend/logs/`
4. Frontend console errors

---

**Happy Coding! 🎉**

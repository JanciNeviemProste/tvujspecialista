# Stripe Configuration Guide

This document provides step-by-step instructions for configuring Stripe price IDs for the tvujspecialista subscription system.

## Overview

The application uses Stripe for two distinct subscription systems:

1. **Specialist Marketplace Tiers** - For specialists to upgrade their marketplace presence
2. **User Subscription Types** - For users to purchase educational and premium content

## Required Price IDs

### Specialist Marketplace Tiers (3 prices)

These are used when specialists upgrade their marketplace listing tier.

| Tier | Monthly Price | Environment Variable | Description |
|------|---|---|---|
| BASIC | Free | `STRIPE_BASIC_PRICE_ID` | Entry-level tier for specialists |
| PRO | 1,990 CZK | `STRIPE_PRO_PRICE_ID` | Mid-level tier with enhanced visibility |
| PREMIUM | 2,990 CZK | `STRIPE_PREMIUM_PRICE_ID` | Top-tier with maximum features |

### User Subscription Types (3 prices)

These are used when users purchase educational content or marketplace access.

| Type | Monthly Price | Environment Variable | Description |
|---|---|---|---|
| EDUCATION | 990 CZK | `STRIPE_EDUCATION_PRICE_ID` | Educational content access |
| MARKETPLACE | 1,990 CZK | `STRIPE_MARKETPLACE_PRICE_ID` | Marketplace access subscription |
| PREMIUM | 2,990 CZK | `STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID` | Premium bundle subscription |

**Total: 6 price IDs needed**

## Step-by-Step Stripe Dashboard Setup

### Prerequisites

- Stripe account with production and test modes enabled
- Access to Stripe Dashboard (https://dashboard.stripe.com)
- Working in Test Mode initially for development/testing

### Phase 1: Create Products in Stripe Dashboard

#### 1.1 Create Specialist Marketplace Products

1. Go to **Products** → **Add a product**
2. Create first product:
   - **Name:** "Specialist - PRO Tier"
   - **Description:** "PRO tier marketplace listing for specialists"
   - **Billing information:** Leave as default
   - **Pricing model:** Recurring
   - **Price:** 1,990 CZK
   - **Billing period:** Monthly
   - Click **Save product**
   - **Note the Price ID** (format: `price_xxxxx`)

3. Create second product:
   - **Name:** "Specialist - PREMIUM Tier"
   - **Description:** "PREMIUM tier marketplace listing for specialists"
   - **Pricing model:** Recurring
   - **Price:** 2,990 CZK
   - **Billing period:** Monthly
   - Click **Save product**
   - **Note the Price ID**

4. For BASIC tier:
   - The BASIC tier may not require a Stripe price ID if it's free
   - If you want to track BASIC tier in Stripe, create a product with 0 CZK price
   - Otherwise, you can set `STRIPE_BASIC_PRICE_ID=skip` or use a placeholder

#### 1.2 Create User Subscription Products

1. Create Education product:
   - **Name:** "User - Education Subscription"
   - **Description:** "Access to educational content and courses"
   - **Pricing model:** Recurring
   - **Price:** 990 CZK
   - **Billing period:** Monthly
   - Click **Save product**
   - **Note the Price ID**

2. Create Marketplace product:
   - **Name:** "User - Marketplace Access"
   - **Description:** "Access to specialist marketplace"
   - **Pricing model:** Recurring
   - **Price:** 1,990 CZK
   - **Billing period:** Monthly
   - Click **Save product**
   - **Note the Price ID**

3. Create Premium product:
   - **Name:** "User - Premium Subscription"
   - **Description:** "Premium access with all features"
   - **Pricing model:** Recurring
   - **Price:** 2,990 CZK
   - **Billing period:** Monthly
   - Click **Save product**
   - **Note the Price ID**

### Phase 2: Configure Environment Variables

#### 2.1 Test Mode Configuration

1. In Stripe Dashboard, ensure you're in **Test mode** (toggle in top-left)
2. Go to **Developers** → **API keys**
3. Copy your **Secret key** (format: `sk_test_xxxxx`)

#### 2.2 Update Backend Environment

1. Open `backend/.env`
2. Update Stripe configuration with your actual keys and price IDs:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Stripe Webhook Secret (see Phase 3)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs - Specialist Marketplace Tiers
STRIPE_BASIC_PRICE_ID=price_xxxxx              # Optional/Free tier
STRIPE_PRO_PRICE_ID=price_xxxxx                # 1,990 CZK/month
STRIPE_PREMIUM_PRICE_ID=price_xxxxx            # 2,990 CZK/month

# Stripe Price IDs - User Subscription Types
STRIPE_EDUCATION_PRICE_ID=price_xxxxx          # 990 CZK/month
STRIPE_MARKETPLACE_PRICE_ID=price_xxxxx        # 1,990 CZK/month
STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_xxxxx  # 2,990 CZK/month
```

### Phase 3: Configure Webhooks

Webhooks are critical for handling subscription events (creation, cancellation, updates).

#### 3.1 Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add an endpoint**
3. **Endpoint URL:** `https://yourdomain.com/api/stripe/webhook`
   - For development: Use ngrok or similar tunnel (see below)
4. **Select events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Click **Add endpoint**
6. In the endpoint details, find **Signing secret**
7. Copy the secret (format: `whsec_xxxxx`)

#### 3.2 Update Webhook Secret

1. Update `backend/.env` with the webhook secret:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### 3.3 Local Development Webhook Testing

For development, use **Stripe CLI** to forward webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Log in: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```
4. Copy the signing secret from the output and add to `.env`

## Testing Verification Steps

### Test 1: Verify Environment Variables are Loaded

```bash
cd backend
npm start
# Check logs for stripe initialization
# Should NOT show: "Stripe service skipped - placeholder API key detected"
```

### Test 2: Test Specialist Checkout Flow

1. Start the application
2. Log in as a specialist
3. Navigate to subscription upgrade page
4. Select PRO tier
5. Click "Upgrade"
6. You should be redirected to Stripe Checkout
7. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: any future date (e.g., 12/25)
   - CVC: any 3 digits
8. Complete checkout
9. Verify in database: `subscriptions` table should have new record
10. Verify Stripe Dashboard shows the subscription

### Test 3: Test User Subscription Checkout Flow

1. Log in as a regular user
2. Navigate to subscription purchase page
3. Select Education subscription
4. Complete checkout with test card
5. Verify subscription created in database

### Test 4: Test Subscription Webhook Events

1. Start Stripe CLI listener (see Phase 3.3)
2. Complete a checkout as above
3. Monitor Stripe CLI output for webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
4. Verify events are processed in application logs

### Test 5: Test Subscription Cancellation

1. In Stripe Dashboard (Test mode)
2. Go to **Customers**
3. Find the test customer
4. Click into their subscription
5. Click **Cancel subscription**
6. Verify webhook fires and subscription status updates in database

### Test 6: Verify All Price IDs Configured

Run this query in your database:

```sql
-- Check subscription records exist (requires completed test purchases)
SELECT * FROM subscriptions LIMIT 5;

-- Verify database structure
\d subscriptions
```

Check application logs for any "undefined price ID" errors:

```bash
# Search logs for price ID references
npm start 2>&1 | grep -i price
```

## Production Migration

When moving to production:

### 1. Create Live Products

Repeat Phase 1 and 2, but:
- Toggle Stripe Dashboard to **Live mode**
- Create new products (don't reuse test mode products)
- Copy live mode API keys (format: `sk_live_xxxxx`)

### 2. Update Production Environment

Update your production `.env` with:
- Live API keys (`sk_live_xxxxx`)
- Live webhook secret (`whsec_live_xxxxx`)
- Live product price IDs

### 3. Set Up Live Webhook

1. In Stripe Dashboard (Live mode)
2. Create new webhook endpoint with production URL
3. Update webhook secret in production environment

### 4. Test in Live Mode

Before full launch:
1. Process a small test transaction
2. Verify webhook delivery in Stripe Dashboard
3. Monitor application logs for errors

## Architecture Overview

The subscription system is implemented as follows:

### Specialist Marketplace Subscriptions

**Flow:** Specialist → Checkout → Stripe → Webhook → Database Update

**Relevant Files:**
- Controller: `backend/src/stripe/stripe.controller.ts`
- Service: `backend/src/stripe/stripe.service.ts`
- Entities:
  - `backend/src/database/entities/specialist.entity.ts` (stores `subscriptionTier`)
  - `backend/src/database/entities/subscription.entity.ts` (stores subscription details)

**Database Schema:**
```typescript
// Subscription entity tracks all subscription data
{
  id: uuid;
  specialistId: string;           // Links to specialist
  stripeCustomerId: string;       // Stripe customer ID
  stripeSubscriptionId: string;   // Stripe subscription ID
  stripeSubscriptionItemId: string; // Stripe subscription item ID
  tier: SubscriptionTier;         // BASIC | PRO | PREMIUM
  status: SubscriptionStatus;     // active | past_due | canceled | unpaid | trialing
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Specialist entity also tracks
{
  id: uuid;
  userId: string;
  subscriptionTier: SubscriptionTier;  // Current tier (defaults to BASIC)
  subscriptionExpiresAt: Date;         // Expiration date
}
```

### User Subscription Types

**Flow:** User → Checkout → Stripe → Webhook → Database Update

**Stores subscription type separately from tier:**
```typescript
subscriptionType: SubscriptionType;  // education | marketplace | premium
```

Allows users to have different subscription products than marketplace tier upgrades.

## Common Issues and Troubleshooting

### Issue: "Stripe service skipped - placeholder API key detected"

**Cause:** `STRIPE_SECRET_KEY` is still set to `sk_test_xxxxxxxxxxxxx`

**Solution:**
1. Update `backend/.env` with actual Stripe secret key
2. Restart application

### Issue: Checkout creates session but no price found

**Cause:** Price ID environment variable is not set or is placeholder

**Solution:**
1. Verify all price IDs are configured in `.env`
2. Ensure price IDs exist in Stripe Dashboard
3. Check tier/type name matches exactly: `BASIC`, `PRO`, `PREMIUM` (case-sensitive)

### Issue: Webhook events not received

**Cause:** Webhook endpoint URL is unreachable or signing secret is wrong

**Solution:**
1. For development: Ensure Stripe CLI is running and connected
2. For production: Verify domain is publicly accessible
3. Verify webhook signing secret in `.env` matches Stripe Dashboard
4. Check application logs for webhook processing errors

### Issue: Subscription created in Stripe but not in database

**Cause:** Webhook event not delivered or processed

**Solution:**
1. Check Stripe Dashboard → Webhooks → Recent attempts
2. Look for delivery errors or response status codes
3. Verify webhook secret is correct in `.env`
4. Check application error logs for webhook processing exceptions

### Issue: Wrong price charged

**Cause:** Price ID environment variable points to wrong product

**Solution:**
1. Verify product prices in Stripe Dashboard match specification
2. Confirm price IDs in `.env` match products created
3. Delete test subscription and try again

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Stripe CLI Guide: https://stripe.com/docs/stripe-cli
- Webhook Testing: https://stripe.com/docs/webhooks/test
- CZK Currency Support: https://stripe.com/docs/currencies/payment-methods-by-country#supported-payment-currencies

## Environment Variables Reference

Complete list of Stripe-related environment variables:

```bash
# Required for Stripe API access
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Required for webhook validation
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Required for specialist marketplace subscriptions
STRIPE_BASIC_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxxx

# Required for user subscription types
STRIPE_EDUCATION_PRICE_ID=price_xxxxx
STRIPE_MARKETPLACE_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_xxxxx

# Application URLs (for checkout redirects)
FRONTEND_URL=http://localhost:3000  # Redirect after checkout
```

## Maintenance and Updates

### Monthly Subscription Review

- Check Stripe Dashboard for failed payments
- Review MRR (Monthly Recurring Revenue)
- Monitor churn rate
- Process any refunds or disputes

### Annual Pricing Review

- Consider adjusting prices based on market conditions
- Create new Stripe products if prices change
- Maintain backward compatibility during migration

### Monitoring Checklist

- [ ] All webhook events are being delivered successfully
- [ ] No failed payment retry attempts exceed acceptable threshold
- [ ] Subscription status in database matches Stripe
- [ ] Premium features are accessible only to active subscribers
- [ ] Cancellation workflow works smoothly

---

**Last Updated:** 2025-02-05
**Stripe API Version:** 2025-02-24.acacia
**Document Version:** 1.0

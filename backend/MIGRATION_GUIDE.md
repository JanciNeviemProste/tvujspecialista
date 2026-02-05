# Database Migration Guide - 3-Tier Subscription System

## Zmeny v databáze

### Subscription Entity Updates

Pridané nové stĺpce do tabuľky `subscriptions`:

1. **userId** (nullable string) - Reference na user entity
2. **subscriptionType** (enum) - Typ subscripcie: 'education', 'marketplace', 'premium'
3. **stripeSubscriptionItemId** (string) - ID Stripe subscription item pre update operations
4. **scheduledDowngradeTo** (enum, nullable) - Scheduled downgrade na konci billing cyklu
5. **TRIALING** status pridaný do SubscriptionStatus enum

### Migration SQL

```sql
-- Add new columns to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN "userId" uuid,
  ADD COLUMN "subscriptionType" varchar(20) DEFAULT 'marketplace',
  ADD COLUMN "stripeSubscriptionItemId" varchar(255),
  ADD COLUMN "scheduledDowngradeTo" varchar(20);

-- Make specialistId nullable (pre Education subscriptions)
ALTER TABLE subscriptions
  ALTER COLUMN "specialistId" DROP NOT NULL;

-- Add index for userId
CREATE INDEX "IDX_subscriptions_userId" ON subscriptions ("userId");

-- Update subscription status enum to include 'trialing'
-- Note: Tento step môže vyžadovať manuálny ALTER TYPE v závislosti od PostgreSQL verzie
ALTER TYPE "subscriptions_status_enum" ADD VALUE IF NOT EXISTS 'trialing';

-- Add foreign key constraint
ALTER TABLE subscriptions
  ADD CONSTRAINT "FK_subscriptions_user"
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
```

## Manual Migration Steps

1. **Backup databázy**
   ```bash
   pg_dump -U tvujspecialista -d tvujspecialista > backup_before_migration.sql
   ```

2. **Spustiť migration SQL**
   ```bash
   psql -U tvujspecialista -d tvujspecialista -f migration.sql
   ```

3. **Overiť zmeny**
   ```sql
   \d subscriptions
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'subscriptions';
   ```

4. **Migrovať existujúce dáta** (ak existujú)
   ```sql
   -- Link existing subscriptions to users via specialists
   UPDATE subscriptions s
   SET "userId" = sp.userId
   FROM specialists sp
   WHERE s."specialistId" = sp.id
   AND s."userId" IS NULL;
   ```

## Environment Variables

Pridať do `.env` súboru:

```env
# Stripe Price IDs - User Subscription Types
STRIPE_EDUCATION_PRICE_ID=price_xxxxx
STRIPE_MARKETPLACE_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_xxxxx
```

## Stripe Setup

1. Vytvoriť 3 nové Products v Stripe Dashboard:
   - **Education** - 799 Kč/month recurring
   - **Marketplace** - 1,999 Kč/month recurring
   - **Premium** - 2,499 Kč/month recurring

2. Získať Price IDs a pridať ich do `.env`

3. Nastaviť webhook endpoint v Stripe:
   - URL: `https://your-domain.com/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Testing

Po migrácii otestovať:
- [ ] Vytvorenie Education subscription
- [ ] Vytvorenie Marketplace subscription
- [ ] Vytvorenie Premium subscription
- [ ] Upgrade z Education na Premium
- [ ] Downgrade z Premium na Education
- [ ] Cancel subscription
- [ ] Resume canceled subscription
- [ ] Access control pre Academy routes
- [ ] Access control pre Deals/Commissions routes

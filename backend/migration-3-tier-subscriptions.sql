-- Migration: 3-Tier Subscription System
-- Date: 2026-02-05
-- Description: Adds support for Education, Marketplace, and Premium subscription types

-- Step 1: Add new columns to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS "userId" uuid,
  ADD COLUMN IF NOT EXISTS "subscriptionType" varchar(20) DEFAULT 'marketplace',
  ADD COLUMN IF NOT EXISTS "stripeSubscriptionItemId" varchar(255),
  ADD COLUMN IF NOT EXISTS "scheduledDowngradeTo" varchar(20);

-- Step 2: Make specialistId nullable (for Education subscriptions without specialist account)
ALTER TABLE subscriptions
  ALTER COLUMN "specialistId" DROP NOT NULL;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "IDX_subscriptions_userId" ON subscriptions ("userId");
CREATE INDEX IF NOT EXISTS "IDX_subscriptions_subscriptionType" ON subscriptions ("subscriptionType");

-- Step 4: Update subscription status enum to include 'trialing'
-- Note: This may require manual intervention depending on PostgreSQL version
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t
                 JOIN pg_enum e ON t.oid = e.enumtypid
                 WHERE t.typname = 'subscriptions_status_enum'
                 AND e.enumlabel = 'trialing') THEN
    ALTER TYPE subscriptions_status_enum ADD VALUE 'trialing';
  END IF;
END
$$;

-- Step 5: Add foreign key constraint for userId
ALTER TABLE subscriptions
  ADD CONSTRAINT "FK_subscriptions_user"
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Step 6: Migrate existing subscriptions to link with users
UPDATE subscriptions s
SET "userId" = sp."userId"
FROM specialists sp
WHERE s."specialistId" = sp.id
AND s."userId" IS NULL;

-- Step 7: Add check constraint for subscriptionType
ALTER TABLE subscriptions
  ADD CONSTRAINT "CHK_subscriptionType"
  CHECK ("subscriptionType" IN ('education', 'marketplace', 'premium'));

-- Step 8: Add check constraint for scheduledDowngradeTo
ALTER TABLE subscriptions
  ADD CONSTRAINT "CHK_scheduledDowngradeTo"
  CHECK ("scheduledDowngradeTo" IS NULL OR "scheduledDowngradeTo" IN ('education', 'marketplace', 'premium'));

-- Verification queries (run after migration)
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'subscriptions';
-- SELECT * FROM subscriptions LIMIT 5;

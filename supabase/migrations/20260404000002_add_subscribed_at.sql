-- Add subscribed_at to track when user became PRO
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscribed_at timestamptz;

-- Backfill: estimate start date for existing PRO users (premium_until - 365 days)
UPDATE public.user_profiles
SET subscribed_at = premium_until - INTERVAL '365 days'
WHERE is_premium = true AND premium_until IS NOT NULL AND subscribed_at IS NULL;

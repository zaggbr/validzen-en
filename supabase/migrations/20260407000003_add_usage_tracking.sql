-- Add usage tracking columns to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS posts_viewed_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS quizzes_completed_count integer NOT NULL DEFAULT 0;

-- Ensure an RLS policy exists for the admin function to read all profiles (if not already there)
-- The admin edge function uses service_role, so it bypasses RLS, but for good measure:
-- We'll just stick to the usage columns for now.

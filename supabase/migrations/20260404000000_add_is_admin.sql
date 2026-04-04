-- Add is_admin column to user_profiles (for future use)
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

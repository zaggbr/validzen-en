-- Add missing columns to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS payment_platform text DEFAULT 'stripe';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS asaas_customer_id text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Fix premium_assessment_questions: restrict to premium users only (was publicly readable)
DROP POLICY IF EXISTS "Premium assessment questions are publicly readable" ON public.premium_assessment_questions;

CREATE POLICY "Only premium users can read questions"
ON public.premium_assessment_questions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_premium = true
  )
);


-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_pt text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  description_pt text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '📂',
  color text NOT NULL DEFAULT '#6366f1',
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT TO public USING (true);

-- Create dimensions table
CREATE TABLE IF NOT EXISTS public.dimensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_pt text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  description_pt text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🧠',
  color text NOT NULL DEFAULT '#6366f1',
  layer integer NOT NULL DEFAULT 1,
  interpretation_low_pt text NOT NULL DEFAULT '',
  interpretation_low_en text NOT NULL DEFAULT '',
  interpretation_moderate_pt text NOT NULL DEFAULT '',
  interpretation_moderate_en text NOT NULL DEFAULT '',
  interpretation_high_pt text NOT NULL DEFAULT '',
  interpretation_high_en text NOT NULL DEFAULT '',
  recommended_post_slugs text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dimensions are publicly readable" ON public.dimensions
  FOR SELECT TO public USING (true);

-- Create daily_quiz_usage table
CREATE TABLE IF NOT EXISTS public.daily_quiz_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  quiz_date date NOT NULL DEFAULT CURRENT_DATE,
  specific_quiz_count integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, quiz_date),
  UNIQUE (session_id, quiz_date)
);

ALTER TABLE public.daily_quiz_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz usage" ON public.daily_quiz_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own quiz usage" ON public.daily_quiz_usage
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz usage" ON public.daily_quiz_usage
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can read by session" ON public.daily_quiz_usage
  FOR SELECT TO public USING (user_id IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anonymous can insert by session" ON public.daily_quiz_usage
  FOR INSERT TO public WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anonymous can update by session" ON public.daily_quiz_usage
  FOR UPDATE TO public USING (user_id IS NULL AND session_id IS NOT NULL) WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Add multilingual columns to quizzes
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS title_pt text NOT NULL DEFAULT '';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS description_pt text NOT NULL DEFAULT '';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS description_en text NOT NULL DEFAULT '';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Add multilingual columns to quiz_questions
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS question_text_pt text NOT NULL DEFAULT '';
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS question_text_en text NOT NULL DEFAULT '';
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS options_pt jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS options_en jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add columns to quiz_results
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS top_dimensions text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'pt';

-- Add columns to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS quiz_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_quiz_at timestamp with time zone;

-- Add columns to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_sensitive boolean NOT NULL DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

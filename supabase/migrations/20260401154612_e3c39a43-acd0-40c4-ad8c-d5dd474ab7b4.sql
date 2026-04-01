
-- Premium Assessments
CREATE TABLE public.premium_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_pt TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_pt TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT '',
  estimated_time INTEGER NOT NULL DEFAULT 10,
  question_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_premium BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.premium_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium assessments are publicly readable"
ON public.premium_assessments FOR SELECT TO public
USING (true);

-- Premium Assessment Questions
CREATE TABLE public.premium_assessment_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_slug TEXT NOT NULL,
  order_num INTEGER NOT NULL DEFAULT 0,
  section TEXT NOT NULL DEFAULT '',
  question_text_pt TEXT NOT NULL DEFAULT '',
  question_text_en TEXT NOT NULL DEFAULT '',
  options_pt JSONB NOT NULL DEFAULT '[]'::jsonb,
  options_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  dimension TEXT NOT NULL DEFAULT '',
  weight NUMERIC NOT NULL DEFAULT 1.0
);

ALTER TABLE public.premium_assessment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium assessment questions are publicly readable"
ON public.premium_assessment_questions FOR SELECT TO public
USING (true);

-- Premium Assessment Posts (link table)
CREATE TABLE public.premium_assessment_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_slug TEXT NOT NULL,
  post_slug TEXT NOT NULL,
  UNIQUE(assessment_slug, post_slug)
);

ALTER TABLE public.premium_assessment_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium assessment posts are publicly readable"
ON public.premium_assessment_posts FOR SELECT TO public
USING (true);

-- Premium Assessment Results
CREATE TABLE public.premium_assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  interpretation JSONB NOT NULL DEFAULT '{}'::jsonb,
  top_dimensions JSONB NOT NULL DEFAULT '[]'::jsonb,
  overall_score NUMERIC DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.premium_assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own premium results"
ON public.premium_assessment_results FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own premium results"
ON public.premium_assessment_results FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can insert premium results"
ON public.premium_assessment_results FOR INSERT TO public
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anonymous can read premium results by session"
ON public.premium_assessment_results FOR SELECT TO public
USING (user_id IS NULL AND session_id IS NOT NULL);

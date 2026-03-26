
-- Posts table
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  category_slug text NOT NULL DEFAULT '',
  layer integer NOT NULL DEFAULT 1,
  tags text[] NOT NULL DEFAULT '{}',
  featured_image text NOT NULL DEFAULT '',
  video_url text,
  quiz_slug text,
  related_post_slugs text[] NOT NULL DEFAULT '{}',
  faq jsonb NOT NULL DEFAULT '[]',
  reading_time integer NOT NULL DEFAULT 5,
  locale text NOT NULL DEFAULT 'pt',
  alternate_slug text,
  is_premium boolean NOT NULL DEFAULT false,
  author_name text NOT NULL DEFAULT '',
  author_avatar text NOT NULL DEFAULT '',
  author_bio text NOT NULL DEFAULT '',
  author_credentials text NOT NULL DEFAULT '',
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable" ON public.posts
  FOR SELECT USING (true);

-- Quizzes table
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'generic',
  post_slug text,
  estimated_time integer NOT NULL DEFAULT 5,
  question_count integer NOT NULL DEFAULT 0,
  dimensions text[] NOT NULL DEFAULT '{}',
  locale text NOT NULL DEFAULT 'pt'
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes are publicly readable" ON public.quizzes
  FOR SELECT USING (true);

-- Quiz questions table
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_slug text NOT NULL REFERENCES public.quizzes(slug) ON DELETE CASCADE,
  order_num integer NOT NULL DEFAULT 0,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'scale',
  options jsonb NOT NULL DEFAULT '[]',
  dimension text NOT NULL,
  weight float NOT NULL DEFAULT 1.0
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are publicly readable" ON public.quiz_questions
  FOR SELECT USING (true);

-- Quiz results table
CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  quiz_slug text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  scores jsonb NOT NULL DEFAULT '{}',
  overall_score float,
  severity text,
  recommended_post_slugs text[] NOT NULL DEFAULT '{}',
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz results" ON public.quiz_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can read by session" ON public.quiz_results
  FOR SELECT USING (user_id IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anyone can insert anonymous results" ON public.quiz_results
  FOR INSERT WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- User profiles table
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  is_premium boolean NOT NULL DEFAULT false,
  premium_until timestamptz,
  stripe_customer_id text,
  preferred_locale text NOT NULL DEFAULT 'pt',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User progress table
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_slug text NOT NULL,
  read_percentage float NOT NULL DEFAULT 0,
  quiz_completed boolean NOT NULL DEFAULT false,
  video_watched boolean NOT NULL DEFAULT false,
  bookmarked boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_slug)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON public.user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress" ON public.user_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

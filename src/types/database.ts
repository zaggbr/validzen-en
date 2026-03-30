/**
 * Application-level types mapped from the Supabase database schema.
 */

export interface Post {
  id: string;
  slug: string;
  locale: string;
  title: string;
  meta_title: string;
  meta_description: string;
  layer: number;
  category: string;
  category_slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  video_url: string | null;
  quiz_slug: string | null;
  alternate_slug: string | null;
  related_post_slugs: string[];
  is_premium: boolean;
  is_sensitive: boolean;
  reading_time: number;
  tags: string[];
  faq: FaqItem[];
  author_name: string;
  author_avatar: string;
  author_bio: string;
  author_credentials: string;
  published_at: string;
  updated_at: string;
  created_at: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  body: string;
  quizAfter?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface DimensionRow {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  icon: string;
  color: string;
  layer: number;
  interpretation_low_pt: string;
  interpretation_low_en: string;
  interpretation_moderate_pt: string;
  interpretation_moderate_en: string;
  interpretation_high_pt: string;
  interpretation_high_en: string;
  recommended_post_slugs: string[];
}

export interface Quiz {
  id: string;
  slug: string;
  locale: string;
  title: string;
  title_pt: string;
  title_en: string;
  description: string;
  description_pt: string;
  description_en: string;
  type: string;
  post_slug: string | null;
  question_count: number;
  estimated_time: number;
  dimensions: string[];
  is_active: boolean;
}

export interface QuizQuestion {
  id: string;
  quiz_slug: string;
  order_num: number;
  question_text: string;
  question_text_pt: string;
  question_text_en: string;
  question_type: string;
  options: QuizOption[];
  options_pt: QuizOption[];
  options_en: QuizOption[];
  dimension: string;
  weight: number;
}

export interface QuizOption {
  text: string;
  value: number;
}

export interface QuizResult {
  id: string;
  user_id: string | null;
  session_id: string | null;
  quiz_slug: string;
  answers: Record<string, number>;
  scores: Record<string, number>;
  overall_score: number | null;
  severity: string | null;
  top_dimensions: string[];
  recommended_post_slugs: string[];
  locale: string;
  completed_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_locale: string;
  is_premium: boolean;
  premium_until: string | null;
  stripe_customer_id: string | null;
  quiz_count: number;
  last_quiz_at: string | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  post_slug: string;
  read_percentage: number;
  quiz_completed: boolean;
  video_watched: boolean;
  bookmarked: boolean;
  updated_at: string;
}

export interface DailyQuizUsage {
  id: string;
  user_id: string | null;
  session_id: string | null;
  quiz_date: string;
  specific_quiz_count: number;
}

/** Helper to parse content HTML into sections for ToC */
export function parseContentSections(html: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const parts = html.split(/<h2[^>]*>/i);

  for (let i = 0; i < parts.length; i++) {
    if (i === 0 && !parts[i].includes("</h2>")) {
      if (parts[i].trim()) {
        sections.push({ id: "intro", heading: "", body: parts[i].trim() });
      }
      continue;
    }

    const closingIdx = parts[i].indexOf("</h2>");
    if (closingIdx === -1) continue;

    const heading = parts[i].substring(0, closingIdx).replace(/<[^>]*>/g, "").trim();
    const body = parts[i].substring(closingIdx + 5).trim();
    const id = heading
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    sections.push({ id: id || `section-${i}`, heading, body });
  }

  return sections;
}

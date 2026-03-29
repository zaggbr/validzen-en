/**
 * Application-level types mapped from the Supabase database schema.
 * The actual DB column names use snake_case; these interfaces provide
 * a typed reference for hooks and components.
 *
 * NOTE: The auto-generated types in src/integrations/supabase/types.ts
 * are the source of truth for Supabase queries. These types are used
 * at the application level after data is fetched.
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
  reading_time: number;
  tags: string[];
  faq: FaqItem[];
  author_name: string;
  author_avatar: string;
  author_bio: string;
  author_credentials: string;
  published_at: string;
  updated_at: string;
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

export interface Quiz {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  type: string;
  post_slug: string | null;
  question_count: number;
  estimated_time: number;
  dimensions: string[];
}

export interface QuizQuestion {
  id: string;
  quiz_slug: string;
  order_num: number;
  question_text: string;
  question_type: string;
  options: QuizOption[];
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
  recommended_post_slugs: string[];
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

/** Helper to parse content HTML into sections for ToC */
export function parseContentSections(html: string): ContentSection[] {
  const sections: ContentSection[] = [];
  // Split by h2 tags
  const parts = html.split(/<h2[^>]*>/i);

  for (let i = 0; i < parts.length; i++) {
    if (i === 0 && !parts[i].includes("</h2>")) {
      // Intro content before first h2
      if (parts[i].trim()) {
        sections.push({
          id: "intro",
          heading: "",
          body: parts[i].trim(),
        });
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

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
  category_slug: string; // derived: same as category (maps to categories.slug)
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
  posts_viewed_count: number;
  quizzes_completed_count: number;
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

/** Helper to parse content into sections for ToC — supports both HTML and Markdown */
export function parseContentSections(content: string): ContentSection[] {
  if (!content) return [];

  // Detect if content is Markdown (contains ## headings) or HTML (contains <h2>)
  const isMarkdown = /^##\s+/m.test(content) && !/<h2[\s>]/i.test(content);

  if (isMarkdown) {
    return parseMarkdownSections(content);
  }
  return parseHtmlSections(content);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMarkdownSections(md: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = md.split("\n");
  let currentHeading = "";
  let currentId = "intro";
  let bodyLines: string[] = [];

  const flush = () => {
    const body = bodyLines.join("\n").trim();
    if (body || currentHeading) {
      sections.push({ id: currentId, heading: currentHeading, body });
    }
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      flush();
      currentHeading = match[1].trim();
      currentId = slugify(currentHeading) || `section-${sections.length + 1}`;
      bodyLines = [];
    } else {
      bodyLines.push(line);
    }
  }
  flush();
  return sections;
}

function parseHtmlSections(html: string): ContentSection[] {
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
    const id = slugify(heading) || `section-${i}`;

    sections.push({ id, heading, body });
  }

  return sections;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  credentials: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  sections: ContentSection[];
  category: string;
  categorySlug: string;
  layer: 1 | 2 | 3;
  tags: string[];
  author: Author;
  featuredImage: string;
  videoUrl: string | null;
  quizSlug: string | null;
  relatedPosts: string[];
  faq: FaqItem[];
  readingTime: number;
  locale: "pt" | "en";
  alternateLocale: { locale: string; slug: string };
  isPremium: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  body: string; // HTML string
  quizAfter?: boolean; // show quiz CTA after this section
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  postCount: number;
  layers: number[];
}

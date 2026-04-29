import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Category } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

// posts table real schema: id, slug, locale, title, content, excerpt, category,
// category_slug, layer, is_premium, is_sensitive, reading_time, tags, faq,
// featured_image, video_url, quiz_slug, related_post_slugs, author_name,
// author_avatar, author_bio, author_credentials, meta_title, meta_description,
// published_at, updated_at, created_at, alternate_slug
// ✅ Filtering for locale='en' to ensure only English content is displayed.

function mapRow(row: any): Post {
  return {
    ...row,
    title: row.title || "",
    content: row.content || "",
    category_slug: row.category_slug || row.category || "",
    faq: Array.isArray(row.faq) ? row.faq : [],
    is_sensitive: row.is_sensitive ?? false,
    created_at: row.created_at ?? row.published_at,
  } as Post;
}

export function usePosts(categorySlug?: string, layer?: number) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["posts", categorySlug, layer],
    queryFn: async (): Promise<Post[]> => {
      // All 42 posts are locale='en' — simple single query
      let query = supabase
        .from("posts")
        .select("*")
        .eq("locale", "en")
        .order("published_at", { ascending: false });

      if (categorySlug) query = query.eq("category", categorySlug);
      if (layer) query = query.eq("layer", layer);

      const { data, error, status } = await query;

      if (error) {
        console.error("[usePosts] error:", {
          code: error.code, message: error.message, httpStatus: status,
        });
        toast({ title: "Error loading content", description: `[${status}] ${error.message}`, variant: "destructive" });
        throw error;
      }

      console.log(`[usePosts] posts found: ${data?.length ?? 0}`);
      return (data || []).map(mapRow);
    },
  });
}

export function usePostBySlug(slug: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["post", slug],
    queryFn: async (): Promise<Post | null> => {
      if (!slug) return null;
      console.log("[usePostBySlug] fetching slug:", slug);

      const { data, error, status } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("locale", "en")
        .maybeSingle();

      if (error) {
        console.error("[usePostBySlug] error:", { code: error.code, message: error.message, httpStatus: status });
        toast({ title: "Error loading article", description: `[${status}] ${error.message}`, variant: "destructive" });
        throw error;
      }
      console.log("[usePostBySlug] result:", data ? `found (locale: ${data.locale})` : "NOT FOUND");
      return data ? mapRow(data) : null;
    },
    enabled: !!slug,
  });
}

export function useRelatedPosts(slugs: string[]) {
  return useQuery({
    queryKey: ["related-posts", slugs],
    queryFn: async (): Promise<Post[]> => {
      if (slugs.length === 0) return [];
      const { data, error, status } = await supabase
        .from("posts")
        .select("*")
        .eq("locale", "en")
        .in("slug", slugs);

      if (error) {
        console.error("[useRelatedPosts] error:", { message: error.message, httpStatus: status });
        throw error;
      }
      return (data || []).map(mapRow);
    },
    enabled: slugs.length > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      // categories table: id, slug, name_en, name_pt, description_en,
      // description_pt, icon, color, sort_order
      const { data, error, status } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[useCategories] error:", { message: error.message, httpStatus: status });
        throw error;
      }
      return (data || []) as Category[];
    },
  });
}

/** Count posts per category (both locales) */
export function useCategoryPostCounts() {
  return useQuery({
    queryKey: ["category-post-counts"],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error, status } = await supabase
        .from("posts")
        .select("category")
        .eq("locale", "en");

      if (error) {
        console.error("[useCategoryPostCounts] error:", { message: error.message, httpStatus: status });
        throw error;
      }

      const counts: Record<string, number> = {};
      for (const row of data || []) {
        counts[row.category] = (counts[row.category] || 0) + 1;
      }
      return counts;
    },
  });
}

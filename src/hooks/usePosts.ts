import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Category } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

// posts table real schema: id, slug, locale, title, content, excerpt, category,
// category_slug, layer, is_premium, is_sensitive, reading_time, tags, faq,
// featured_image, video_url, quiz_slug, related_post_slugs, author_name,
// author_avatar, author_bio, author_credentials, meta_title, meta_description,
// published_at, updated_at, created_at, alternate_slug
// ⚠️ NO 'status', 'is_active', 'title_en', 'title_pt' columns

const MIN_EN_THRESHOLD = 10; // If fewer than this many 'en' posts, add 'pt' as fallback

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

/**
 * Fetch posts with automatic locale fallback.
 * Tries 'en' first. If fewer than MIN_EN_THRESHOLD results, also fetches
 * 'pt' posts and merges them (en first), so the blog never looks empty
 * while English content migration is ongoing.
 */
export function usePosts(categorySlug?: string, layer?: number) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["posts", categorySlug, layer],
    queryFn: async (): Promise<Post[]> => {
      console.log("[usePosts] fetching — categorySlug:", categorySlug, "layer:", layer);

      // ── Step 1: Fetch English posts ─────────────────────────────────────
      let enQuery = supabase
        .from("posts")
        .select("*")
        .eq("locale", "en")
        .order("published_at", { ascending: false });

      if (categorySlug) enQuery = enQuery.eq("category", categorySlug);
      if (layer) enQuery = enQuery.eq("layer", layer);

      const { data: enData, error: enError, status: enStatus } = await enQuery;

      if (enError) {
        console.error("[usePosts] EN query error:", {
          code: enError.code, message: enError.message,
          details: enError.details, hint: enError.hint, httpStatus: enStatus,
        });
        toast({ title: "Error loading content", description: `[${enStatus}] ${enError.message}`, variant: "destructive" });
        throw enError;
      }

      const enCount = enData?.length ?? 0;
      console.log(`[usePosts] EN posts found: ${enCount}`);

      // ── Step 2: Fallback — fetch PT posts if EN count is below threshold ─
      let ptData: any[] = [];
      if (enCount < MIN_EN_THRESHOLD) {
        console.log(`[usePosts] EN count (${enCount}) < threshold (${MIN_EN_THRESHOLD}). Fetching PT fallback…`);

        let ptQuery = supabase
          .from("posts")
          .select("*")
          .eq("locale", "pt")
          .order("published_at", { ascending: false });

        if (categorySlug) ptQuery = ptQuery.eq("category", categorySlug);
        if (layer) ptQuery = ptQuery.eq("layer", layer);

        const { data: ptResult, error: ptError, status: ptStatus } = await ptQuery;

        if (ptError) {
          console.error("[usePosts] PT fallback error:", { message: ptError.message, httpStatus: ptStatus });
          // Non-fatal: log but continue with whatever EN data we have
        } else {
          ptData = ptResult || [];
          console.log(`[usePosts] PT fallback posts found: ${ptData.length}`);
        }
      }

      // ── Step 3: Merge — EN first, then PT (deduped by slug) ─────────────
      const enSlugs = new Set((enData || []).map((p: any) => p.slug));
      const merged = [
        ...(enData || []),
        ...ptData.filter((p: any) => !enSlugs.has(p.slug)),
      ];

      console.log(`[usePosts] total merged posts: ${merged.length} (${enCount} en + ${ptData.filter((p: any) => !enSlugs.has(p.slug)).length} pt fallback)`);
      console.log("[usePosts] first record sample:", merged[0] ?? "NO DATA");

      return merged.map(mapRow);
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
        .select("category");

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

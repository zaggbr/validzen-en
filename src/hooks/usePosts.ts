import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Category } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

function mapRow(row: any): Post {
  return {
    ...row,
    // posts table uses plain 'title' and 'content' — no _en/_pt variants
    title: row.title || "",
    content: row.content || "",
    category_slug: row.category_slug || row.category,
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
      console.log("[usePosts] fetching — categorySlug:", categorySlug, "layer:", layer);
      console.log("[usePosts] supabase URL:", import.meta.env.VITE_SUPABASE_URL);

      // NOTE: posts table has no 'status' or 'is_active' column.
      // Fetching ALL records to diagnose whether data exists.
      let query = supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (categorySlug) query = query.eq("category", categorySlug);
      if (layer) query = query.eq("layer", layer);

      const { data, error, status } = await query;

      console.log("[usePosts] response — status:", status, "count:", data?.length ?? 0);
      if (error) {
        console.error("[usePosts] Supabase error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          httpStatus: status,
        });
        toast({ title: "Error loading content", description: `[${status}] ${error.message}`, variant: "destructive" });
        throw error;
      }

      console.log("[usePosts] first record sample:", data?.[0] ?? "NO DATA");
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
        .maybeSingle();

      if (error) {
        console.error("[usePostBySlug] Supabase error:", { code: error.code, message: error.message, httpStatus: status });
        toast({ title: "Error loading article", description: `[${status}] ${error.message}`, variant: "destructive" });
        throw error;
      }
      console.log("[usePostBySlug] result:", data ? "found" : "NOT FOUND");
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

/** Count posts per category */
export function useCategoryPostCounts() {
  return useQuery({
    queryKey: ["category-post-counts"],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error, status } = await supabase.from("posts").select("category");
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

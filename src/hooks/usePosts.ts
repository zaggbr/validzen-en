import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Category } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

function mapRow(row: any): Post {
  return {
    ...row,
    faq: Array.isArray(row.faq) ? row.faq : [],
    is_sensitive: row.is_sensitive ?? false,
    created_at: row.created_at ?? row.published_at,
  } as Post;
}

export function usePosts(locale?: string, categorySlug?: string, layer?: number) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["posts", locale, categorySlug, layer],
    queryFn: async (): Promise<Post[]> => {
      let query = supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (locale) query = query.eq("locale", locale);
      if (categorySlug) query = query.eq("category", categorySlug);
      if (layer) query = query.eq("layer", layer);

      const { data, error } = await query;
      if (error) {
        toast({ title: "Erro ao carregar posts", description: error.message, variant: "destructive" });
        throw error;
      }
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
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        toast({ title: "Erro ao carregar post", description: error.message, variant: "destructive" });
        throw error;
      }
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
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in("slug", slugs);

      if (error) throw error;
      return (data || []).map(mapRow);
    },
    enabled: slugs.length > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data || []) as Category[];
    },
  });
}

/** Count posts per category for a given locale */
export function useCategoryPostCounts(locale?: string) {
  return useQuery({
    queryKey: ["category-post-counts", locale],
    queryFn: async (): Promise<Record<string, number>> => {
      let query = supabase.from("posts").select("category");
      if (locale) query = query.eq("locale", locale);

      const { data, error } = await query;
      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const row of data || []) {
        counts[row.category] = (counts[row.category] || 0) + 1;
      }
      return counts;
    },
  });
}

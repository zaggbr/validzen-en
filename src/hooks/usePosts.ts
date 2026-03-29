import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

function mapRow(row: any): Post {
  return {
    ...row,
    faq: Array.isArray(row.faq) ? row.faq : [],
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
      if (categorySlug) query = query.eq("category_slug", categorySlug);
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

export function useCategories(locale?: string) {
  return useQuery({
    queryKey: ["categories", locale],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("category, category_slug");

      if (locale) query = query.eq("locale", locale);

      const { data, error } = await query;
      if (error) throw error;

      // Aggregate categories from posts
      const catMap = new Map<string, { slug: string; name: string; count: number }>();
      for (const row of data || []) {
        const existing = catMap.get(row.category_slug);
        if (existing) {
          existing.count++;
        } else {
          catMap.set(row.category_slug, {
            slug: row.category_slug,
            name: row.category,
            count: 1,
          });
        }
      }
      return Array.from(catMap.values());
    },
  });
}

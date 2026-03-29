import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProgress } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export function useUserProgress() {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async (): Promise<UserProgress[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast({ title: "Erro ao carregar progresso", description: error.message, variant: "destructive" });
        throw error;
      }
      return (data || []) as UserProgress[];
    },
    enabled: !!user,
  });
}

export function useUpdateReadProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postSlug, percentage }: { postSlug: string; percentage: number }) => {
      if (!user) return;
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: user.id, post_slug: postSlug, read_percentage: percentage, updated_at: new Date().toISOString() },
          { onConflict: "user_id,post_slug" }
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress"] }),
  });
}

export function useToggleBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postSlug, bookmarked }: { postSlug: string; bookmarked: boolean }) => {
      if (!user) return;
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: user.id, post_slug: postSlug, bookmarked, updated_at: new Date().toISOString() },
          { onConflict: "user_id,post_slug" }
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress"] }),
  });
}

export function useMarkQuizCompleted() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postSlug: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: user.id, post_slug: postSlug, quiz_completed: true, updated_at: new Date().toISOString() },
          { onConflict: "user_id,post_slug" }
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress"] }),
  });
}

export function useMarkVideoWatched() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postSlug: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: user.id, post_slug: postSlug, video_watched: true, updated_at: new Date().toISOString() },
          { onConflict: "user_id,post_slug" }
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress"] }),
  });
}

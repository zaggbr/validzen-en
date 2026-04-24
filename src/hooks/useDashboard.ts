import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { QuizResult } from "@/types/database";
import { getSessionId } from "@/lib/anonymousSession";

function mapResult(row: any): QuizResult {
  return {
    ...row,
    answers: row.answers || {},
    scores: row.scores || {},
    top_dimensions: row.top_dimensions || [],
    recommended_post_slugs: row.recommended_post_slugs || [],
    locale: row.locale || "en",
  } as QuizResult;
}

export function useUserResults() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-results", user?.id],
    queryFn: async (): Promise<QuizResult[]> => {
      if (!user) {
        const sessionId = getSessionId();
        if (!sessionId) return [];

        const { data, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("session_id", sessionId)
          .is("user_id", null)
          .order("completed_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(mapResult);
      }

      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapResult);
    },
  });
}

export function usePremiumResults() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["premium-results", user?.id],
    queryFn: async (): Promise<any[]> => {
      if (!user) {
        const sessionId = getSessionId();
        if (!sessionId) return [];

        const { data, error } = await supabase
          .from("premium_assessment_results" as any)
          .select("*")
          .eq("session_id", sessionId)
          .is("user_id", null)
          .order("completed_at", { ascending: false });

        if (error) throw error;
        return data || [];
      }

      const { data, error } = await supabase
        .from("premium_assessment_results" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useLatestResult() {
  const { data: results, isFetching, ...rest } = useUserResults();
  const latestResult = results && results.length > 0 ? results[0] : null;
  return { data: latestResult, results, isFetching, ...rest };
}

export function useResultById(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["result", id],
    queryFn: async (): Promise<QuizResult | null> => {
      if (!id) return null;

      if (user) {
        const { data, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) return mapResult(data);
      }

      const sessionId = getSessionId();
      if (sessionId) {
        const { data, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("id", id)
          .eq("session_id", sessionId)
          .is("user_id", null)
          .maybeSingle();

        if (!error && data) return mapResult(data);
      }

      // Fallback: localStorage
      try {
        const raw = localStorage.getItem("validzen_quiz_results");
        if (raw) {
          const localResults = JSON.parse(raw);
          const found = localResults.find((r: any) => r.id === id);
          if (found) {
            return {
              id: found.id,
              user_id: null,
              session_id: null,
              quiz_slug: found.quizId || "general",
              answers: found.answers || {},
              scores: found.scores || {},
              overall_score: null,
              severity: null,
              top_dimensions: [],
              recommended_post_slugs: [],
              locale: "en",
              completed_at: found.completedAt || new Date().toISOString(),
            } as QuizResult;
          }
        }
      } catch { /* silently fail */ }

      return null;
    },
    enabled: !!id,
  });
}

export function useProgressOverTime() {
  const { data: results } = useUserResults();

  if (!results || results.length === 0) return [];

  return results
    .slice()
    .reverse()
    .map((r) => ({
      date: new Date(r.completed_at).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      ...r.scores,
    }));
}

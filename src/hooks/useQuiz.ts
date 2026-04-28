import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Quiz, QuizQuestion, QuizOption } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateSessionId } from "@/lib/anonymousSession";

function mapQuizRow(row: any): Quiz {
  return {
    ...row,
    title: row.title_en || row.title,
    description: row.description_en || row.description,
    is_active: row.is_active ?? true,
  } as Quiz;
}

function mapQuestionRow(row: any): QuizQuestion {
  // Always prefer _en columns; fall back to generic column
  const options =
    Array.isArray(row.options_en) && row.options_en.length > 0
      ? row.options_en
      : row.options ?? [];

  const questionText = row.question_text_en || row.question_text || "";

  return {
    ...row,
    question_text: questionText,
    options: Array.isArray(options) ? (options as QuizOption[]) : [],
  } as QuizQuestion;
}

export function useQuizBySlug(slug: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["quiz", slug],
    queryFn: async (): Promise<Quiz | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        toast({ title: "Error loading journey", description: error.message, variant: "destructive" });
        throw error;
      }
      return data ? mapQuizRow(data) : null;
    },
    enabled: !!slug,
  });
}

export function useQuizQuestions(quizSlug: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["quiz-questions", quizSlug],
    queryFn: async (): Promise<QuizQuestion[]> => {
      if (!quizSlug) return [];
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_slug", quizSlug)
        .order("order_num", { ascending: true });

      if (error) {
        toast({ title: "Error loading discovery steps", description: error.message, variant: "destructive" });
        throw error;
      }
      return (data || []).map((r) => mapQuestionRow(r));
    },
    enabled: !!quizSlug,
  });
}

export function calculateScores(
  questions: QuizQuestion[],
  answers: Record<string, number>
): Record<string, number> {
  const dimensionTotals: Record<string, { sum: number; maxPossible: number }> = {};

  for (const q of questions) {
    if (!dimensionTotals[q.dimension]) {
      dimensionTotals[q.dimension] = { sum: 0, maxPossible: 0 };
    }
    const maxOptionValue = Math.max(...q.options.map((o) => o.value));
    dimensionTotals[q.dimension].maxPossible += maxOptionValue * q.weight;

    const answerValue = answers[q.id];
    if (answerValue != null) {
      dimensionTotals[q.dimension].sum += answerValue * q.weight;
    }
  }

  const scores: Record<string, number> = {};
  for (const [dim, { sum, maxPossible }] of Object.entries(dimensionTotals)) {
    scores[dim] = maxPossible > 0 ? Math.round((sum / maxPossible) * 100) : 0;
  }
  return scores;
}

export function useSubmitQuizResult() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      quizSlug: string;
      answers: Record<string, number>;
      scores: Record<string, number>;
      locale?: string;
    }) => {
      const { quizSlug, answers, scores, locale = "en" } = params;
      const values = Object.values(scores);
      const overall = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;
      const severity = overall <= 33 ? "mild" : overall <= 66 ? "moderate" : "intense";

      // Get top 3 dimensions
      const topDimensions = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([dim]) => dim);

      const insertData: any = {
        quiz_slug: quizSlug,
        answers,
        scores,
        overall_score: overall,
        severity,
        top_dimensions: topDimensions,
        locale,
        completed_at: new Date().toISOString(),
      };

      if (user) {
        insertData.user_id = user.id;
      } else {
        insertData.session_id = getOrCreateSessionId();
      }

      const { data, error } = await supabase
        .from("quiz_results")
        .insert(insertData)
        .select("id")
        .single();

      if (error) {
        toast({ title: "Error saving discovery", description: error.message, variant: "destructive" });
        throw error;
      }

      // Backup to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem("validzen_quiz_results") || "[]");
        existing.push({ id: data.id, quizId: quizSlug, completedAt: insertData.completed_at, answers, scores });
        localStorage.setItem("validzen_quiz_results", JSON.stringify(existing));
      } catch { /* silently fail */ }

      return data.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-results"] });
      queryClient.invalidateQueries({ queryKey: ["user-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["latest-result"] });
    },
  });
}

export function useResetQuizMap() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Delete results from both tables
      const deleteResults = supabase
        .from("quiz_results")
        .delete()
        .eq("user_id", user.id);

      const deletePremium = supabase
        .from("premium_assessment_results")
        .delete()
        .eq("user_id", user.id);

      const [res1, res2] = await Promise.all([deleteResults, deletePremium]);

      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      // Limpar localStorage
      localStorage.removeItem("validzen_quiz_results");

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-results"] });
      queryClient.invalidateQueries({ queryKey: ["user-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["latest-result"] });
      queryClient.invalidateQueries({ queryKey: ["premium-results"] });
      toast({ 
        title: "Blueprint Reset", 
        description: "All journey progress has been cleared successfully.",
      });
    },
  });
}

export function useDeleteQuizResult() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (quizSlug: string) => {
      let query = supabase.from("quiz_results").delete().eq("quiz_slug", quizSlug);
      
      if (user) {
        query = query.eq("user_id", user.id);
      } else {
        const sessionId = getSessionId();
        if (sessionId) query = query.eq("session_id", sessionId).is("user_id", null);
      }

      const { error } = await query;

      if (error) {
        toast({ title: "Error removing journey", description: error.message, variant: "destructive" });
        throw error;
      }
      return quizSlug;
    },
    onMutate: async (quizSlug: string) => {
      // Cancel any in-flight re-fetches
      await queryClient.cancelQueries({ queryKey: ["user-results"] });

      // Snapshot current data for rollback
      const previousResults = queryClient.getQueryData(["user-results", user?.id]);

      // Optimistically remove from cache immediately
      queryClient.setQueryData(["user-results", user?.id], (old: any) =>
        Array.isArray(old) ? old.filter((r: any) => r.quiz_slug !== quizSlug) : old
      );

      return { previousResults };
    },
    onError: (_err, _quizSlug, context) => {
      // Rollback on error
      if (context?.previousResults !== undefined) {
        queryClient.setQueryData(["user-results", user?.id], context.previousResults);
      }
    },
    onSettled: () => {
      // Always re-sync with server
      queryClient.invalidateQueries({ queryKey: ["user-results"] });
      queryClient.invalidateQueries({ queryKey: ["user-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["latest-result"] });
    },
    onSuccess: () => {
      toast({ title: "Journey reset", description: "The discovery path has been cleared and you can begin again." });
    },
  });
}

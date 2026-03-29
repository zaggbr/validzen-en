import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Quiz, QuizQuestion, QuizOption } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateSessionId } from "@/lib/anonymousSession";

function mapQuizRow(row: any): Quiz {
  return row as Quiz;
}

function mapQuestionRow(row: any): QuizQuestion {
  return {
    ...row,
    options: Array.isArray(row.options) ? row.options as QuizOption[] : [],
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
        toast({ title: "Erro ao carregar quiz", description: error.message, variant: "destructive" });
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
        toast({ title: "Erro ao carregar perguntas", description: error.message, variant: "destructive" });
        throw error;
      }
      return (data || []).map(mapQuestionRow);
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      quizSlug: string;
      answers: Record<string, number>;
      scores: Record<string, number>;
    }) => {
      const { quizSlug, answers, scores } = params;
      const values = Object.values(scores);
      const overall =
        values.length > 0
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0;
      const severity =
        overall <= 33 ? "leve" : overall <= 66 ? "moderado" : "severo";

      const insertData: any = {
        quiz_slug: quizSlug,
        answers,
        scores,
        overall_score: overall,
        severity,
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
        toast({ title: "Erro ao salvar resultado", description: error.message, variant: "destructive" });
        throw error;
      }

      // Also save to localStorage as backup
      try {
        const existing = JSON.parse(
          localStorage.getItem("validzen_quiz_results") || "[]"
        );
        existing.push({
          id: data.id,
          quizId: quizSlug,
          completedAt: insertData.completed_at,
          answers,
          scores,
        });
        localStorage.setItem("validzen_quiz_results", JSON.stringify(existing));
      } catch {
        // silently fail
      }

      return data.id as string;
    },
  });
}

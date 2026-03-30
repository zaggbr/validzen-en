import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Quiz, QuizQuestion, QuizOption } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateSessionId } from "@/lib/anonymousSession";

function mapQuizRow(row: any, locale: string): Quiz {
  return {
    ...row,
    title: locale === "en" ? (row.title_en || row.title) : (row.title_pt || row.title),
    description: locale === "en" ? (row.description_en || row.description) : (row.description_pt || row.description),
    is_active: row.is_active ?? true,
  } as Quiz;
}

function mapQuestionRow(row: any, locale: string): QuizQuestion {
  const options = locale === "en"
    ? (Array.isArray(row.options_en) && row.options_en.length > 0 ? row.options_en : row.options)
    : (Array.isArray(row.options_pt) && row.options_pt.length > 0 ? row.options_pt : row.options);

  const questionText = locale === "en"
    ? (row.question_text_en || row.question_text)
    : (row.question_text_pt || row.question_text);

  return {
    ...row,
    question_text: questionText,
    options: Array.isArray(options) ? options as QuizOption[] : [],
  } as QuizQuestion;
}

export function useQuizBySlug(slug: string | undefined, locale: string = "pt") {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["quiz", slug, locale],
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
      return data ? mapQuizRow(data, locale) : null;
    },
    enabled: !!slug,
  });
}

export function useQuizQuestions(quizSlug: string | undefined, locale: string = "pt") {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["quiz-questions", quizSlug, locale],
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
      return (data || []).map((r) => mapQuestionRow(r, locale));
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
      locale?: string;
    }) => {
      const { quizSlug, answers, scores, locale = "pt" } = params;
      const values = Object.values(scores);
      const overall = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;
      const severity = overall <= 33 ? "leve" : overall <= 66 ? "moderado" : "severo";

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
        toast({ title: "Erro ao salvar resultado", description: error.message, variant: "destructive" });
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
  });
}

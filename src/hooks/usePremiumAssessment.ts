import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  PremiumAssessment,
  PremiumAssessmentQuestion,
  PremiumOption,
  AssessmentInterpretation,
} from "@/types/premium-assessment";
import { PATTERN_PROFILES } from "@/types/premium-assessment";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateSessionId } from "@/lib/anonymousSession";

// ─── Mapper ─────────────────────────────────────────────────────────────────

function mapQuestion(row: any): PremiumAssessmentQuestion {
  // premium_assessment_questions has ONLY _en and _pt columns (no plain column)
  const questionText = row.question_text_en || row.question_text_pt || "";

  const options =
    (Array.isArray(row.options_en) && row.options_en.length > 0)
      ? row.options_en
      : (Array.isArray(row.options_pt) && row.options_pt.length > 0)
        ? row.options_pt
        : [];

  return {
    ...row,
    question_text: questionText,   // resolved field for UI consumption
    options,                        // resolved options for UI consumption
    options_en: Array.isArray(row.options_en) ? row.options_en : [],
    options_pt: Array.isArray(row.options_pt) ? row.options_pt : [],
  } as PremiumAssessmentQuestion;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Fetch the premium assessment linked to a post (via premium_assessment_posts) */
export function usePremiumAssessmentForPost(postSlug: string | undefined) {
  return useQuery({
    queryKey: ["premium-assessment-for-post", postSlug],
    queryFn: async (): Promise<PremiumAssessment | null> => {
      if (!postSlug) return null;
      console.log("[usePremiumAssessmentForPost] fetching for post:", postSlug);

      const { data: link, error: linkErr } = await supabase
        .from("premium_assessment_posts" as any)
        .select("assessment_slug")
        .eq("post_slug", postSlug)
        .maybeSingle();

      if (linkErr) {
        console.error("[usePremiumAssessmentForPost] link error:", linkErr);
        return null;
      }
      if (!link) {
        console.log("[usePremiumAssessmentForPost] no link found for post:", postSlug);
        return null;
      }

      // NOTE: NOT filtering is_active for diagnostics
      const { data, error, status } = await supabase
        .from("premium_assessments" as any)
        .select("*")
        .eq("slug", (link as any).assessment_slug)
        .maybeSingle();

      if (error) {
        console.error("[usePremiumAssessmentForPost] assessment error:", { message: error.message, httpStatus: status });
        return null;
      }
      return data as unknown as PremiumAssessment;
    },
    enabled: !!postSlug,
  });
}

/** Fetch assessment by slug */
export function usePremiumAssessmentBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["premium-assessment", slug],
    queryFn: async (): Promise<PremiumAssessment | null> => {
      if (!slug) return null;
      console.log("[usePremiumAssessmentBySlug] fetching slug:", slug);

      // NOTE: NOT filtering is_active for diagnostics
      const { data, error, status } = await supabase
        .from("premium_assessments" as any)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("[usePremiumAssessmentBySlug] error:", { message: error.message, httpStatus: status });
        return null;
      }
      console.log("[usePremiumAssessmentBySlug] result:", data
        ? { slug: (data as any).slug, title_en: (data as any).title_en }
        : "NOT FOUND");
      return data as unknown as PremiumAssessment;
    },
    enabled: !!slug,
  });
}

/** Fetch questions for a premium assessment */
export function usePremiumAssessmentQuestions(
  assessmentSlug: string | undefined
) {
  return useQuery({
    queryKey: ["premium-assessment-questions", assessmentSlug],
    queryFn: async (): Promise<PremiumAssessmentQuestion[]> => {
      if (!assessmentSlug) return [];
      console.log("[usePremiumAssessmentQuestions] fetching for:", assessmentSlug);

      const { data, error, status } = await supabase
        .from("premium_assessment_questions" as any)
        .select("*")
        .eq("assessment_slug", assessmentSlug)
        .order("order_num", { ascending: true });

      if (error) {
        console.error("[usePremiumAssessmentQuestions] error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint, httpStatus: status,
        });
        throw error;
      }
      console.log("[usePremiumAssessmentQuestions] count:", data?.length ?? 0);
      return ((data as any[]) || []).map((r) => mapQuestion(r));
    },
    enabled: !!assessmentSlug,
  });
}

// ─── Score Calculation ────────────────────────────────────────────────────────

/** Calculate pattern scores from answers (narrative 4-option style) */
export function calculatePatternScores(
  questions: PremiumAssessmentQuestion[],
  answers: Record<string, number>
): {
  scores: Record<string, number>;
  dominant_pattern: string;
  secondary_pattern: string;
  profile_name: string;
  profile_slug: string;
  overall_score: number;
} {
  const patterns = [
    "controle_performance",
    "paralisia_evitacao",
    "busca_sentido_ceticismo",
    "desconexao_dissociacao",
  ];

  const counts: Record<string, number> = {};
  patterns.forEach((p) => (counts[p] = 0));

  let totalAnswered = 0;

  for (const q of questions) {
    const answerValue = answers[q.id];
    if (answerValue == null) continue;
    totalAnswered++;

    const patternIdx = Math.min(answerValue, patterns.length - 1);
    counts[patterns[patternIdx]]++;
  }

  const scores: Record<string, number> = {};
  patterns.forEach((p) => {
    scores[p] = totalAnswered > 0 ? Math.round((counts[p] / totalAnswered) * 100) : 0;
  });

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const dominant_pattern = sorted[0]?.[0] || patterns[0];
  const secondary_pattern = sorted[1]?.[0] || patterns[1];
  const overall_score = scores[dominant_pattern] || 0;
  const profile_slug = dominant_pattern;
  const profile = PATTERN_PROFILES[dominant_pattern];
  // Always English — this is an English-only product
  const profile_name = profile ? profile.en : dominant_pattern;

  return { scores, dominant_pattern, secondary_pattern, profile_name, profile_slug, overall_score };
}

// ─── Submit Mutation ─────────────────────────────────────────────────────────

/** Submit premium assessment result */
export function useSubmitPremiumResult() {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      assessmentSlug: string;
      answers: Record<string, number>;
      scores: Record<string, number>;
      interpretation: AssessmentInterpretation;
      overall_score: number;
      top_dimensions: string[];
    }) => {
      const insertData: any = {
        assessment_slug: params.assessmentSlug,
        answers: params.answers,
        scores: params.scores,
        interpretation: params.interpretation,
        top_dimensions: params.top_dimensions,
        overall_score: params.overall_score,
        completed_at: new Date().toISOString(),
      };

      if (user) {
        insertData.user_id = user.id;
      } else {
        insertData.session_id = getOrCreateSessionId();
      }

      const { data, error, status } = await supabase
        .from("premium_assessment_results" as any)
        .insert(insertData)
        .select("id")
        .single();

      if (error) {
        console.error("[useSubmitPremiumResult] error:", {
          code: error.code, message: error.message, httpStatus: status,
        });
        toast({
          title: "Failed to save findings",
          description: "We couldn't preserve your progress. Please check your connection and try again.",
          variant: "destructive",
        });
        throw error;
      }

      return (data as any).id as string;
    },
  });
}

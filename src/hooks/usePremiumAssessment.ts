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

function mapQuestion(row: any, locale: string): PremiumAssessmentQuestion {
  return {
    ...row,
    options_pt: Array.isArray(row.options_pt) ? row.options_pt : [],
    options_en: Array.isArray(row.options_en) ? row.options_en : [],
  } as PremiumAssessmentQuestion;
}

/** Fetch the premium assessment linked to a post (via premium_assessment_posts) */
export function usePremiumAssessmentForPost(postSlug: string | undefined) {
  return useQuery({
    queryKey: ["premium-assessment-for-post", postSlug],
    queryFn: async (): Promise<PremiumAssessment | null> => {
      if (!postSlug) return null;

      const { data: link, error: linkErr } = await supabase
        .from("premium_assessment_posts" as any)
        .select("assessment_slug")
        .eq("post_slug", postSlug)
        .maybeSingle();

      if (linkErr || !link) return null;

      const { data, error } = await supabase
        .from("premium_assessments" as any)
        .select("*")
        .eq("slug", (link as any).assessment_slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) return null;
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
      const { data, error } = await supabase
        .from("premium_assessments" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) return null;
      return data as unknown as PremiumAssessment;
    },
    enabled: !!slug,
  });
}

/** Fetch questions for a premium assessment */
export function usePremiumAssessmentQuestions(
  assessmentSlug: string | undefined,
  locale: string = "en"
) {
  return useQuery({
    queryKey: ["premium-assessment-questions", assessmentSlug, locale],
    queryFn: async (): Promise<PremiumAssessmentQuestion[]> => {
      if (!assessmentSlug) return [];
      const { data, error } = await supabase
        .from("premium_assessment_questions" as any)
        .select("*")
        .eq("assessment_slug", assessmentSlug)
        .order("order_num", { ascending: true });

      if (error) throw error;
      return ((data as any[]) || []).map((r) => mapQuestion(r, locale));
    },
    enabled: !!assessmentSlug,
  });
}

/** Calculate pattern scores from answers (narrative 4-option style) */
export function calculatePatternScores(
  questions: PremiumAssessmentQuestion[],
  answers: Record<string, number>,
  locale: string = "en"
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
  const profile_name = profile ? (locale === "en" ? profile.en : profile.pt) : dominant_pattern;

  return { scores, dominant_pattern, secondary_pattern, profile_name, profile_slug, overall_score };
}

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

      const { data, error } = await supabase
        .from("premium_assessment_results" as any)
        .insert(insertData)
        .select("id")
        .single();

      if (error) {
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

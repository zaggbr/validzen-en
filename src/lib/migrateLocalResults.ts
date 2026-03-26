import { supabase } from "@/integrations/supabase/client";
import { getResultsFromLocalStorage } from "./quizScoring";

export async function migrateLocalResultsToSupabase(userId: string) {
  const localResults = getResultsFromLocalStorage();
  if (localResults.length === 0) return;

  for (const r of localResults) {
    const scores = r.scores;
    const values = Object.values(scores);
    const overall = values.length > 0
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;
    const severity = overall <= 33 ? "leve" : overall <= 66 ? "moderado" : "severo";

    await supabase.from("quiz_results").insert({
      user_id: userId,
      quiz_slug: r.quizId === "generic" ? "geral" : r.quizId,
      answers: r.answers,
      scores: r.scores,
      overall_score: overall,
      severity,
      completed_at: r.completedAt,
    });
  }

  localStorage.removeItem("validzen_quiz_results");
}

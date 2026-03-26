import { QuizQuestion, QuizResult } from "@/data/quizTypes";
import { supabase } from "@/integrations/supabase/client";

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

export function generateResultId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveResultToLocalStorage(result: QuizResult): void {
  const existing = getResultsFromLocalStorage();
  existing.push(result);
  localStorage.setItem("validzen_quiz_results", JSON.stringify(existing));
}

export function getResultsFromLocalStorage(): QuizResult[] {
  try {
    const raw = localStorage.getItem("validzen_quiz_results");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getResultById(id: string): QuizResult | undefined {
  return getResultsFromLocalStorage().find((r) => r.id === id);
}

export function getScoreLevel(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "Baixo", color: "text-accent" };
  if (score <= 60) return { label: "Moderado", color: "text-secondary" };
  return { label: "Alto", color: "text-destructive" };
}

export async function saveResultToSupabase(
  result: QuizResult,
  userId: string
): Promise<string | null> {
  const scores = result.scores;
  const values = Object.values(scores);
  const overall = values.length > 0
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const severity = overall <= 33 ? "leve" : overall <= 66 ? "moderado" : "severo";

  const { data, error } = await supabase.from("quiz_results").insert({
    user_id: userId,
    quiz_slug: result.quizId === "generic" ? "geral" : result.quizId,
    answers: result.answers,
    scores: result.scores,
    overall_score: overall,
    severity,
    completed_at: result.completedAt,
  }).select("id").single();

  if (error) {
    console.error("Error saving result to DB:", error);
    return null;
  }
  return data?.id ?? null;
}

function getSessionId(): string {
  let sid = localStorage.getItem("validzen_session_id");
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("validzen_session_id", sid);
  }
  return sid;
}

export async function saveResultAnonymous(
  result: QuizResult
): Promise<string | null> {
  const scores = result.scores;
  const values = Object.values(scores);
  const overall = values.length > 0
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const severity = overall <= 33 ? "leve" : overall <= 66 ? "moderado" : "severo";

  const { data, error } = await supabase.from("quiz_results").insert({
    session_id: getSessionId(),
    quiz_slug: result.quizId === "generic" ? "geral" : result.quizId,
    answers: result.answers,
    scores: result.scores,
    overall_score: overall,
    severity,
    completed_at: result.completedAt,
  }).select("id").single();

  if (error) {
    console.error("Error saving anonymous result:", error);
    // Fallback to localStorage
    saveResultToLocalStorage(result);
    return null;
  }
  return data?.id ?? null;
}

import { QuizQuestion, QuizResult } from "@/data/quizTypes";

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

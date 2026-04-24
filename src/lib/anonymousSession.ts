import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "validzen_session_id";

export function getOrCreateSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Migrate anonymous quiz results (by session_id) to a logged-in user.
 * Called after login/signup.
 */
export async function migrateAnonymousResults(userId: string): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) return;

  // Fetch anonymous results for this session
  const { data: anonResults } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("session_id", sessionId)
    .is("user_id", null);

  if (!anonResults || anonResults.length === 0) return;

  // Re-insert with user_id (can't UPDATE due to RLS, so insert new rows)
  for (const r of anonResults) {
    await supabase.from("quiz_results").insert({
      user_id: userId,
      quiz_slug: r.quiz_slug,
      answers: r.answers,
      scores: r.scores,
      overall_score: r.overall_score,
      severity: r.severity,
      completed_at: r.completed_at,
    });
  }

  // Also migrate any localStorage results
  try {
    const raw = localStorage.getItem("validzen_quiz_results");
    if (raw) {
      const localResults = JSON.parse(raw);
      for (const r of localResults) {
        const scores = r.scores as Record<string, number>;
        const values = Object.values(scores);
        const overall =
          values.length > 0
            ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
            : 0;
        const severity =
          overall <= 33 ? "mild" : overall <= 66 ? "moderate" : "intense";

        await supabase.from("quiz_results").insert({
          user_id: userId,
          quiz_slug: r.quizId === "generic" ? "general" : r.quizId,
          answers: r.answers,
          scores: r.scores,
          overall_score: overall,
          severity,
          completed_at: r.completedAt,
        });
      }
      localStorage.removeItem("validzen_quiz_results");
    }
  } catch {
    // silently fail
  }
}

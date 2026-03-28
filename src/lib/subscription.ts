export const STRIPE_PRICES = {
  monthly: "price_1TFvvXEar8K5EnzJWZf4VIh2",
  yearly: "price_1TFvw7Ear8K5EnzJ4PpIeCQM",
} as const;

export const STRIPE_PRODUCTS = {
  monthly: "prod_UEOiSqnAadBRcA",
  yearly: "prod_UEOjiB09xmLBtF",
} as const;

/** Check how many specific quizzes a free user took today */
export function getSpecificQuizCountToday(): number {
  try {
    const raw = localStorage.getItem("validzen_quiz_daily");
    if (!raw) return 0;
    const data = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return data.date === today ? data.count : 0;
  } catch {
    return 0;
  }
}

export function incrementSpecificQuizCount(): void {
  const today = new Date().toISOString().slice(0, 10);
  const current = getSpecificQuizCountToday();
  localStorage.setItem(
    "validzen_quiz_daily",
    JSON.stringify({ date: today, count: current + 1 })
  );
}

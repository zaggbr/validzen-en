export const STRIPE_PRICES = {
  monthly: "price_1TIGtiEjsgJYYHf3rdkRCz7I",
  promo6: "price_1TIAEAEjsgJYYHf3xEorHS2I",
} as const;

export const STRIPE_PRODUCTS = {
  monthly: "prod_UGhdnrnIAUF9g8", // General Product ID for Validzen Content
  promo6: "prod_UGhdnrnIAUF9g8",   // Same product, different prices
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

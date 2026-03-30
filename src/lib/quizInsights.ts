import type { DimensionRow } from "@/types/database";

interface TopDimensionItem {
  dimension: string;
  score: number;
  label: string;
  emoji: string;
  severity: "leve" | "moderado" | "elevado";
  severityColor: string;
  interpretation: string;
}

/**
 * Get top dimensions using data from the dimensions table.
 * Falls back to slug as label if dimensions data is not provided.
 */
export function getTopDimensions(
  scores: Record<string, number>,
  dimensions: DimensionRow[] = [],
  locale: string = "pt",
  count = 3
): TopDimensionItem[] {
  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([dim, score]) => {
      const dimRow = dimMap.get(dim);
      const severity: "leve" | "moderado" | "elevado" =
        score <= 33 ? "leve" : score <= 66 ? "moderado" : "elevado";
      const severityColor =
        score <= 33
          ? "bg-accent text-accent-foreground"
          : score <= 66
            ? "bg-secondary/20 text-secondary"
            : "bg-destructive/15 text-destructive";

      let interpretation = "";
      if (dimRow) {
        if (score <= 33) interpretation = locale === "en" ? dimRow.interpretation_low_en : dimRow.interpretation_low_pt;
        else if (score <= 66) interpretation = locale === "en" ? dimRow.interpretation_moderate_en : dimRow.interpretation_moderate_pt;
        else interpretation = locale === "en" ? dimRow.interpretation_high_en : dimRow.interpretation_high_pt;
      }

      return {
        dimension: dim,
        score,
        label: dimRow ? (locale === "en" ? dimRow.name_en : dimRow.name_pt) : dim,
        emoji: dimRow?.icon || "🧠",
        severity,
        severityColor,
        interpretation,
      };
    });
}

export function generateInterpretation(
  top: TopDimensionItem[],
  locale: string = "pt"
): string {
  if (top.length === 0) return "";

  const [first, second, third] = top;

  if (locale === "en") {
    const parts: string[] = [];
    if (first.severity === "elevado") parts.push(`Your profile indicates elevated levels of ${first.label.toLowerCase()}`);
    else if (first.severity === "moderado") parts.push(`Your profile shows moderate signs of ${first.label.toLowerCase()}`);
    else parts.push(`Your levels are relatively balanced, with mild emphasis on ${first.label.toLowerCase()}`);

    if (second) parts.push(` combined with ${second.severity === "elevado" ? "significant" : second.severity === "moderado" ? "moderate" : "mild"} signs of ${second.label.toLowerCase()}`);
    if (third && third.severity !== "leve") parts.push(` and ${third.label.toLowerCase()}`);
    parts.push(". This is common in people dealing with high demands without adequate space for recovery and self-awareness.");
    return parts.join("");
  }

  const parts: string[] = [];
  if (first.severity === "elevado") parts.push(`Seu perfil indica níveis elevados de ${first.label.toLowerCase()}`);
  else if (first.severity === "moderado") parts.push(`Seu perfil mostra sinais moderados de ${first.label.toLowerCase()}`);
  else parts.push(`Seus níveis gerais estão relativamente equilibrados, com destaque leve para ${first.label.toLowerCase()}`);

  if (second) parts.push(` combinados com sinais ${second.severity === "elevado" ? "significativos" : second.severity === "moderado" ? "moderados" : "leves"} de ${second.label.toLowerCase()}`);
  if (third && third.severity !== "leve") parts.push(` e ${third.label.toLowerCase()}`);
  parts.push(". Isso é comum em pessoas que lidam com alta demanda sem espaço adequado para recuperação e autoconhecimento.");
  return parts.join("");
}

import type { DimensionRow } from "@/types/database";

interface TopDimensionItem {
  dimension: string;
  score: number;
  label: string;
  emoji: string;
  severity: "Mild" | "Moderate" | "High";
  severityColor: string;
  interpretation: string;
}

/**
 * Get top dimensions using data from the dimensions table.
 */
export function getTopDimensions(
  scores: Record<string, number>,
  dimensions: DimensionRow[] = [],
  locale: string = "en",
  count = 3
): TopDimensionItem[] {
  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([dim, score]) => {
      const dimRow = dimMap.get(dim);
      const severity: "Mild" | "Moderate" | "High" =
        score <= 33 ? "Mild" : score <= 66 ? "Moderate" : "High";
      
      const severityColor =
        score <= 33
          ? "bg-accent text-accent-foreground"
          : score <= 66
            ? "bg-secondary/20 text-secondary"
            : "bg-destructive/15 text-destructive";

      let interpretation = "";
      if (dimRow) {
        if (score <= 33) interpretation = dimRow.interpretation_low_en || dimRow.interpretation_low_pt || "";
        else if (score <= 66) interpretation = dimRow.interpretation_moderate_en || dimRow.interpretation_moderate_pt || "";
        else interpretation = dimRow.interpretation_high_en || dimRow.interpretation_high_pt || "";
      }

      return {
        dimension: dim,
        score,
        label: dimRow ? dimRow.name_en || dimRow.name_pt : dim,
        emoji: dimRow?.icon || "🧠",
        severity,
        severityColor,
        interpretation,
      };
    });
}

export function generateInterpretation(
  top: TopDimensionItem[],
  locale: string = "en"
): string {
  if (top.length === 0) return "";

  const [first, second, third] = top;

  const parts: string[] = [];
  
  if (first.severity === "High") {
    parts.push(`We've observed elevated intensity in your ${first.label.toLowerCase()} profile.`);
  } else if (first.severity === "Moderate") {
    parts.push(`Your profile shows moderate signs of ${first.label.toLowerCase()}.`);
  } else {
    parts.push(`Your patterns are relatively balanced, with a subtle emphasis on ${first.label.toLowerCase()}.`);
  }

  if (second) {
    parts.push(` This appears alongside ${second.severity === "High" ? "significant" : second.severity === "Moderate" ? "notable" : "mild"} levels of ${second.label.toLowerCase()}.`);
  }
  
  if (third && third.severity !== "Mild") {
    parts.push(` We also noticed patterns related to ${third.label.toLowerCase()}.`);
  }

  parts.push(" These findings are common when navigating high-pressure environments without sufficient space for integration and self-mastery. We recommend exploring our guided practices to restore your internal agency.");
  
  return parts.join("");
}

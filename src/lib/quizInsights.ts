import { Dimension, DIMENSION_LABELS, DIMENSION_EMOJIS } from "@/data/quizTypes";

interface DimensionInsight {
  description: string;
  recommendation: string;
}

const DIMENSION_INSIGHTS: Record<Dimension, DimensionInsight> = {
  ansiedade: {
    description: "Preocupação persistente e dificuldade em relaxar.",
    recommendation: "Práticas de respiração e grounding podem ajudar no curto prazo.",
  },
  depressao: {
    description: "Perda de interesse, tristeza ou sensação de vazio prolongados.",
    recommendation: "Ativação comportamental e conexão social são caminhos iniciais.",
  },
  burnout: {
    description: "Esgotamento emocional ligado a demandas crônicas de trabalho.",
    recommendation: "Redefinir limites e questionar a cultura de produtividade.",
  },
  sono: {
    description: "Dificuldade para dormir ou sono não restaurador.",
    recommendation: "Higiene do sono e redução de estímulos noturnos são essenciais.",
  },
  autoestima: {
    description: "Sensação de insuficiência e comparação constante.",
    recommendation: "Auto-compaixão e redução de redes sociais são bons primeiros passos.",
  },
  regulacao_emocional: {
    description: "Dificuldade em lidar com emoções intensas.",
    recommendation: "Nomear emoções é o primeiro passo para regulá-las.",
  },
  padroes_relacionais: {
    description: "Repetição de dinâmicas dolorosas em relacionamentos.",
    recommendation: "Explorar teoria do apego pode trazer clareza.",
  },
  produtividade_perfeccionismo: {
    description: "Identidade atrelada a performance e dificuldade em descansar.",
    recommendation: "Praticar o 'bom o suficiente' e descanso intencional.",
  },
  luto_perda: {
    description: "Perdas não processadas que ainda impactam o presente.",
    recommendation: "Permitir-se o luto sem cronograma é fundamental.",
  },
  medo_futuro: {
    description: "Ansiedade diante de incertezas e mudanças no mundo.",
    recommendation: "Focar no que está sob seu controle no presente.",
  },
  crise_sentido: {
    description: "Sensação de vazio e questionamento sobre propósito.",
    recommendation: "Engajamento e contribuição genuína constroem sentido.",
  },
  conexao_social: {
    description: "Solidão ou dificuldade em criar vínculos profundos.",
    recommendation: "Qualidade de vínculos importa mais que quantidade.",
  },
};

export function getTopDimensions(
  scores: Record<string, number>,
  count = 3
): Array<{
  dimension: Dimension;
  score: number;
  label: string;
  emoji: string;
  severity: "leve" | "moderado" | "elevado";
  severityColor: string;
  insight: DimensionInsight;
}> {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([dim, score]) => {
      const d = dim as Dimension;
      const severity =
        score <= 33 ? "leve" : score <= 66 ? "moderado" : "elevado";
      const severityColor =
        score <= 33
          ? "bg-accent text-accent-foreground"
          : score <= 66
            ? "bg-secondary/20 text-secondary"
            : "bg-destructive/15 text-destructive";
      return {
        dimension: d,
        score,
        label: DIMENSION_LABELS[d],
        emoji: DIMENSION_EMOJIS[d],
        severity,
        severityColor,
        insight: DIMENSION_INSIGHTS[d],
      };
    });
}

export function generateInterpretation(
  top: ReturnType<typeof getTopDimensions>
): string {
  if (top.length === 0) return "";

  const [first, second, third] = top;
  const parts: string[] = [];

  if (first.severity === "elevado") {
    parts.push(
      `Seu perfil indica níveis elevados de ${first.label.toLowerCase()}`
    );
  } else if (first.severity === "moderado") {
    parts.push(
      `Seu perfil mostra sinais moderados de ${first.label.toLowerCase()}`
    );
  } else {
    parts.push(
      `Seus níveis gerais estão relativamente equilibrados, com destaque leve para ${first.label.toLowerCase()}`
    );
  }

  if (second) {
    parts.push(
      ` combinados com sinais ${second.severity === "elevado" ? "significativos" : second.severity === "moderado" ? "moderados" : "leves"} de ${second.label.toLowerCase()}`
    );
  }

  if (third && third.severity !== "leve") {
    parts.push(` e ${third.label.toLowerCase()}`);
  }

  parts.push(
    ". Isso é comum em pessoas que lidam com alta demanda sem espaço adequado para recuperação e autoconhecimento."
  );

  return parts.join("");
}

export function getRecommendedPostSlugs(
  scores: Record<string, number>
): string[] {
  // Map top dimensions to related post slugs
  const dimToPost: Partial<Record<Dimension, string>> = {
    ansiedade: "ansiedade-performance",
    burnout: "sinais-burnout",
    crise_sentido: "vazio-existencial",
    padroes_relacionais: "relacionamentos-drenam",
    produtividade_perfeccionismo: "identidade-trabalho",
    medo_futuro: "scrolling-atencao",
  };

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const slugs: string[] = [];

  for (const [dim] of sorted) {
    const slug = dimToPost[dim as Dimension];
    if (slug && !slugs.includes(slug)) slugs.push(slug);
    if (slugs.length >= 4) break;
  }

  return slugs;
}

export type QuestionType = "scale" | "multiple_choice" | "yes_no";

export type Dimension =
  | "ansiedade"
  | "depressao"
  | "burnout"
  | "sono"
  | "autoestima"
  | "regulacao_emocional"
  | "padroes_relacionais"
  | "produtividade_perfeccionismo"
  | "luto_perda"
  | "medo_futuro"
  | "crise_sentido"
  | "conexao_social";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  ansiedade: "Ansiedade",
  depressao: "Depressão",
  burnout: "Burnout",
  sono: "Sono",
  autoestima: "Autoestima",
  regulacao_emocional: "Regulação Emocional",
  padroes_relacionais: "Padrões Relacionais",
  produtividade_perfeccionismo: "Produtividade & Perfeccionismo",
  luto_perda: "Luto & Perda",
  medo_futuro: "Medo do Futuro",
  crise_sentido: "Crise de Sentido",
  conexao_social: "Conexão Social",
};

export const DIMENSION_EMOJIS: Record<Dimension, string> = {
  ansiedade: "😰",
  depressao: "🌧️",
  burnout: "🔥",
  sono: "😴",
  autoestima: "🪞",
  regulacao_emocional: "🧠",
  padroes_relacionais: "💔",
  produtividade_perfeccionismo: "⚡",
  luto_perda: "🕊️",
  medo_futuro: "🤖",
  crise_sentido: "🌊",
  conexao_social: "🌍",
};

export interface QuizOption {
  text: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  orderNum: number;
  questionText: string;
  questionType: QuestionType;
  dimension: Dimension;
  weight: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  questionCount: number;
  estimatedMinutes: number;
  dimensions: Dimension[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  completedAt: string;
  answers: Record<string, number>; // questionId → value
  scores: Record<string, number>; // dimension → percentage 0-100
}

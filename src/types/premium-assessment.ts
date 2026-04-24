export interface PremiumAssessment {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  theme: string;
  estimated_time: number;
  question_count: number;
  is_active: boolean;
  is_premium: boolean;
}

export interface PremiumAssessmentQuestion {
  id: string;
  assessment_slug: string;
  order_num: number;
  section: string;
  question_text_pt: string;
  question_text_en: string;
  options_pt: PremiumOption[];
  options_en: PremiumOption[];
  dimension: string;
  weight: number;
}

export interface PremiumOption {
  text: string;
  value: number;
  pattern?: string;
}

export interface PremiumAssessmentPost {
  id: string;
  assessment_slug: string;
  post_slug: string;
}

export interface PremiumAssessmentResult {
  id: string;
  assessment_slug: string;
  user_id: string | null;
  session_id: string | null;
  answers: Record<string, number>;
  scores: Record<string, number>;
  interpretation: AssessmentInterpretation;
  top_dimensions: string[];
  overall_score: number;
  completed_at: string;
}

export interface AssessmentInterpretation {
  profile_slug: string;
  profile_name: string;
  summary: string;
  dominant_pattern: string;
  secondary_pattern: string;
}

export const PATTERN_PROFILES: Record<string, { pt: string; en: string }> = {
  controle_performance: {
    pt: "O Performer Ansioso",
    en: "The Strategic Achiever",
  },
  paralisia_evitacao: {
    pt: "O Sobrevivente em Alerta",
    en: "The Shielded Resilient",
  },
  busca_sentido_ceticismo: {
    pt: "O Observador em Crise de Sentido",
    en: "The Purpose Analyst",
  },
  desconexao_dissociacao: {
    pt: "O Desligado Funcional",
    en: "The Pragmatic Observer",
  },
};

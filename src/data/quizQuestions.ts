import { Quiz, QuizQuestion } from "./quizTypes";

const SCALE_OPTIONS = [
  { text: "Nunca", value: 1 },
  { text: "Raramente", value: 2 },
  { text: "Às vezes", value: 3 },
  { text: "Frequentemente", value: 4 },
  { text: "Sempre", value: 5 },
];

const q = (
  id: string,
  orderNum: number,
  text: string,
  dimension: string,
  weight = 1.0
): QuizQuestion => ({
  id,
  quizId: "generic",
  orderNum,
  questionText: text,
  questionType: "scale",
  dimension: dimension as QuizQuestion["dimension"],
  weight,
  options: SCALE_OPTIONS,
});

export const genericQuestions: QuizQuestion[] = [
  // Ansiedade (1-3)
  q("q1", 1, "Com que frequência você sente preocupação que não consegue controlar?", "ansiedade"),
  q("q2", 2, "Você sente tensão muscular ou inquietação sem motivo aparente?", "ansiedade"),
  q("q3", 3, "Pensamentos catastróficos sobre o futuro tomam conta da sua mente?", "ansiedade"),

  // Depressão (4-6)
  q("q4", 4, "Você sente falta de interesse ou prazer em atividades que antes gostava?", "depressao"),
  q("q5", 5, "Você se sente triste, vazio ou sem esperança?", "depressao"),
  q("q6", 6, "Você tem dificuldade de se levantar e começar o dia?", "depressao"),

  // Burnout (7-9)
  q("q7", 7, "Você se sente emocionalmente esgotado pelo trabalho ou estudos?", "burnout"),
  q("q8", 8, "Você sente cinismo ou distanciamento em relação ao que faz?", "burnout"),
  q("q9", 9, "Sua produtividade caiu significativamente nos últimos meses?", "burnout"),

  // Sono (10-12)
  q("q10", 10, "Você tem dificuldade para adormecer ou manter o sono?", "sono"),
  q("q11", 11, "Você acorda se sentindo cansado, mesmo dormindo horas suficientes?", "sono"),
  q("q12", 12, "Você usa o celular por mais de 30 minutos na cama antes de dormir?", "sono"),

  // Autoestima (13-15)
  q("q13", 13, "Você sente que não é bom o suficiente, mesmo quando tem conquistas?", "autoestima"),
  q("q14", 14, "Você se compara constantemente com outras pessoas nas redes sociais?", "autoestima"),
  q("q15", 15, "Você evita situações por medo de ser julgado ou rejeitado?", "autoestima"),

  // Regulação Emocional (16-18)
  q("q16", 16, "Você reage de forma desproporcional a situações pequenas?", "regulacao_emocional"),
  q("q17", 17, "Você tem dificuldade em nomear o que está sentindo?", "regulacao_emocional"),
  q("q18", 18, "Quando sente raiva ou tristeza, leva muito tempo para se acalmar?", "regulacao_emocional"),

  // Padrões Relacionais (19-21)
  q("q19", 19, "Você sente que repete os mesmos padrões em seus relacionamentos?", "padroes_relacionais"),
  q("q20", 20, "Você tem medo de abandono ou de ficar sozinho(a)?", "padroes_relacionais"),
  q("q21", 21, "Você tende a se anular para agradar os outros?", "padroes_relacionais"),

  // Produtividade & Perfeccionismo (22-24)
  q("q22", 22, "Você sente culpa quando descansa ou não está sendo produtivo?", "produtividade_perfeccionismo"),
  q("q23", 23, "Você procrastina por medo de não fazer algo perfeitamente?", "produtividade_perfeccionismo"),
  q("q24", 24, "Você sente que sua identidade está ligada à sua produtividade?", "produtividade_perfeccionismo"),

  // Luto & Perda (25-27)
  q("q25", 25, "Você sente que não processou adequadamente uma perda importante?", "luto_perda"),
  q("q26", 26, "Lembranças de uma perda surgem de forma intrusiva no seu dia?", "luto_perda"),
  q("q27", 27, "Você evita falar sobre perdas ou mudanças significativas na sua vida?", "luto_perda"),

  // Medo do Futuro (28-30)
  q("q28", 28, "Pensar no futuro te causa mais ansiedade do que esperança?", "medo_futuro"),
  q("q29", 29, "Você sente que o mundo está se tornando um lugar pior para se viver?", "medo_futuro"),
  q("q30", 30, "A inteligência artificial ou automação te causa preocupação sobre seu futuro?", "medo_futuro"),

  // Crise de Sentido (31-33)
  q("q31", 31, "Você sente que sua vida carece de um propósito claro?", "crise_sentido"),
  q("q32", 32, "Você se pergunta 'para que tudo isso?' com frequência?", "crise_sentido"),
  q("q33", 33, "Você sente um vazio existencial, mesmo quando tudo parece bem?", "crise_sentido"),

  // Conexão Social (34-36)
  q("q34", 34, "Você se sente sozinho(a) mesmo quando está rodeado de pessoas?", "conexao_social"),
  q("q35", 35, "Você sente que as pessoas não te entendem de verdade?", "conexao_social"),
  q("q36", 36, "Você tem dificuldade em criar ou manter vínculos profundos?", "conexao_social"),
];

export const quizzes: Quiz[] = [
  {
    id: "generic",
    slug: "geral",
    title: "O que você está sentindo?",
    subtitle: "Um mapa de 12 dimensões da sua saúde emocional. Leva cerca de 8 minutos.",
    questionCount: 36,
    estimatedMinutes: 8,
    dimensions: [
      "ansiedade", "depressao", "burnout", "sono", "autoestima",
      "regulacao_emocional", "padroes_relacionais", "produtividade_perfeccionismo",
      "luto_perda", "medo_futuro", "crise_sentido", "conexao_social",
    ],
  },
  {
    id: "ansiedade",
    slug: "ansiedade",
    title: "Qual é o seu nível de ansiedade?",
    subtitle: "Um quiz rápido focado na dimensão ansiedade.",
    questionCount: 3,
    estimatedMinutes: 2,
    dimensions: ["ansiedade"],
  },
];

export function getQuestionsForQuiz(quizSlug: string): QuizQuestion[] {
  if (quizSlug === "geral") return genericQuestions;
  // For specific quizzes, filter by dimension matching the slug
  return genericQuestions.filter((q) => q.dimension === quizSlug);
}

export function getQuizBySlug(slug: string): Quiz | undefined {
  return quizzes.find((q) => q.slug === slug);
}

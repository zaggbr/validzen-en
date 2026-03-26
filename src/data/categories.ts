import type { Category } from "./types";

export const categories: Category[] = [
  { slug: "ansiedade", name: "Ansiedade", emoji: "😰", description: "Entenda o que te tira do eixo, de crises agudas a preocupações crônicas.", postCount: 12, layers: [1, 2, 3] },
  { slug: "burnout", name: "Burnout & Exaustão", emoji: "🔥", description: "Quando o trabalho consome mais do que devolve. Reconheça e reaja.", postCount: 8, layers: [1, 2] },
  { slug: "relacoes", name: "Relações", emoji: "💔", description: "Vínculos que nutrem ou drenam. Aprenda a diferenciar.", postCount: 15, layers: [1, 2, 3] },
  { slug: "sentido", name: "Sentido & Propósito", emoji: "🌊", description: "A busca por significado numa era de excesso e vazio.", postCount: 10, layers: [2, 3] },
  { slug: "identidade", name: "Identidade", emoji: "🪞", description: "Quem sou eu fora dos rótulos? Explorações sobre o self.", postCount: 7, layers: [2, 3] },
  { slug: "emocoes", name: "Emoções", emoji: "🧠", description: "Alfabetização emocional: nomear, entender e regular.", postCount: 11, layers: [1, 2] },
  { slug: "futuro", name: "Futuro & Tecnologia", emoji: "🤖", description: "IA, redes sociais e o impacto na mente contemporânea.", postCount: 6, layers: [1, 2] },
  { slug: "sociedade", name: "Sociedade & Política", emoji: "🌍", description: "Ansiedade coletiva, polarização e fadiga informacional.", postCount: 9, layers: [2, 3] },
];

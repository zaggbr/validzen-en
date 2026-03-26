import type { Post } from "./types";

const defaultAuthor = {
  name: "Lucas Mendes",
  avatar: "",
  bio: "Pesquisador independente em saúde mental contemporânea, filosofia prática e autoconhecimento guiado.",
  credentials: "Especialista em Psicologia Positiva · Pesquisador em Meaning Crisis",
};

export const posts: Post[] = [
  {
    slug: "vazio-existencial",
    title: "Por que você se sente vazio mesmo tendo tudo?",
    metaTitle: "Vazio existencial: por que nada parece suficiente | ValidZen",
    metaDescription: "Entenda a sensação de vazio mesmo quando a vida parece boa. Causas, reflexões e caminhos para reencontrar sentido.",
    excerpt: "A sensação de vazio existencial afeta milhões de pessoas que, aparentemente, 'têm tudo'. Não é ingratidão — é um sinal de que algo essencial está faltando na equação. Este artigo explora as raízes filosóficas e psicológicas desse fenômeno e oferece caminhos práticos.",
    category: "Sentido & Propósito",
    categorySlug: "sentido",
    layer: 2,
    tags: ["vazio", "propósito", "existencialismo", "sentido da vida"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quizSlug: "sentido",
    relatedPosts: ["ansiedade-performance", "identidade-trabalho", "scrolling-atencao"],
    faq: [
      { question: "Sentir vazio é sinal de depressão?", answer: "Nem sempre. O vazio existencial pode ocorrer sem depressão clínica. Porém, se persistir por semanas e afetar sua rotina, é importante buscar avaliação profissional." },
      { question: "Como diferenciar vazio existencial de preguiça?", answer: "Preguiça é falta de vontade pontual. Vazio existencial é uma sensação crônica de que nada importa verdadeiramente, mesmo quando você se esforça." },
      { question: "Meditação ajuda com o vazio?", answer: "Práticas contemplativas podem ajudar a observar o vazio sem fugir dele, criando espaço para novos significados emergirem. Mas não é uma solução única." },
    ],
    readingTime: 6,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "existential-emptiness" },
    isPremium: false,
    publishedAt: "2025-12-15",
    updatedAt: "2026-03-10",
    sections: [
      {
        id: "o-que-e",
        heading: "O que é o vazio existencial?",
        body: `<p>Viktor Frankl, psiquiatra e sobrevivente do Holocausto, descreveu o vazio existencial como o "sofrimento sem sentido" — uma condição em que a pessoa não encontra razão suficiente para suas ações cotidianas.</p>
<p>Diferente da tristeza, o vazio não tem um objeto claro. Você não está triste <em>por algo</em> — está vazio <em>apesar de tudo</em>. É uma ausência que não se resolve com mais conquistas ou estímulos.</p>
<blockquote>Quem tem um porquê para viver suporta quase qualquer como. — Viktor Frankl</blockquote>`,
      },
      {
        id: "causas-contemporaneas",
        heading: "Por que é tão comum hoje?",
        body: `<p>Vivemos numa era de abundância material e escassez de sentido. Algumas causas:</p>
<ul>
<li><strong>Excesso de opções:</strong> O paradoxo da escolha paralisa ao invés de libertar</li>
<li><strong>Cultura da performance:</strong> Valor pessoal atrelado a produtividade</li>
<li><strong>Desconexão comunitária:</strong> Individualismo extremo e redes sociais superficiais</li>
<li><strong>Crise de narrativas:</strong> Religião, nação e ideologias perderam poder organizador</li>
</ul>
<p>O filósofo John Vervaeke chama isso de <strong>Meaning Crisis</strong> — uma crise civilizacional de sentido que afeta saúde mental, política e relações.</p>`,
        quizAfter: true,
      },
      {
        id: "sinais",
        heading: "Sinais de que você está experimentando isso",
        body: `<p>O vazio existencial se manifesta de formas sutis:</p>
<table>
<thead><tr><th>Sinal</th><th>Como se manifesta</th></tr></thead>
<tbody>
<tr><td>Anedonia funcional</td><td>Coisas que antes davam prazer parecem "ok" mas não emocionam</td></tr>
<tr><td>Piloto automático</td><td>Dias passam sem presença real; você age por inércia</td></tr>
<tr><td>Pergunta recorrente</td><td>"Pra quê?" aparece em decisões simples e complexas</td></tr>
<tr><td>Consumo compulsivo</td><td>Compras, séries, scrolling — tentativas de preencher o vazio</td></tr>
</tbody>
</table>`,
      },
      {
        id: "caminhos",
        heading: "Caminhos para reencontrar sentido",
        body: `<p>Não existe fórmula mágica, mas existem práticas respaldadas por pesquisa:</p>
<ol>
<li><strong>Engajamento atencional:</strong> Práticas que exigem presença total (flow states)</li>
<li><strong>Contribuição genuína:</strong> Fazer algo que importa para alguém além de você</li>
<li><strong>Narrativa pessoal:</strong> Recontar sua história integrando sofrimento e crescimento</li>
<li><strong>Conexões profundas:</strong> Relações onde você é visto, não apenas notado</li>
</ol>
<blockquote>O sentido não se encontra — se constrói, dia a dia, com atenção e intenção.</blockquote>`,
      },
    ],
  },
  {
    slug: "sinais-burnout",
    title: "Burnout não é frescura: sinais que você ignora",
    metaTitle: "Sinais de burnout que você ignora | ValidZen",
    metaDescription: "O esgotamento começa antes do colapso. Reconheça os primeiros sinais de burnout e proteja sua saúde mental.",
    excerpt: "Burnout não aparece de repente. Ele se instala silenciosamente, disfarçado de dedicação e responsabilidade. Quando você percebe, já está funcionando no limite. Este artigo mapeia os sinais precoces que a maioria das pessoas ignora.",
    category: "Burnout & Exaustão",
    categorySlug: "burnout",
    layer: 1,
    tags: ["burnout", "esgotamento", "trabalho", "saúde mental"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: null,
    quizSlug: "burnout",
    relatedPosts: ["vazio-existencial", "ansiedade-performance", "identidade-trabalho"],
    faq: [
      { question: "Burnout é reconhecido como doença?", answer: "Sim. Desde 2022, a OMS reconhece burnout como fenômeno ocupacional na CID-11, classificado como resultado de estresse crônico no trabalho não gerenciado." },
      { question: "Férias curam burnout?", answer: "Férias podem aliviar sintomas temporariamente, mas burnout requer mudanças estruturais — no trabalho, nos limites e na relação com produtividade." },
    ],
    readingTime: 5,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "burnout-signs" },
    isPremium: false,
    publishedAt: "2026-01-08",
    updatedAt: "2026-03-15",
    sections: [
      {
        id: "o-que-e-burnout",
        heading: "O que é burnout, afinal?",
        body: `<p>Burnout é um estado de esgotamento físico, emocional e mental causado por estresse crônico no trabalho. A OMS define três dimensões:</p>
<ul>
<li><strong>Exaustão:</strong> Sensação de estar completamente drenado</li>
<li><strong>Cinismo:</strong> Distanciamento mental do trabalho, negativismo</li>
<li><strong>Ineficácia:</strong> Sensação de incompetência, queda de produtividade</li>
</ul>`,
      },
      {
        id: "sinais-precoces",
        heading: "Os 7 sinais precoces que ninguém fala",
        body: `<p>Antes do colapso, o corpo e a mente enviam avisos:</p>
<ol>
<li><strong>Domingo à noite:</strong> Ansiedade desproporcional ao pensar na segunda-feira</li>
<li><strong>Irritabilidade seletiva:</strong> Paciência zero com colegas, mas funcional com desconhecidos</li>
<li><strong>Procrastinação produtiva:</strong> Você faz mil coisas, menos o que importa</li>
<li><strong>Sono que não descansa:</strong> 8 horas de sono e ainda assim exaustão</li>
<li><strong>Perda de identidade fora do trabalho:</strong> Não sabe o que gosta além da carreira</li>
<li><strong>Cinismo disfarçado de humor:</strong> Piadas ácidas sobre o trabalho viram rotina</li>
<li><strong>Corpo gritando:</strong> Dores de cabeça, tensão muscular, problemas digestivos sem causa clara</li>
</ol>`,
        quizAfter: true,
      },
      {
        id: "o-que-fazer",
        heading: "O que fazer ao reconhecer os sinais",
        body: `<p>Reconhecer é o primeiro passo. O segundo é agir antes que o corpo decida por você:</p>
<blockquote>Burnout não é sinal de fraqueza. É sinal de que você foi forte por tempo demais sem suporte adequado.</blockquote>
<p>Estratégias baseadas em evidência incluem redefinir limites, buscar suporte profissional e questionar a narrativa de que "descansar é perder tempo".</p>`,
      },
    ],
  },
  {
    slug: "ansiedade-performance",
    title: "Ansiedade de performance: quando ser bom nunca é suficiente",
    metaTitle: "Ansiedade de performance: a armadilha da excelência | ValidZen",
    metaDescription: "A busca por excelência pode se tornar uma armadilha. Diferencie motivação saudável de ansiedade de performance.",
    excerpt: "Existe uma linha tênue entre querer ser excelente e ser refém da própria exigência. A ansiedade de performance transforma cada tarefa em teste, cada resultado em julgamento. Entenda quando a busca por qualidade se torna autodestruição.",
    category: "Ansiedade",
    categorySlug: "ansiedade",
    layer: 1,
    tags: ["ansiedade", "performance", "perfeccionismo", "autocobrança"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quizSlug: "ansiedade",
    relatedPosts: ["sinais-burnout", "vazio-existencial", "identidade-trabalho"],
    faq: [
      { question: "Perfeccionismo e ansiedade de performance são a mesma coisa?", answer: "Não exatamente. Perfeccionismo é um traço de personalidade; ansiedade de performance é uma resposta emocional que pode ser alimentada pelo perfeccionismo." },
      { question: "Ansiedade de performance afeta a criatividade?", answer: "Sim. O medo de errar inibe a experimentação, que é base da criatividade. Ambientes psicologicamente seguros são essenciais." },
    ],
    readingTime: 7,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "performance-anxiety" },
    isPremium: false,
    publishedAt: "2026-01-20",
    updatedAt: "2026-03-20",
    sections: [
      {
        id: "armadilha",
        heading: "A armadilha da excelência",
        body: `<p>Ser bom no que faz deveria ser motivo de orgulho. Mas para quem sofre de ansiedade de performance, cada conquista é apenas o novo ponto de partida para mais cobrança.</p>
<p>O ciclo é previsível: <strong>preparação excessiva → execução tensa → resultado "insuficiente" → mais cobrança</strong>. Mesmo quando o resultado é excelente, a sensação é de alívio, nunca de satisfação.</p>`,
      },
      {
        id: "diferenca",
        heading: "Motivação saudável vs. ansiedade de performance",
        body: `<table>
<thead><tr><th>Motivação saudável</th><th>Ansiedade de performance</th></tr></thead>
<tbody>
<tr><td>Busca crescimento</td><td>Foge do fracasso</td></tr>
<tr><td>Tolera erros</td><td>Catastrofiza erros</td></tr>
<tr><td>Celebra progresso</td><td>Só vê o que falta</td></tr>
<tr><td>Descansa sem culpa</td><td>Se sente improdutivo ao descansar</td></tr>
</tbody>
</table>`,
        quizAfter: true,
      },
      {
        id: "saidas",
        heading: "Caminhos para sair do ciclo",
        body: `<p>A boa notícia: ansiedade de performance é aprendida, portanto pode ser desaprendida. Algumas direções:</p>
<ul>
<li><strong>Redefina sucesso:</strong> Inclua bem-estar na equação, não apenas resultados</li>
<li><strong>Pratique auto-compaixão:</strong> Trate-se como trataria um amigo</li>
<li><strong>Exponha-se ao "bom o suficiente":</strong> Entregue algo 80% perfeito e observe: o mundo não acabou</li>
</ul>
<blockquote>Perfeição é a forma mais elegante de autossabotagem.</blockquote>`,
      },
    ],
  },
  {
    slug: "relacionamentos-drenam",
    title: "Relacionamentos que drenam: como identificar",
    metaTitle: "Relacionamentos que drenam sua energia | ValidZen",
    metaDescription: "Nem toda relação próxima é saudável. Aprenda a identificar padrões tóxicos e proteger sua saúde emocional.",
    excerpt: "Algumas relações parecem próximas mas na verdade consomem sua energia. Nem sempre é óbvio — o desgaste é gradual, normalizado, confundido com amor ou lealdade. Aprenda a reconhecer os padrões.",
    category: "Relações",
    categorySlug: "relacoes",
    layer: 1,
    tags: ["relacionamentos", "toxicidade", "limites", "saúde emocional"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: null,
    quizSlug: "relacoes",
    relatedPosts: ["vazio-existencial", "ansiedade-performance", "sinais-burnout"],
    faq: [
      { question: "Todo conflito é sinal de relação tóxica?", answer: "Não. Conflito é natural em qualquer relação. O que diferencia é como ele é tratado — com respeito e resolução ou com manipulação e invalidação." },
    ],
    readingTime: 8,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "draining-relationships" },
    isPremium: false,
    publishedAt: "2026-02-05",
    updatedAt: "2026-03-18",
    sections: [
      {
        id: "padroes",
        heading: "Padrões de relações que drenam",
        body: `<p>Relações desgastantes raramente começam assim. O processo é gradual:</p>
<ul>
<li><strong>Invalidação emocional:</strong> Seus sentimentos são minimizados ou ridicularizados</li>
<li><strong>Assimetria de esforço:</strong> Você sempre cede, sempre inicia, sempre perdoa</li>
<li><strong>Culpa como controle:</strong> Você se sente culpado por ter limites</li>
<li><strong>Montanha-russa:</strong> Momentos intensos de conexão seguidos de frieza ou agressividade</li>
</ul>`,
        quizAfter: true,
      },
      {
        id: "proteger",
        heading: "Como se proteger sem cortar vínculos",
        body: `<p>Nem toda relação difícil precisa acabar. Mas toda relação precisa de limites:</p>
<blockquote>Limites não são muros. São pontes com portão — você decide quem entra e quando.</blockquote>
<p>Comece identificando o que é inegociável para você. Comunique com clareza, sem agressão. E observe: a pessoa respeita ou resiste?</p>`,
      },
    ],
  },
  {
    slug: "identidade-trabalho",
    title: "Quem sou eu sem meu trabalho?",
    metaTitle: "Identidade e trabalho: quem é você sem a carreira? | ValidZen",
    metaDescription: "Quando a identidade se funde com a carreira, perdê-la pode parecer perder a si mesmo. Explore alternativas.",
    excerpt: "Numa cultura que pergunta 'o que você faz?' como forma de saber quem você é, a fusão entre identidade e trabalho é quase inevitável. Mas o que acontece quando o trabalho muda, acaba ou perde sentido?",
    category: "Identidade",
    categorySlug: "identidade",
    layer: 2,
    tags: ["identidade", "carreira", "propósito", "autoconhecimento"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quizSlug: "identidade",
    relatedPosts: ["vazio-existencial", "sinais-burnout", "ansiedade-performance"],
    faq: [
      { question: "É errado amar o que faço?", answer: "De forma alguma. O problema não é amar o trabalho, mas fazer dele sua única fonte de identidade e valor pessoal." },
      { question: "Como reconstruir identidade depois de uma demissão?", answer: "Comece listando quem você é fora do trabalho: valores, relações, interesses. A identidade é múltipla — o trabalho é apenas uma camada." },
    ],
    readingTime: 6,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "identity-beyond-work" },
    isPremium: false,
    publishedAt: "2026-02-18",
    updatedAt: "2026-03-22",
    sections: [
      {
        id: "fusao",
        heading: "A fusão identidade-trabalho",
        body: `<p>Quando alguém pergunta "quem é você?", a maioria responde com o que faz profissionalmente. Isso não é coincidência — é resultado de uma cultura que equipara valor humano a produtividade.</p>
<p>O problema aparece quando:</p>
<ul>
<li>Uma demissão se sente como uma morte simbólica</li>
<li>Férias geram ansiedade ao invés de descanso</li>
<li>Você não sabe o que gosta fora do contexto profissional</li>
</ul>`,
        quizAfter: true,
      },
      {
        id: "reconstruir",
        heading: "Expandindo a identidade",
        body: `<p>Identidade não é uma coisa só. Somos múltiplos:</p>
<blockquote>Você não é seu cargo. Você é a pessoa que existe antes, durante e depois de qualquer emprego.</blockquote>
<p>Exercício prático: complete a frase "Eu sou..." 10 vezes sem mencionar profissão. As respostas revelam camadas esquecidas de quem você é.</p>`,
      },
    ],
  },
  {
    slug: "scrolling-atencao",
    title: "Scrolling infinito e o sequestro da atenção",
    metaTitle: "Como o scrolling infinito afeta sua mente | ValidZen",
    metaDescription: "A tecnologia não é neutra. Entenda como o design digital sequestra sua atenção e afeta sua saúde mental.",
    excerpt: "Cada vez que você pega o celular 'só para ver', um sistema sofisticado de captura de atenção entra em ação. O scrolling infinito não é acidente — é design. Entenda os mecanismos e retome o controle.",
    category: "Futuro & Tecnologia",
    categorySlug: "futuro",
    layer: 1,
    tags: ["tecnologia", "atenção", "redes sociais", "dopamina", "digital"],
    author: defaultAuthor,
    featuredImage: "",
    videoUrl: null,
    quizSlug: null,
    relatedPosts: ["ansiedade-performance", "vazio-existencial", "sinais-burnout"],
    faq: [
      { question: "Preciso largar as redes sociais?", answer: "Não necessariamente. O objetivo é usar com intenção, não por impulso. Defina horários, desative notificações e observe como se sente antes e depois de usar." },
      { question: "Crianças são mais vulneráveis?", answer: "Sim. O cérebro em desenvolvimento é mais suscetível a loops de recompensa variável. Limites claros e modelos de uso consciente são fundamentais." },
    ],
    readingTime: 5,
    locale: "pt",
    alternateLocale: { locale: "en", slug: "infinite-scrolling-attention" },
    isPremium: false,
    publishedAt: "2026-03-01",
    updatedAt: "2026-03-25",
    sections: [
      {
        id: "design-viciante",
        heading: "Design persuasivo: como funciona",
        body: `<p>As big techs investem bilhões em <strong>design persuasivo</strong> — técnicas que exploram vulnerabilidades cognitivas:</p>
<ul>
<li><strong>Recompensa variável:</strong> Como uma slot machine, você nunca sabe o que vem a seguir</li>
<li><strong>FOMO artificial:</strong> Notificações criam urgência inexistente</li>
<li><strong>Validação social quantificada:</strong> Likes como moeda de autoestima</li>
<li><strong>Auto-play infinito:</strong> Remoção de "pontos de parada" naturais</li>
</ul>`,
      },
      {
        id: "retomar-controle",
        heading: "Como retomar o controle da sua atenção",
        body: `<p>Não é sobre força de vontade — é sobre design do seu ambiente:</p>
<ol>
<li><strong>Tela em escala de cinza:</strong> Remove o apelo visual que prende o olhar</li>
<li><strong>Notificações off:</strong> Mantenha apenas ligações e mensagens essenciais</li>
<li><strong>Horários de uso:</strong> Defina janelas de 15min ao invés de acesso livre</li>
<li><strong>Primeiro e último do dia:</strong> Nunca comece ou termine o dia com o celular</li>
</ol>
<blockquote>Se algo é gratuito, o produto é você. Se o produto é você, sua atenção é a moeda.</blockquote>`,
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedPosts(slugs: string[]): Post[] {
  return posts.filter((p) => slugs.includes(p.slug));
}

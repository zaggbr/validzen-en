import PostCard from "./PostCard";

const posts = [
  {
    title: "Por que você se sente vazio mesmo tendo tudo?",
    excerpt: "A sensação de vazio existencial é mais comum do que parece. Entenda as raízes e o que fazer.",
    category: "Sentido",
    readTime: "6 min",
    slug: "vazio-existencial",
  },
  {
    title: "Burnout não é frescura: sinais que você ignora",
    excerpt: "O esgotamento começa antes do colapso. Reconheça os primeiros sinais e proteja-se.",
    category: "Burnout",
    readTime: "5 min",
    slug: "sinais-burnout",
  },
  {
    title: "Ansiedade de performance: quando ser bom nunca é suficiente",
    excerpt: "A busca por excelência pode se tornar uma armadilha. Como diferenciar motivação de ansiedade.",
    category: "Ansiedade",
    readTime: "7 min",
    slug: "ansiedade-performance",
  },
  {
    title: "Relacionamentos que drenam: como identificar",
    excerpt: "Nem toda relação que parece próxima é saudável. Aprenda a reconhecer padrões tóxicos.",
    category: "Relações",
    readTime: "8 min",
    slug: "relacionamentos-drenam",
  },
  {
    title: "Quem sou eu sem meu trabalho?",
    excerpt: "Quando a identidade se funde com a carreira, perdê-la pode parecer perder a si mesmo.",
    category: "Identidade",
    readTime: "6 min",
    slug: "identidade-trabalho",
  },
  {
    title: "Scrolling infinito e o sequestro da atenção",
    excerpt: "A tecnologia não é neutra. Entenda como o design digital afeta sua saúde mental.",
    category: "Tecnologia",
    readTime: "5 min",
    slug: "scrolling-atencao",
  },
];

const PopularPosts = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">Mais lidos</h2>
        <p className="mb-10 text-sm text-muted-foreground">
          Os conteúdos que mais ajudaram outros leitores.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPosts;

import CategoryCard from "./CategoryCard";

const categories = [
  { emoji: "😰", name: "Ansiedade", slug: "ansiedade", postCount: 12 },
  { emoji: "🔥", name: "Burnout & Exaustão", slug: "burnout", postCount: 8 },
  { emoji: "💔", name: "Relações", slug: "relacoes", postCount: 15 },
  { emoji: "🌊", name: "Sentido & Propósito", slug: "sentido", postCount: 10 },
  { emoji: "🪞", name: "Identidade", slug: "identidade", postCount: 7 },
  { emoji: "🧠", name: "Emoções", slug: "emocoes", postCount: 11 },
  { emoji: "🤖", name: "Futuro & Tecnologia", slug: "futuro", postCount: 6 },
  { emoji: "🌍", name: "Sociedade & Política", slug: "sociedade", postCount: 9 },
];

const ThemesSection = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          Explore por tema
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          Escolha o que ressoa com você agora.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;

import CategoryCard from "./CategoryCard";
import { categories } from "@/data/categories";

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
            <CategoryCard key={cat.slug} emoji={cat.emoji} name={cat.name} slug={cat.slug} postCount={cat.postCount} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;

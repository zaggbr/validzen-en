import CategoryCard from "./CategoryCard";
import { categories } from "@/data/categories";
import { useI18n } from "@/i18n/I18nContext";

const ThemesSection = () => {
  const { t } = useI18n();

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          {t("home.section_themes")}
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          {t("home.section_themes_sub")}
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

import CategoryCard from "./CategoryCard";
import { useCategories, useCategoryPostCounts } from "@/hooks/usePosts";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

const ThemesSection = () => {
  const { t, locale } = useI18n();
  const { data: categories = [], isLoading } = useCategories();
  const { data: counts = {} } = useCategoryPostCounts(locale);

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <Skeleton className="mx-auto mb-2 h-8 w-48" />
          <Skeleton className="mx-auto mb-10 h-4 w-64" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

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
            <CategoryCard
              key={cat.slug}
              name={locale === "en" ? cat.name_en : cat.name_pt}
              slug={cat.slug}
              postCount={counts[cat.slug] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;

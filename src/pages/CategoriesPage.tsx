import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { useCategories, useCategoryPostCounts } from "@/hooks/usePosts";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesPage = () => {
  const { t, locale } = useI18n();
  const { data: categories = [], isLoading } = useCategories();
  const { data: counts = {} } = useCategoryPostCounts(locale);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="mb-8 h-4 w-64" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t("categories.title")}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("categories.subtitle")}</p>

          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("categories.no_posts")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  emoji={cat.icon}
                  name={locale === "en" ? cat.name_en : cat.name_pt}
                  slug={cat.slug}
                  postCount={counts[cat.slug] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;

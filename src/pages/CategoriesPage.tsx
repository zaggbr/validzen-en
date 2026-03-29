import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { useCategories } from "@/hooks/usePosts";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback emoji map for known categories
const CATEGORY_EMOJIS: Record<string, string> = {
  ansiedade: "😰",
  burnout: "🔥",
  relacoes: "💔",
  sentido: "🌊",
  identidade: "🪞",
  emocoes: "🧠",
  futuro: "🤖",
  sociedade: "🌍",
};

const CategoriesPage = () => {
  const { t, locale } = useI18n();
  const { data: categories = [], isLoading } = useCategories(locale);

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
                  emoji={CATEGORY_EMOJIS[cat.slug] || "📂"}
                  name={cat.name}
                  slug={cat.slug}
                  postCount={cat.count}
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

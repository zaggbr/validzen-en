import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { usePosts, useCategories } from "@/hooks/usePosts";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale, localePath } = useI18n();

  console.log("[CategoryPage] locale:", locale, "slug:", slug);

  const { data: allPosts = [], isLoading } = usePosts(locale, slug);
  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category
    ? (locale === "en" ? category.name_en : category.name_pt)
    : allPosts[0]?.category || slug;
  const sorted = [...allPosts].sort((a, b) => {
    if (sort === "recent") return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    return b.reading_time - a.reading_time;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">📂</span>
            <h1 className="mt-4 text-2xl font-bold">{t("categories.not_found")}</h1>
            <Link to={localePath("/categorias")} className="mt-4 inline-block text-sm text-secondary hover:underline">
              {t("categories.view_all")}
            </Link>
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
          <Link to={localePath("/categorias")} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("categories.all_categories")}
          </Link>

          <div className="mb-8">
              <h1 className="text-2xl font-bold md:text-3xl">{categoryName}</h1>
              {category && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "en" ? category.description_en : category.description_pt}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSort("recent")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "recent" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t("categories.sort_recent")}
            </button>
            <button
              onClick={() => setSort("popular")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "popular" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t("categories.sort_popular")}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <PostCard key={post.slug} title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time} min`} slug={post.slug} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;

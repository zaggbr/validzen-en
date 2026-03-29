import PostCard from "./PostCard";
import { usePosts } from "@/hooks/usePosts";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

const PopularPosts = () => {
  const { t, locale } = useI18n();
  const { data: posts = [], isLoading } = usePosts(locale);

  // Show up to 6 most recent posts
  const displayPosts = posts.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="mb-10 h-4 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">{t("home.section_popular")}</h2>
        <p className="mb-10 text-sm text-muted-foreground">
          {t("home.section_popular_sub")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              readTime={`${post.reading_time} min`}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPosts;

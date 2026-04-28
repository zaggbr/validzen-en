import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { usePosts, useCategories } from "@/hooks/usePosts";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { stripEmojis } from "@/lib/utils";
import { motion } from "framer-motion";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: allPosts = [], isLoading } = usePosts(slug);
  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category
    ? category.name_en
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
          <div className="container py-10 md:py-16 space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
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
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">📂</span>
            <h1 className="mt-6 text-3xl font-bold">Discovery Theme Not Found</h1>
            <p className="mt-2 text-muted-foreground">This territory hasn't been mapped yet or is currently under curation.</p>
            <Link to="/categories" className="mt-8 inline-block text-xs font-bold uppercase tracking-widest text-secondary hover:underline">
              Browse All Discovery Themes
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-20">
          <Link to="/categories" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Discovery Themes
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
              <h1 className="text-3xl font-bold text-title md:text-5xl tracking-tight">{stripEmojis(categoryName)}</h1>
              {category && (
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {stripEmojis(category.description_en)}
                </p>
              )}
          </motion.div>

          <div className="mb-10 flex gap-4">
            <button
              onClick={() => setSort("recent")}
              className={`rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                sort === "recent" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              Latest Wisdom
            </button>
            <button
              onClick={() => setSort("popular")}
              className={`rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                sort === "popular" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              Trending Insights
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PostCard title={post.title} excerpt={post.excerpt} category={post.category} readTime={`${post.reading_time}`} slug={post.slug} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;

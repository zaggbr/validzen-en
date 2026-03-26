import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { categories } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";
import { ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const allPosts = slug ? getPostsByCategory(slug) : [];
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const sorted = [...allPosts].sort((a, b) => {
    if (sort === "recent") return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    return b.readingTime - a.readingTime; // proxy for popularity
  });

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">📂</span>
            <h1 className="mt-4 text-2xl font-bold">Categoria não encontrada</h1>
            <Link to="/categorias" className="mt-4 inline-block text-sm text-secondary hover:underline">
              Ver todas as categorias
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
          <Link to="/categorias" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Todas as categorias
          </Link>

          <div className="mb-8 flex items-start gap-4">
            <span className="text-4xl">{category.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{category.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>

          {/* Sort controls */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSort("recent")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "recent" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Mais recentes
            </button>
            <button
              onClick={() => setSort("popular")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "popular" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Mais populares
            </button>
          </div>

          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum post nesta categoria ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((post) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  readTime={`${post.readingTime} min`}
                  slug={post.slug}
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

export default CategoryPage;

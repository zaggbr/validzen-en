import PostCard from "./PostCard";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const PopularPosts = () => {
  const { data: posts = [], isLoading } = usePosts();

  // Show up to 6 most recent posts
  const displayPosts = posts.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-24 md:py-32">
        <div className="container">
          <Skeleton className="mb-4 h-10 w-64" />
          <Skeleton className="mb-12 h-4 w-96" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-4 text-3xl font-black text-title tracking-tight md:text-4xl">Trending Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our latest blueprints and guided reflections for a clearer mind.
          </p>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <PostCard
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                readTime={`${post.reading_time}`}
                slug={post.slug}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPosts;

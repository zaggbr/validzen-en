import CategoryCard from "./CategoryCard";
import { useCategories, useCategoryPostCounts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ThemesSection = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { data: counts = {} } = useCategoryPostCounts();

  if (isLoading) {
    return (
      <section className="bg-muted/10 py-24 md:py-32">
        <div className="container">
          <Skeleton className="mx-auto mb-4 h-10 w-64" />
          <Skeleton className="mx-auto mb-12 h-4 w-80" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-muted/10 py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-title tracking-tight md:text-4xl">
            Discovery Territories
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Dive deep into specific areas of self-mastery and guided emotional discovery.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <CategoryCard
                name={cat.name_en || cat.name_pt}
                slug={cat.slug}
                postCount={counts[cat.slug] || 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;

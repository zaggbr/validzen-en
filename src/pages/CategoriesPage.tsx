import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { useCategories, useCategoryPostCounts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { data: counts = {} } = useCategoryPostCounts();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10 md:py-16">
            <Skeleton className="mb-4 h-10 w-64" />
            <Skeleton className="mb-10 h-4 w-96" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="mb-3 text-3xl font-black text-title md:text-5xl tracking-tight">Discovery Themes</h1>
            <p className="text-md text-muted-foreground">Browse our collection of self-mastery insights and guided emotional blueprints.</p>
          </motion.div>

          {categories.length === 0 ? (
            <div className="py-20 text-center">
               <p className="text-md text-muted-foreground">No discovery themes found at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <CategoryCard
                    name={cat.name_en}
                    slug={cat.slug}
                    postCount={counts[cat.slug] || 0}
                  />
                </motion.div>
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

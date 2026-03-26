import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";
import { useI18n } from "@/i18n/I18nContext";

const CategoriesPage = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const { t } = useI18n();

  const filtered = activeLayer
    ? categories.filter((c) => c.layers.includes(activeLayer))
    : categories;

  const layers = [
    { value: null, label: t("categories.all") },
    { value: 1, label: `${t("categories.layer")} 1` },
    { value: 2, label: `${t("categories.layer")} 2` },
    { value: 3, label: `${t("categories.layer")} 3` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10 md:py-16">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t("categories.title")}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("categories.subtitle")}</p>

          <div className="mb-8 flex gap-2">
            {layers.map((l) => (
              <button
                key={String(l.value)}
                onClick={() => setActiveLayer(l.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeLayer === l.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((cat) => (
              <CategoryCard key={cat.slug} emoji={cat.emoji} name={cat.name} slug={cat.slug} postCount={cat.postCount} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;

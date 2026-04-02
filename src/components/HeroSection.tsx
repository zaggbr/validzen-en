import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/i18n/I18nContext";

const HeroSection = () => {
  const { t, localePath } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      <div className="container relative flex flex-col items-center py-20 text-center md:py-32">
        <span className="mb-6 text-4xl font-bold tracking-tight text-title md:text-6xl">
          valid<span className="text-secondary">zen</span>.
        </span>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
          {t("home.hero_title")}
        </p>

        <h1 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-tight text-title md:text-4xl">
          {t("home.hero_h1_1")}{" "}
          <span className="text-muted-foreground">{t("home.hero_h1_2")}</span>{" "}
          <span className="text-sage">{t("home.hero_h1_3")}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          {t("home.hero_description")}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-base text-muted-foreground md:text-lg">
          {t("home.hero_description_2")}
        </p>

        <div className="mt-10">
          <Button asChild variant="hero-outline" size="lg">
            <Link to={localePath("/categorias")}>{t("home.cta_explore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

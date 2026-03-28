import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ThemesSection from "@/components/ThemesSection";
import PopularPosts from "@/components/PopularPosts";
import HowItWorks from "@/components/HowItWorks";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";
import { useI18n } from "@/i18n/I18nContext";

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead
        title="ValidZen — The Meaning Crisis Project"
        description={t("home.hero_description")}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ThemesSection />
        <div className="container py-6">
          <AdBanner slot="home-between-sections" format="horizontal" />
        </div>
        <PopularPosts />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

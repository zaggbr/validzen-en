import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ThemesSection from "@/components/ThemesSection";
import PopularPosts from "@/components/PopularPosts";
import HowItWorks from "@/components/HowItWorks";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title="ValidZen — Understand Yourself, Find Your Meaning" 
        description="Guided self-knowledge and emotional assessments to help you navigate the modern meaning crisis and improve your mental well-being." 
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

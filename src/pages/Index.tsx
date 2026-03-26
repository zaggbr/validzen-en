import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ThemesSection from "@/components/ThemesSection";
import PopularPosts from "@/components/PopularPosts";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ThemesSection />
        <PopularPosts />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

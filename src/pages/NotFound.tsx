import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead title="Path Not Found — ValidZen" description="This discovery path doesn't exist." noindex />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 text-7xl">🔮</span>
        <h1 className="mb-4 text-5xl font-black text-title italic tracking-tight md:text-6xl">404</h1>
        <p className="mb-10 max-w-md text-lg text-muted-foreground italic leading-relaxed">
          This discovery path doesn't exist or has been archived. Let's return to your core blueprint and explore new territories.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="rounded-full px-8 py-7 font-black uppercase tracking-widest text-[10px] border-border hover:bg-secondary/5" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
          </Button>
          <Button variant="hero" size="lg" className="rounded-full px-8 py-7 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20" asChild>
            <Link to="/dashboard"><Home className="mr-2 h-4 w-4" /> Return to Blueprint</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

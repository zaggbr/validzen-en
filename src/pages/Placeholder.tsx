import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Placeholder = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead title="Expanding Discovery — ValidZen" description="This area is currently being mapped." noindex />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Construction className="h-8 w-8" />
        </div>
        <h1 className="mb-4 text-3xl font-black text-title tracking-tight">Expanding Discovery</h1>
        <p className="mb-10 max-w-md text-md text-muted-foreground leading-relaxed">
          The territory <code className="rounded bg-muted/50 px-2 py-0.5 text-xs not-italic font-mono text-secondary">{pathname}</code> is currently being mapped by our curators. Return soon to explore new insights.
        </p>
        <Button asChild variant="hero" className="rounded-full px-8 py-7 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Blueprint
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default Placeholder;

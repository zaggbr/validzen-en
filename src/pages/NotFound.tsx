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
    <div className="flex min-h-screen flex-col">
      <SEOHead title="Página não encontrada — ValidZen" description="" noindex />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="mb-4 text-7xl">🔮</span>
        <h1 className="mb-2 text-4xl font-bold text-title">404</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          Essa página não existe ou foi movida. Volte ao início e explore os temas disponíveis.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
          <Button variant="hero" size="lg" asChild>
            <Link to="/pt"><Home className="mr-1 h-4 w-4" /> Início</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

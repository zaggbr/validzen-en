import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Placeholder = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-5xl">🚧</span>
        <h1 className="mb-2 text-2xl font-bold">Em construção</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          A página <code className="rounded bg-muted px-2 py-0.5 text-xs">{pathname}</code> será implementada em breve.
        </p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar para Home
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default Placeholder;

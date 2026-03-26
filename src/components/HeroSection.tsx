import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      <div className="container relative flex flex-col items-center py-20 text-center md:py-32">
        <span className="mb-6 text-4xl font-bold tracking-tight text-title md:text-6xl">
          valid<span className="text-secondary">zen</span>.
        </span>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
          The Meaning Crisis Project
        </p>

        <h1 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-tight text-title md:text-4xl">
          Name what you feel.{" "}
          <span className="text-muted-foreground">Understand why.</span>{" "}
          <span className="text-sage">Navigate forward.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
          Autoconhecimento guiado para quem sente que algo não faz sentido. Quizzes, conteúdo e um mapa emocional personalizado.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild variant="hero" size="xl">
            <Link to="/quiz/geral">
              Começar o Quiz <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="hero-outline" size="lg">
            <Link to="/categorias">Explorar temas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

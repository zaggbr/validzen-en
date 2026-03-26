import { Compass, MessageCircleQuestion, Map, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Escolha um tema ou faça o quiz",
    description: "Comece pelo que você sente agora.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Responda perguntas sobre o que sente",
    description: "Quizzes rápidos e sem julgamento.",
  },
  {
    icon: Map,
    title: "Receba seu mapa emocional",
    description: "Um panorama personalizado de si mesmo.",
  },
  {
    icon: BookOpen,
    title: "Leia, assista e aprofunde",
    description: "Conteúdo curado para sua jornada.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          Como funciona
        </h2>
        <p className="mb-12 text-center text-sm text-muted-foreground">
          Quatro passos para se conhecer melhor.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                <step.icon className="h-6 w-6 text-secondary" />
              </div>
              <span className="mb-1 text-xs font-bold uppercase tracking-wider text-secondary">
                Passo {i + 1}
              </span>
              <h3 className="mb-2 text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

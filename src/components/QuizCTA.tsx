import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface QuizCTAProps {
  theme: string;
  quizSlug: string;
  questionCount?: number;
  minutes?: number;
}

const QuizCTA = ({ theme, quizSlug, questionCount = 10, minutes = 3 }: QuizCTAProps) => {
  return (
    <div className="my-8 rounded-lg border border-primary/10 bg-primary/5 p-6 md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="text-3xl">🧪</span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-title">
            Descubra seu nível de {theme}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Responda {questionCount} perguntas rápidas ({minutes} min)
          </p>
        </div>
        <Button asChild variant="secondary" size="lg">
          <Link to={`/quiz/${quizSlug}`}>
            Fazer o Quiz <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuizCTA;

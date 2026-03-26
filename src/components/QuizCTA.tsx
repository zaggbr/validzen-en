import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface QuizCTAProps {
  theme: string;
  quizSlug: string;
}

const QuizCTA = ({ theme, quizSlug }: QuizCTAProps) => {
  const inlineEl = document.getElementById(`quiz-inline-${quizSlug}`);

  const handleClick = (e: React.MouseEvent) => {
    if (inlineEl) {
      e.preventDefault();
      inlineEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Link
      to={`/quiz/${quizSlug}`}
      onClick={handleClick}
      className="my-6 flex items-center justify-between rounded-lg border border-secondary/20 bg-secondary/5 px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
    >
      <span>
        📊 Faça o quiz sobre{" "}
        <span className="font-bold text-secondary">{theme}</span> e descubra
        seu perfil
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-secondary" />
    </Link>
  );
};

export default QuizCTA;

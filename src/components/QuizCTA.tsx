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
      className="my-10 flex items-center justify-between rounded-2xl border border-secondary/20 bg-secondary/5 px-6 py-5 text-sm font-bold text-foreground transition-all hover:bg-secondary/10 hover:shadow-lg shadow-secondary/5 group"
    >
      <span className="flex items-center gap-3">
        <span className="text-2xl">📊</span>
        <span>
          Discover your level of <span className="text-secondary uppercase tracking-tighter not-italic font-bold">{theme}</span> on this Journey
        </span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-secondary transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

export default QuizCTA;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface QuizCTAProps {
  theme: string;
  quizSlug: string;
}

const QuizCTA = ({ theme, quizSlug }: QuizCTAProps) => {
  const { t, localePath } = useI18n();
  const inlineEl = document.getElementById(`quiz-inline-${quizSlug}`);

  const handleClick = (e: React.MouseEvent) => {
    if (inlineEl) {
      e.preventDefault();
      inlineEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Link
      to={localePath(`/quiz/${quizSlug}`)}
      onClick={handleClick}
      className="my-6 flex items-center justify-between rounded-lg border border-secondary/20 bg-secondary/5 px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
    >
      <span>
        📊 {t("quiz.quiz_cta")}{" "}
        <span className="font-bold text-secondary">{theme}</span> {t("quiz.quiz_cta_suffix")}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-secondary" />
    </Link>
  );
};

export default QuizCTA;

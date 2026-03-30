import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, HelpCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface QuizIntroProps {
  quiz: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    questionCount: number;
    estimatedMinutes: number;
  };
  onStart: () => void;
}

const QuizIntro = ({ quiz, onStart }: QuizIntroProps) => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center"
    >
      <span className="mb-4 text-5xl">🧭</span>
      <h1 className="mb-3 text-3xl font-bold text-title md:text-4xl">
        {quiz.title}
      </h1>
      <p className="mb-8 text-muted-foreground">{quiz.subtitle}</p>

      <div className="mb-8 flex gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" />
          {quiz.questionCount} {t("quiz.questions")}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {t("quiz.estimated_time", { minutes: quiz.estimatedMinutes })}
        </span>
      </div>

      <Button onClick={onStart} variant="hero" size="xl">
        {t("quiz.start")} <ArrowRight className="ml-1 h-5 w-5" />
      </Button>

      <p className="mt-8 max-w-sm text-xs text-muted-foreground">
        ⚠️ {t("common.disclaimer_quiz")}
      </p>
    </motion.div>
  );
};

export default QuizIntro;

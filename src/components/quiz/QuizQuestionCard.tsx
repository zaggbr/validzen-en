import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/types/database";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";

interface Props {
  question: QuizQuestion;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  direction: number;
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

const QuizQuestionCard = ({
  question,
  selectedValue,
  onSelect,
  onNext,
  onBack,
  isFirst,
  isLast,
  direction,
}: Props) => {
  const { t } = useI18n();

  const renderScale = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200",
            selectedValue === opt.value
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
          )}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="flex flex-col gap-3">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "rounded-lg border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-200",
            selectedValue === opt.value
              ? "border-primary bg-primary/10 text-foreground shadow-sm"
              : "border-border bg-card text-foreground hover:border-primary/40"
          )}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderYesNo = () => (
    <div className="flex gap-4">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex-1 rounded-lg border-2 px-6 py-5 text-base font-semibold transition-all duration-200",
            selectedValue === opt.value
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border bg-card text-foreground hover:border-primary/40"
          )}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="mx-auto w-full max-w-xl"
      >
        <h2 className="mb-8 text-center text-lg font-semibold text-title md:text-xl">
          {question.question_text}
        </h2>

        {question.question_type === "scale" && renderScale()}
        {question.question_type === "multiple_choice" && renderMultipleChoice()}
        {question.question_type === "yes_no" && renderYesNo()}

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={isFirst} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
          </Button>
          <Button onClick={onNext} disabled={selectedValue === null} variant="hero" size="lg" className="gap-1">
            {isLast ? t("quiz.see_result") : t("quiz.next")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizQuestionCard;

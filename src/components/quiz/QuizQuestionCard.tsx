import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/types/database";
import { cn } from "@/lib/utils";

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
  const renderScale = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex-1 rounded-xl border-2 px-4 py-4 text-sm font-bold transition-all duration-200 uppercase tracking-widest",
            selectedValue === opt.value
              ? "border-secondary bg-secondary text-white shadow-xl shadow-secondary/20"
              : "border-border bg-card text-foreground hover:border-secondary/30"
          )}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="flex flex-col gap-4">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "rounded-xl border-2 px-6 py-5 text-left text-md font-bold transition-all duration-200",
            selectedValue === opt.value
              ? "border-secondary bg-secondary/10 text-title shadow-sm"
              : "border-border bg-card text-foreground hover:border-secondary/30"
          )}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderYesNo = () => (
    <div className="flex gap-6">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex-1 rounded-[1.5rem] border-2 px-8 py-6 text-lg font-bold transition-all duration-200 uppercase tracking-widest",
            selectedValue === opt.value
              ? "border-secondary bg-secondary text-white shadow-2xl shadow-secondary/20"
              : "border-border bg-card text-foreground hover:border-secondary/30"
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto w-full max-w-2xl"
      >
        <h2 className="mb-12 text-center text-2xl font-bold text-title md:text-3xl tracking-tight leading-tight">
          {question.question_text}
        </h2>

        <div className="mb-12">
          {question.question_type === "scale" && renderScale()}
          {question.question_type === "multiple_choice" && renderMultipleChoice()}
          {question.question_type === "yes_no" && renderYesNo()}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-10">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={isFirst} className="font-bold uppercase tracking-[0.2em] text-[10px] text-muted-foreground hover:text-secondary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={onNext} disabled={selectedValue === null} variant="hero" size="lg" className="rounded-full px-10 py-7 font-bold uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
            {isLast ? "Reveal Discovery" : "Continue Journey"} <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizQuestionCard;

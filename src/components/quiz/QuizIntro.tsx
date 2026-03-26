import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, HelpCircle } from "lucide-react";
import { Quiz } from "@/data/quizTypes";

interface QuizIntroProps {
  quiz: Quiz;
  onStart: () => void;
}

const QuizIntro = ({ quiz, onStart }: QuizIntroProps) => (
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
        {quiz.questionCount} perguntas
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        ~{quiz.estimatedMinutes} min
      </span>
    </div>

    <Button onClick={onStart} variant="hero" size="xl">
      Começar <ArrowRight className="ml-1 h-5 w-5" />
    </Button>

    <p className="mt-8 max-w-sm text-xs text-muted-foreground">
      ⚠️ Este quiz é educacional e de autoconhecimento. Não constitui
      diagnóstico clínico nem substitui avaliação profissional.
    </p>
  </motion.div>
);

export default QuizIntro;

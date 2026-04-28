import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, HelpCircle } from "lucide-react";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-lg flex-col items-center px-4 py-8 text-center"
    >
      <span className="mb-6 text-6xl">🧭</span>
      <h1 className="mb-4 text-4xl font-black text-title md:text-5xl tracking-tight">
        {quiz.title}
      </h1>
      <p className="mb-10 text-lg text-muted-foreground leading-relaxed">{quiz.subtitle}</p>

      <div className="mb-10 flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-secondary" />
          {quiz.questionCount} Discoveries
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" />
          ~{quiz.estimatedMinutes} Minutes
        </span>
      </div>

      <Button onClick={onStart} variant="hero" size="xl" className="px-12 py-8 text-xl font-black uppercase tracking-widest rounded-full shadow-2xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
        Begin Journey <ArrowRight className="ml-3 h-6 w-6" />
      </Button>

      <div className="mt-12 max-w-sm rounded-2xl border border-border bg-muted/20 p-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60 leading-relaxed">
          ⚠️ Guided for self-reflection. This is not a clinical diagnosis. Use these insights for your personal growth journey.
        </p>
      </div>
    </motion.div>
  );
};

export default QuizIntro;

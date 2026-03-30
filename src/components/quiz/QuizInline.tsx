import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Clock, BarChart3 } from "lucide-react";
import { useQuizQuestions, calculateScores, useSubmitQuizResult } from "@/hooks/useQuiz";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions } from "@/lib/quizInsights";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizInlineProps {
  quizSlug: string;
  title?: string;
  subtitle?: string;
}

type Phase = "cta" | "active" | "done";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const QuizInline = ({ quizSlug, title, subtitle }: QuizInlineProps) => {
  const { locale, t, localePath } = useI18n();
  const { data: questions = [], isLoading } = useQuizQuestions(quizSlug, locale);
  const { data: dimensions = [] } = useDimensions();
  const submitResult = useSubmitQuizResult();
  const [phase, setPhase] = useState<Phase>("cta");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [dir, setDir] = useState(1);

  const handleSelect = useCallback(
    (value: number) => {
      if (questions.length === 0) return;
      setAnswers((prev) => ({ ...prev, [questions[idx].id]: value }));
    },
    [idx, questions]
  );

  const handleNext = useCallback(async () => {
    if (idx < questions.length - 1) {
      setDir(1);
      setIdx((i) => i + 1);
    } else {
      const s = calculateScores(questions, answers);
      setScores(s);

      try {
        const id = await submitResult.mutateAsync({
          quizSlug,
          answers,
          scores: s,
          locale,
        });
        setResultId(id);
      } catch {
        setResultId(null);
      }
      setPhase("done");
    }
  }, [idx, questions, answers, quizSlug, locale, submitResult]);

  const handleBack = () => {
    if (idx > 0) {
      setDir(-1);
      setIdx((i) => i - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="my-10 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6">
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[idx];
  const pct = Math.round(((idx + 1) / questions.length) * 100);

  if (phase === "cta") {
    return (
      <div
        id={`quiz-inline-${quizSlug}`}
        className="my-10 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8"
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="text-4xl">🧪</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-title">
              {title ?? t("quiz.what_level", { topic: quizSlug })}
            </h3>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {Math.max(1, Math.round(questions.length * 0.4))} min
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                {t("quiz.see_result")}
              </span>
            </div>
          </div>
          <Button onClick={() => setPhase("active")} variant="hero" size="lg">
            {t("quiz.start")} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div
        id={`quiz-inline-${quizSlug}`}
        className="my-10 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8"
      >
        <div className="mb-6">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{t("quiz.question_of", { current: idx + 1, total: questions.length })}</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={q.id} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
            <p className="mb-6 text-center text-base font-semibold text-title md:text-lg">
              {q.question_text}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    answers[q.id] === opt.value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  )}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={idx === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> {t("quiz.back")}
          </Button>
          <Button onClick={handleNext} disabled={answers[q.id] == null} variant="hero" size="default">
            {idx === questions.length - 1 ? t("quiz.see_result") : t("quiz.next")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Done phase
  const top = getTopDimensions(scores, dimensions, locale, 3);
  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));
  const radarData = Object.entries(scores).map(([dim, score]) => {
    const d = dimMap.get(dim);
    return {
      dimension: d ? (locale === "en" ? d.name_en : d.name_pt) : dim,
      score,
    };
  });

  return (
    <motion.div
      id={`quiz-inline-${quizSlug}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-10 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8"
    >
      <h3 className="mb-4 text-center text-lg font-bold text-title">
        🗺️ {t("result.title")}
      </h3>

      <div className="mx-auto mb-6 max-w-xs">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
            <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {top.map((item) => (
          <div key={item.dimension} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
            <span>{item.emoji}</span>
            <span className="text-foreground">{item.label}</span>
            <span className={cn("font-bold", item.score > 66 ? "text-destructive" : item.score > 33 ? "text-secondary" : "text-accent")}>
              {item.score}%
            </span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="hero" size="lg">
          <Link to={localePath(`/resultado/${resultId}`)}>
            {t("quiz.see_result")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizInline;

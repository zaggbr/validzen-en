import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Clock, BarChart3, Lock, UserPlus, RotateCcw } from "lucide-react";
import { useQuizQuestions, calculateScores, useSubmitQuizResult, useDeleteQuizResult } from "@/hooks/useQuiz";
import { useUserResults } from "@/hooks/useDashboard";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions } from "@/lib/quizInsights";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, isPremium, incrementQuizCompletion } = useAuth();
  const { data: questions = [], isLoading } = useQuizQuestions(quizSlug, locale);
  const { data: dimensions = [] } = useDimensions();
  const { data: results = [] } = useUserResults();
  const submitResult = useSubmitQuizResult();
  const deleteResult = useDeleteQuizResult();
  const [phase, setPhase] = useState<Phase>("cta");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [dir, setDir] = useState(1);

  const resetQuiz = useCallback(() => {
    setPhase("cta");
    setIdx(0);
    setAnswers({});
    setScores({});
    setResultId(null);
  }, []);

  // Detect existing results
  useEffect(() => {
    if (results && results.length > 0) {
      const existing = results.find(r => r.quiz_slug === quizSlug);
      if (existing && phase !== "done") {
        setPhase("done");
        setScores(existing.scores);
        setResultId(existing.id);
      } else if (!existing && phase === "done") {
        resetQuiz();
      }
    }
  }, [results, quizSlug, phase, resetQuiz]);

  const handleRedo = async () => {
    if (resultId && window.confirm(locale === 'pt' ? 'Quer mesmo refazer? O resultado antigo será perdido.' : 'Do you really want to redo? The old result will be lost.')) {
      try {
        await deleteResult.mutateAsync(resultId);
        resetQuiz();
      } catch (err) {
        console.error("Failed to redo quiz:", err);
      }
    }
  };

  // Access gating: guests can't start, free users limited to 5
  const isGuest = !user;
  const canStart = isPremium || (!isGuest); // logged-in users can attempt (limit checked on submit)

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
        // Check quiz limit before submitting
        const canSubmit = await incrementQuizCompletion(quizSlug);
        if (!canSubmit) {
          // Limit reached — still show result but don't save
          setResultId(null);
          setPhase("done");
          return;
        }

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
  }, [idx, questions, answers, quizSlug, locale, submitResult, incrementQuizCompletion]);

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

  // CTA phase
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
          {isGuest ? (
            <Button asChild variant="hero" size="lg">
              <Link to={localePath("/login")}>
                <UserPlus className="mr-1.5 h-4 w-4" />
                {t("result.create_account")}
              </Link>
            </Button>
          ) : (
            <Button onClick={() => setPhase("active")} variant="hero" size="lg">
              {t("quiz.start")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Active question phase
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

  // Done phase — card-based results (no radar chart)
  const top = getTopDimensions(scores, dimensions, locale, 3);

  return (
    <motion.div
      id={`quiz-inline-${quizSlug}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-10 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8"
    >
      <h3 className="mb-6 text-center text-lg font-bold text-title">
        🗺️ {t("result.title")}
      </h3>

      {/* Card-based results instead of RadarChart */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {top.map((item, i) => (
          <Card key={item.dimension} className={cn(
            "overflow-hidden border-border/50 transition-all",
            i === 0 && "ring-1 ring-primary/20"
          )}>
            <CardContent className="p-0">
              <div className="h-1 bg-muted/30">
                <div className="h-full bg-secondary" style={{ width: `${item.score}%` }} />
              </div>
              <div className="p-4 text-center">
                <span className="text-2xl">{item.emoji}</span>
                <h4 className="mt-1 text-sm font-bold text-title">{item.label}</h4>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-foreground">{item.score}%</span>
                </div>
                <Badge className={cn("mt-2 text-[9px] font-bold uppercase", item.severityColor)}>
                  {item.severity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        {resultId ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to={localePath(`/resultado/${resultId}`)}>
                {t("quiz.see_result")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={handleRedo} variant="outline" size="lg" className="border-secondary/20 hover:bg-secondary/10 text-secondary">
              <RotateCcw className="mr-2 h-4 w-4" />
              {locale === 'pt' ? 'Refazer Quiz' : 'Redo Quiz'}
            </Button>
          </div>
        ) : (
          <Button asChild variant="hero" size="lg">
            <Link to={localePath("/dashboard")}>
              {locale === "pt" ? "Ir para o Dashboard" : "Go to Dashboard"} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizInline;

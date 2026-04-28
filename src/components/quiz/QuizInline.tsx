import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Clock, BarChart3, RotateCcw, UserPlus } from "lucide-react";
import { useQuizQuestions, calculateScores, useSubmitQuizResult, useDeleteQuizResult } from "@/hooks/useQuiz";
import { useUserResults } from "@/hooks/useDashboard";
import { useDimensions } from "@/hooks/useDimensions";
import { getTopDimensions } from "@/lib/quizInsights";
import { cn } from "@/lib/utils";
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
  const { user, isPremium, incrementQuizCompletion } = useAuth();
  const { data: questions = [], isLoading } = useQuizQuestions(quizSlug);
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
    if (resultId && window.confirm('Do you really want to redo this journey? Your old blueprint will be archived.')) {
      try {
        await deleteResult.mutateAsync(resultId);
        resetQuiz();
      } catch (err) {
        console.error("Failed to redo journey:", err);
      }
    }
  };

  const isGuest = !user;

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
        const canSubmit = await incrementQuizCompletion(quizSlug);
        if (!canSubmit) {
          setResultId(null);
          setPhase("done");
          return;
        }

        const id = await submitResult.mutateAsync({
          quizSlug,
          answers,
          scores: s,
          locale: "en",
        });
        setResultId(id);
      } catch {
        setResultId(null);
      }
      setPhase("done");
    }
  }, [idx, questions, answers, quizSlug, submitResult, incrementQuizCompletion]);

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
        className="my-10 overflow-hidden rounded-[1.5rem] border border-secondary/20 bg-gradient-to-br from-secondary/5 to-background p-8 md:p-10 shadow-sm"
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="text-5xl">🧪</span>
          <div className="flex-1">
            <h3 className="text-xl font-black text-title tracking-tight">
              {title ?? `What is your ${quizSlug} level?`}
            </h3>
            {subtitle && <p className="mt-2 text-md text-muted-foreground leading-relaxed">{subtitle}</p>}
            <div className="mt-4 flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                {Math.max(1, Math.round(questions.length * 0.4))} Min
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-secondary" />
                Instant Blueprint
              </span>
            </div>
          </div>
          {isGuest ? (
            <Button asChild variant="hero" size="lg" className="rounded-full px-8 py-7 font-black uppercase tracking-widest shadow-xl shadow-primary/10">
              <Link to="/login">
                <UserPlus className="mr-2 h-4 w-4" />
                Join to Start
              </Link>
            </Button>
          ) : (
            <Button onClick={() => setPhase("active")} variant="hero" size="lg" className="rounded-full px-8 py-7 font-black uppercase tracking-widest shadow-xl shadow-secondary/10">
              Start Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div
        id={`quiz-inline-${quizSlug}`}
        className="my-10 overflow-hidden rounded-[1.5rem] border border-secondary/20 bg-gradient-to-br from-secondary/5 to-background p-8 md:p-10 shadow-lg"
      >
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
            <span>Discovery {idx + 1} of {questions.length}</span>
            <span className="text-secondary">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2 bg-secondary/10" />
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={q.id} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <p className="mb-10 text-center text-lg font-black text-title md:text-2xl leading-relaxed">
              {q.question_text}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex-1 rounded-xl border-2 px-4 py-4 text-sm font-black transition-all duration-200 uppercase tracking-widest",
                    answers[q.id] === opt.value
                      ? "border-secondary bg-secondary text-white shadow-xl shadow-secondary/20"
                      : "border-border bg-card text-foreground hover:border-secondary/30"
                  )}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={idx === 0} className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={answers[q.id] == null} variant="hero" size="default" className="rounded-full px-8 py-6 font-black uppercase tracking-widest">
            {idx === questions.length - 1 ? "Reveal Blueprint" : "Next Discovery"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const top = getTopDimensions(scores, dimensions, "en", 3);

  return (
    <motion.div
      id={`quiz-inline-${quizSlug}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-10 overflow-hidden rounded-[2rem] border border-secondary/20 bg-gradient-to-br from-secondary/5 to-background p-8 md:p-12 shadow-2xl shadow-secondary/5"
    >
      <h3 className="mb-8 text-center text-2xl font-black text-title tracking-tight">
        🗺️ Your Core Blueprint
      </h3>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {top.map((item, i) => (
          <Card key={item.dimension} className={cn(
            "overflow-hidden border-border/50 transition-all hover:shadow-xl",
            i === 0 && "ring-2 ring-secondary/20 shadow-xl"
          )}>
            <CardContent className="p-0">
              <div className="h-1.5 bg-muted/30">
                <div className="h-full bg-secondary" style={{ width: `${item.score}%` }} />
              </div>
              <div className="p-6 text-center">
                <span className="text-3xl">{item.emoji}</span>
                <h4 className="mt-2 text-md font-black text-title">{item.label}</h4>
                <div className="mt-2 flex items-baseline justify-center gap-1.5">
                  <span className="text-3xl font-black text-foreground">{item.score}%</span>
                </div>
                <Badge className={cn("mt-4 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]", item.severityColor)}>
                  {item.severity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-6">
        {resultId ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button asChild variant="hero" size="lg" className="rounded-full px-10 py-8 text-lg font-black uppercase tracking-widest shadow-2xl shadow-secondary/30">
              <Link to={`/result/${resultId}`}>
                View Full Blueprint <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button onClick={handleRedo} variant="outline" size="lg" className="rounded-full px-8 py-7 font-black uppercase text-[10px] tracking-[0.2em] border-secondary/20 hover:bg-secondary/10 text-secondary">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Journey
            </Button>
          </div>
        ) : (
          <Button asChild variant="hero" size="lg" className="rounded-full px-10 py-8 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
            <Link to="/dashboard">
              Return to Blueprint <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizInline;

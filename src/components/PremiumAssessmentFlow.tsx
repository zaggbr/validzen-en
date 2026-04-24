import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  usePremiumAssessmentQuestions,
  calculatePatternScores,
  useSubmitPremiumResult,
} from "@/hooks/usePremiumAssessment";
import { PATTERN_PROFILES } from "@/types/premium-assessment";
import { cn } from "@/lib/utils";

interface PremiumAssessmentFlowProps {
  assessmentSlug: string;
  onComplete?: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const PremiumAssessmentFlow = ({ assessmentSlug, onComplete }: PremiumAssessmentFlowProps) => {
  const { user, isPremium } = useAuth();
  const { data: questions = [], isLoading } = usePremiumAssessmentQuestions(assessmentSlug, "en");
  const submitResult = useSubmitPremiumResult();

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [dir, setDir] = useState(1);
  const [result, setResult] = useState<ReturnType<typeof calculatePatternScores> | null>(null);

  useEffect(() => {
    if (questions.length === 0) return;
    try {
      const saved = localStorage.getItem(`premium_progress_${assessmentSlug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        const answeredKeys = Object.keys(parsed);
        if (answeredKeys.length > 0 && answeredKeys.length < questions.length) {
          const nextIdx = questions.findIndex(q => parsed[q.id] === undefined);
          if (nextIdx !== -1) setIdx(nextIdx);
          else setIdx(questions.length - 1);
        }
      }
    } catch {
      // fail silently
    }
  }, [questions, assessmentSlug]);

  const handleSelect = useCallback(
    (value: number) => {
      if (questions.length === 0) return;
      setAnswers((prev) => {
        const next = { ...prev, [questions[idx].id]: value };
        localStorage.setItem(`premium_progress_${assessmentSlug}`, JSON.stringify(next));
        return next;
      });
    },
    [idx, questions, assessmentSlug]
  );

  const handleNext = useCallback(async () => {
    if (idx < questions.length - 1) {
      setDir(1);
      setIdx((i) => i + 1);
    } else {
      const res = calculatePatternScores(questions, answers, "en");
      setResult(res);

      try {
        await submitResult.mutateAsync({
          assessmentSlug,
          answers,
          scores: res.scores,
          interpretation: {
            profile_slug: res.profile_slug,
            profile_name: res.profile_name,
            summary: "",
            dominant_pattern: res.dominant_pattern,
            secondary_pattern: res.secondary_pattern,
          },
          overall_score: res.overall_score,
          top_dimensions: [res.dominant_pattern, res.secondary_pattern],
        });
        
        localStorage.removeItem(`premium_progress_${assessmentSlug}`);
      } catch {
        // Result still shown even if save fails
      }
    }
  }, [idx, questions, answers, assessmentSlug, submitResult]);

  const handleBack = () => {
    if (idx > 0) {
      setDir(-1);
      setIdx((i) => i - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <Card className="border-secondary/20 bg-secondary/5 rounded-[2rem] shadow-xl shadow-secondary/5">
        <CardContent className="p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
             <Crown className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-3 text-2xl font-black text-title italic tracking-tight">Reveal My Insight Blueprint</h3>
          <p className="mb-10 text-md text-muted-foreground italic leading-relaxed text-balance">
            This is a deep-pattern discovery journey. To reveal your detailed psychological profile and tailored self-mastery path, please upgrade to PRO.
          </p>
          <div className="flex flex-col gap-4">
            <Button asChild variant="hero" className="rounded-full py-8 text-lg font-black uppercase tracking-widest shadow-2xl shadow-secondary/20">
              <Link to="/pro">Upgrade to PRO</Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" className="rounded-full py-6 font-black uppercase tracking-widest text-[10px] border-border hover:bg-secondary/5">
                <Link to="/login">Sign In to Continue</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
         <p className="text-md italic text-muted-foreground">
          No discovery questions available at the moment.
        </p>
      </div>
    );
  }

  if (result) {
    const patterns = Object.entries(result.scores).sort(([, a], [, b]) => b - a);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 p-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-secondary/10 shadow-lg shadow-secondary/5">
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </div>
          <h3 className="text-3xl font-black text-title italic tracking-tight">{result.profile_name}</h3>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic opacity-70">
            Your Dominant Discovery Pattern
          </p>
        </div>

        <div className="space-y-6">
          {patterns.map(([pattern, score]) => {
            const profile = PATTERN_PROFILES[pattern];
            const label = profile ? profile.en : pattern;
            const isTop = pattern === result.dominant_pattern;
            return (
              <div key={pattern} className="group">
                <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={cn("transition-colors", isTop ? "text-secondary" : "text-muted-foreground")}>{label}</span>
                  <span className="text-foreground/40">{score}% Match</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      isTop ? "bg-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)]" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Button variant="hero" size="lg" onClick={onComplete} className="rounded-full px-10 py-8 text-lg font-black uppercase tracking-widest shadow-2xl shadow-secondary/20">
            Return to Blueprint
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    );
  }

  const q = questions[idx];
  const pct = Math.round(((idx + 1) / questions.length) * 100);
  const questionText = q.question_text_en || q.question_text_pt;
  const options = q.options_en.length > 0 ? q.options_en : q.options_pt;

  return (
    <div className="space-y-10 p-4">
      <div>
        <div className="mb-3 flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
          <span>
            Discovery {idx + 1} of {questions.length}
          </span>
          <span className="text-secondary">{pct}% Completed</span>
        </div>
        <Progress value={pct} className="h-2.5 bg-secondary/10" />
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={q.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {q.section && (
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">{q.section}</p>
          )}
          <p className="mb-8 text-2xl font-black text-title italic tracking-tight leading-snug">{questionText}</p>
          <div className="flex flex-col gap-3">
            {options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={cn(
                  "rounded-2xl border-2 px-6 py-5 text-left text-md font-black italic transition-all duration-200",
                  answers[q.id] === optIdx
                    ? "border-secondary bg-secondary/5 text-title shadow-sm"
                    : "border-border bg-card text-foreground hover:border-secondary/20"
                )}
              >
                {typeof opt === "string" ? opt : (opt as any).text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-border pt-8">
        <Button variant="ghost" size="sm" onClick={handleBack} disabled={idx === 0} className="font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground hover:text-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={answers[q.id] == null}
          variant="hero"
          size="default"
          className="rounded-full px-8 py-6 font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-secondary/10"
        >
          {idx === questions.length - 1 ? "Reveal Blueprint" : "Next Discovery"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PremiumAssessmentFlow;

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
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
import { useI18n } from "@/i18n/I18nContext";
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
  const { t, locale, localePath } = useI18n();
  const { user, isPremium } = useAuth();
  const { data: questions = [], isLoading } = usePremiumAssessmentQuestions(assessmentSlug, locale);
  const submitResult = useSubmitPremiumResult();

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [dir, setDir] = useState(1);
  const [result, setResult] = useState<ReturnType<typeof calculatePatternScores> | null>(null);

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
      // Calculate results
      const res = calculatePatternScores(questions, answers, locale);
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
      } catch {
        // Result still shown even if save fails
      }
    }
  }, [idx, questions, answers, assessmentSlug, locale, submitResult]);

  const handleBack = () => {
    if (idx > 0) {
      setDir(-1);
      setIdx((i) => i - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <Card className="border-secondary/20 bg-secondary/5">
        <CardContent className="p-8 text-center">
          <Lock className="mx-auto mb-4 h-10 w-10 text-secondary" />
          <h3 className="mb-2 text-xl font-bold text-title">{t("pro.unlock_title")}</h3>
          <p className="mb-6 text-sm text-muted-foreground text-balance">
            {t("pro.unlock_desc")}
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild variant="hero">
              <Link to={localePath("/pro")}>{t("pro.upgrade_cta")}</Link>
            </Button>
            {!user && (
              <Button asChild variant="outline">
                <Link to={localePath("/login")}>{t("nav.login")}</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        {locale === "pt" ? "Nenhuma pergunta disponível." : "No questions available."}
      </p>
    );
  }

  // Result view
  if (result) {
    const patterns = Object.entries(result.scores).sort(([, a], [, b]) => b - a);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-2">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-title">{result.profile_name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "pt" ? "Seu perfil predominante" : "Your predominant profile"}
          </p>
        </div>

        <div className="space-y-3">
          {patterns.map(([pattern, score]) => {
            const profile = PATTERN_PROFILES[pattern];
            const label = profile ? (locale === "en" ? profile.en : profile.pt) : pattern;
            return (
              <div key={pattern}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{score}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      pattern === result.dominant_pattern
                        ? "bg-accent"
                        : pattern === result.secondary_pattern
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" onClick={onComplete}>
            {locale === "pt" ? "Ir para o Dashboard" : "Go to Dashboard"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // Question view
  const q = questions[idx];
  const pct = Math.round(((idx + 1) / questions.length) * 100);
  const questionText = locale === "en" ? (q.question_text_en || q.question_text_pt) : q.question_text_pt;
  const options = locale === "en"
    ? (q.options_en.length > 0 ? q.options_en : q.options_pt)
    : q.options_pt;

  return (
    <div className="space-y-6 p-2">
      <div>
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            {idx + 1} / {questions.length}
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={q.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {q.section && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">{q.section}</p>
          )}
          <p className="mb-5 text-base font-semibold text-title">{questionText}</p>
          <div className="flex flex-col gap-2">
            {options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={cn(
                  "rounded-lg border-2 px-4 py-3 text-left text-sm transition-all duration-150",
                  answers[q.id] === optIdx
                    ? "border-accent bg-accent/10 text-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-accent/40"
                )}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack} disabled={idx === 0}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {locale === "pt" ? "Voltar" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={answers[q.id] == null}
          variant="hero"
          size="default"
        >
          {idx === questions.length - 1
            ? locale === "pt" ? "Ver resultado" : "See result"
            : locale === "pt" ? "Próxima" : "Next"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PremiumAssessmentFlow;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";
import { DIMENSION_LABELS, DIMENSION_EMOJIS, Dimension } from "@/data/quizTypes";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";

function getScoreLevel(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "Baixo", color: "text-accent" };
  if (score <= 60) return { label: "Moderado", color: "text-secondary" };
  return { label: "Alto", color: "text-destructive" };
}

interface Props {
  result: {
    scores: Record<string, number>;
  };
  onRetry: () => void;
}

const QuizResultView = ({ result, onRetry }: Props) => {
  const { t, localePath } = useI18n();
  const sortedDimensions = Object.entries(result.scores).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block text-5xl">🗺️</span>
        <h1 className="mb-2 text-3xl font-bold text-title">
          {t("result.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("result.top_dimensions")}
        </p>
      </div>

      <div className="space-y-4">
        {sortedDimensions.map(([dim, score], i) => {
          const { label, color } = getScoreLevel(score);
          const dimension = dim as Dimension;
          return (
            <motion.div
              key={dim}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span>{DIMENSION_EMOJIS[dimension]}</span>
                  {DIMENSION_LABELS[dimension]}
                </span>
                <span className={cn("text-sm font-bold", color)}>
                  {score}% — {label}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    score <= 30
                      ? "bg-accent"
                      : score <= 60
                        ? "bg-secondary"
                        : "bg-destructive"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="hero" size="lg" asChild>
          <Link to={localePath("/dashboard")}>
            {t("dashboard.title")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={onRetry} className="gap-1">
          <RotateCcw className="h-4 w-4" /> {t("result.retry")}
        </Button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        ⚠️ {t("common.disclaimer_quiz")}
      </p>
    </motion.div>
  );
};

export default QuizResultView;

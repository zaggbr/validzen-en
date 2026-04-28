import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useDimensions } from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";

function getScoreLevel(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "Low", color: "text-accent" };
  if (score <= 60) return { label: "Moderate", color: "text-secondary" };
  return { label: "High", color: "text-destructive" };
}

interface Props {
  result: {
    scores: Record<string, number>;
  };
  onRetry: () => void;
}

const QuizResultView = ({ result, onRetry }: Props) => {
  const { data: dimensions = [] } = useDimensions();
  const dimMap = new Map(dimensions.map((d) => [d.slug, d]));

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
          Your Emotional Map
        </h1>
        <p className="text-sm text-muted-foreground">
          Here are your results across the psychological dimensions we analyzed.
        </p>
      </div>

      <div className="space-y-4">
        {sortedDimensions.map(([dim, score], i) => {
          const { label, color } = getScoreLevel(score);
          const d = dimMap.get(dim);
          const name = d ? d.name_en : dim;
          const emoji = d?.icon || "🧠";
          return (
            <motion.div
              key={dim}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="text-xl">{emoji}</span>
                  {name}
                </span>
                <span className={cn("text-xs font-black uppercase tracking-wider", color)}>
                  {score}% — {label}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    score <= 30 ? "bg-accent" : score <= 60 ? "bg-secondary" : "bg-destructive"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="hero" size="lg" asChild>
          <Link to="/dashboard">
            Go to My Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={onRetry} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" /> Retake Assessment
        </Button>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-60">
        ⚠️ This is not a clinical diagnosis. Use for self-reflection only.
      </p>
    </motion.div>
  );
};

export default QuizResultView;

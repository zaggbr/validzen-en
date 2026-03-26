import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-8 w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Pergunta {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
};

export default QuizProgress;

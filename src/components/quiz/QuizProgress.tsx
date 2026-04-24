import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-8 w-full">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
        <span>Question {current} of {total}</span>
        <span>{pct}% Completed</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
};

export default QuizProgress;

import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/i18n/I18nContext";

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);
  const { t } = useI18n();

  return (
    <div className="mb-8 w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("quiz.question_of", { current, total })}</span>
        <span>{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
};

export default QuizProgress;

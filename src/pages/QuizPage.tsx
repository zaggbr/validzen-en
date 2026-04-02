import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import { useQuizBySlug, useQuizQuestions, calculateScores, useSubmitQuizResult } from "@/hooks/useQuiz";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { getSpecificQuizCountToday, incrementSpecificQuizCount } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, ArrowLeft } from "lucide-react";

type Phase = "intro" | "questions" | "result";

const QuizPage = () => {
  const { slug = "geral" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const { t, locale, localePath } = useI18n();

  const isSpecific = slug !== "geral" && slug !== "general";
  const quizLimitReached = isSpecific && !isPremium && getSpecificQuizCountToday() >= 1;

  const { data: quiz, isLoading: quizLoading } = useQuizBySlug(slug, locale);
  const { data: questions = [], isLoading: questionsLoading } = useQuizQuestions(slug, locale);
  const submitResult = useSubmitQuizResult();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const handleStart = () => {
    if (isSpecific && !isPremium) {
      incrementSpecificQuizCount();
    }
    setPhase("questions");
  };

  const handleSelect = useCallback(
    (value: number) => {
      if (questions.length === 0) return;
      setAnswers((prev) => ({ ...prev, [questions[currentIdx].id]: value }));
    },
    [currentIdx, questions]
  );

  const handleNext = useCallback(async () => {
    if (currentIdx < questions.length - 1) {
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    } else {
      const scores = calculateScores(questions, answers);
      const quizSlug = quiz?.slug ?? slug;

      try {
        const resultId = await submitResult.mutateAsync({
          quizSlug,
          answers,
          scores,
          locale,
        });
        navigate(localePath(`/resultado/${resultId}`));
      } catch {
        // Error handled in hook via toast
      }
    }
  }, [currentIdx, questions, answers, quiz, slug, locale, localePath, navigate, submitResult]);

  const handleBack = useCallback(() => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx((i) => i - 1);
    }
  }, [currentIdx]);

  if (quizLoading || questionsLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-xl px-4 space-y-4">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-48" />
            <Skeleton className="mx-auto h-12 w-40" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="text-center">
            <span className="text-5xl">🧭</span>
            <h1 className="mt-4 text-2xl font-bold">{t("quiz.not_found") || "Quiz não encontrado"}</h1>
            <Link to={localePath("/")} className="mt-4 inline-block text-sm text-secondary hover:underline">
              {t("post.back_home")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const quizIntroData = {
    id: quiz.id,
    slug: quiz.slug,
    title: quiz.title,
    subtitle: quiz.description,
    questionCount: quiz.question_count || questions.length,
    estimatedMinutes: quiz.estimated_time || Math.max(1, Math.round(questions.length * 0.25)),
  };

  const currentQuestion = questions[currentIdx] || null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-8">
        {phase === "intro" && (
          <Link
            to={localePath("/")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
          </Link>
        )}
        {phase === "intro" && !quizLimitReached && (
          <QuizIntro quiz={quizIntroData} onStart={handleStart} />
        )}

        {phase === "intro" && quizLimitReached && (
          <Card className="mx-4 max-w-md text-center">
            <CardContent className="flex flex-col items-center p-8">
              <Crown className="mb-4 h-12 w-12 text-secondary" />
              <h2 className="mb-2 text-xl font-bold text-title">{t("pro.quiz_limit_title")}</h2>
              <p className="mb-6 text-sm text-muted-foreground">{t("pro.quiz_limit_desc")}</p>
              <Button variant="hero" size="lg" asChild>
                <Link to={localePath("/pro")}>{t("pro.upgrade_cta")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "questions" && currentQuestion && (
          <div className="w-full max-w-xl px-4">
            <QuizProgress current={currentIdx + 1} total={questions.length} />
            <QuizQuestionCard
              question={currentQuestion}
              selectedValue={answers[currentQuestion.id] ?? null}
              onSelect={handleSelect}
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentIdx === 0}
              isLast={currentIdx === questions.length - 1}
              direction={direction}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

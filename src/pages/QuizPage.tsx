import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import { useQuizBySlug, useQuizQuestions, calculateScores, useSubmitQuizResult } from "@/hooks/useQuiz";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, ArrowLeft, UserPlus } from "lucide-react";

type Phase = "intro" | "questions" | "result";

const QuizPage = () => {
  const { slug = "general" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isPremium, userUsage, incrementQuizCompletion } = useAuth();

  const isGlobal = slug === "general";

  const showLoginGate = !user;
  const showUpgradeGate = !!user && !isPremium && (isGlobal || userUsage.quizzesDone >= 3);

  const { data: quiz, isLoading: quizLoading } = useQuizBySlug(slug, "en");
  const { data: questions = [], isLoading: questionsLoading } = useQuizQuestions(slug, "en");
  const submitResult = useSubmitQuizResult();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const handleStart = () => {
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
        const canSubmit = await incrementQuizCompletion(quizSlug);
        if (!canSubmit) {
          navigate("/pro");
          return;
        }

        const resultId = await submitResult.mutateAsync({
          quizSlug,
          answers,
          scores,
          locale: "en",
        });
        navigate(`/result/${resultId}`);
      } catch {
        // Error handled in hook via toast
      }
    }
  }, [currentIdx, questions, answers, quiz, slug, navigate, submitResult, incrementQuizCompletion]);

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
          <div className="w-full max-w-xl px-4 space-y-6">
            <Skeleton className="mx-auto h-16 w-16 rounded-[1.25rem]" />
            <Skeleton className="mx-auto h-10 w-64" />
            <Skeleton className="mx-auto h-20 w-full rounded-2xl" />
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
            <span className="text-6xl">🧭</span>
            <h1 className="mt-6 text-3xl font-black italic">Journey Not Found</h1>
            <Link to="/dashboard" className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-secondary hover:underline">
              Return to Dashboard
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
    title: quiz.title_en || quiz.title,
    subtitle: quiz.description_en || quiz.description,
    questionCount: quiz.question_count || questions.length,
    estimatedMinutes: quiz.estimated_time || Math.max(1, Math.round(questions.length * 0.25)),
  };

  const currentQuestion = questions[currentIdx] || null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12">
        {phase === "intro" && (
          <Link
            to="/quizzes"
            className="mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Journeys
          </Link>
        )}
        {phase === "intro" && !showUpgradeGate && !showLoginGate && (
          <QuizIntro quiz={quizIntroData} onStart={handleStart} />
        )}

        {phase === "intro" && showUpgradeGate && user && (
          <Card className="mx-4 max-w-md text-center border-secondary/20 bg-secondary/5 rounded-[2.5rem] p-10 shadow-xl shadow-secondary/5">
            <CardContent className="flex flex-col items-center p-0">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
                <Crown className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-3xl font-black text-title italic tracking-tight">
                Unlock Full Access
              </h2>
              <p className="mb-10 text-md text-muted-foreground italic leading-relaxed">
                {isGlobal 
                  ? "Your Core Blueprint is a premium insight. Upgrade to PRO to reveal your deep results and unlock all discovery journeys." 
                  : "You've reached your free discovery limit. Subscribe to PRO for unlimited clinical-grade self-mastery journeys."}
              </p>
              <div className="flex flex-col gap-4 w-full">
                <Button variant="hero" size="lg" className="py-8 text-xl font-black uppercase tracking-widest rounded-full shadow-2xl shadow-secondary/20" asChild>
                  <Link to="/pro">Upgrade to PRO</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "intro" && showLoginGate && (
          <Card className="mx-4 max-w-md text-center border-border bg-card rounded-[2.5rem] p-10 shadow-lg">
            <CardContent className="flex flex-col items-center p-0">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <UserPlus className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-3xl font-black text-title italic tracking-tight">
                Begin Your Journey
              </h2>
              <p className="mb-10 text-md text-muted-foreground italic leading-relaxed">
                To embark on our self-mastery journeys and preserve your blueprints, we invite you to create a free account.
              </p>
              <div className="flex flex-col gap-4 w-full">
                <Button variant="hero" size="lg" className="py-8 text-xl font-black uppercase tracking-widest rounded-full shadow-2xl shadow-primary/10" asChild>
                  <Link to="/login">Join ValidZen for Free</Link>
                </Button>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                   Free members explore up to 3 core journeys.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "questions" && currentQuestion && (
          <div className="w-full max-w-xl px-4 animate-in fade-in zoom-in duration-500">
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

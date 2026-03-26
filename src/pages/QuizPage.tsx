import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizResultView from "@/components/quiz/QuizResultView";
import { getQuizBySlug, getQuestionsForQuiz } from "@/data/quizQuestions";
import {
  calculateScores,
  generateResultId,
  saveResultToLocalStorage,
} from "@/lib/quizScoring";
import { QuizResult } from "@/data/quizTypes";

type Phase = "intro" | "questions" | "result";

const QuizPage = () => {
  const { slug = "geral" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const quiz = getQuizBySlug(slug);
  const questions = getQuestionsForQuiz(slug);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [direction, setDirection] = useState(1);

  const handleStart = () => setPhase("questions");

  const handleSelect = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [questions[currentIdx].id]: value }));
    },
    [currentIdx, questions]
  );

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    } else {
      // finish
      const scores = calculateScores(questions, answers);
      const newResult: QuizResult = {
        id: generateResultId(),
        quizId: quiz?.id ?? slug,
        completedAt: new Date().toISOString(),
        answers,
        scores,
      };
      saveResultToLocalStorage(newResult);
      setResult(newResult);
      setPhase("result");
    }
  }, [currentIdx, questions, answers, quiz, slug]);

  const handleBack = useCallback(() => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx((i) => i - 1);
    }
  }, [currentIdx]);

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
    setDirection(1);
    setPhase("intro");
  };

  if (!quiz) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-8">
        {phase === "intro" && <QuizIntro quiz={quiz} onStart={handleStart} />}

        {phase === "questions" && (
          <div className="w-full max-w-xl px-4">
            <QuizProgress current={currentIdx + 1} total={questions.length} />
            <QuizQuestionCard
              question={questions[currentIdx]}
              selectedValue={answers[questions[currentIdx].id] ?? null}
              onSelect={handleSelect}
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentIdx === 0}
              isLast={currentIdx === questions.length - 1}
              direction={direction}
            />
          </div>
        )}

        {phase === "result" && result && (
          <QuizResultView result={result} onRetry={handleRetry} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

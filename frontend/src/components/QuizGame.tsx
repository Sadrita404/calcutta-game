import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Landmark,
  ScrollText,
  Scissors,
  Sparkles,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerOptions } from "@/components/AnswerOptions";
import { RASOGOLLA_ICON } from "@/data/landmarks";
import { QUIZ_MAX, quizQuestions, triviaQuestions, foodQuestions, type QuizCategory, type QuizQuestion } from "@/data/quiz";
import { playClick, playCorrect, playWrong } from "@/lib/sound";

const categoryIcons: Record<QuizCategory, LucideIcon> = {
  History: ScrollText,
  Landmarks: Landmark,
  Culture: BookOpen,
  Heritage: Sparkles,
  Embroidery: Scissors,
  Geography: Waves,
  Food: UtensilsCrossed,
};

function createQuestions(): QuizQuestion[] {
  return quizQuestions.map((question) => ({
    ...question,
    options: [...question.options].sort(() => Math.random() - 0.5),
  }));
}

interface QuizGameProps {
  geoScore: number;
  onFinish: (quizScore: number) => void;
}

export function QuizGame({ geoScore, onFinish }: QuizGameProps) {
  const [started, setStarted] = useState(false);
  const [questions] = useState<QuizQuestion[]>(createQuestions);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  const chooseAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null) return;
      const correct = answer === questions[index].correctAnswer;
      playClick();
      if (correct) playCorrect();
      else playWrong();
      setSelectedAnswer(answer);
      const nextScore = correct ? score + 10 : score;
      setScore(nextScore);

      advanceTimer.current = window.setTimeout(() => {
        if (index === questions.length - 1) {
          onFinish(nextScore);
        } else {
          setIndex(index + 1);
          setSelectedAnswer(null);
        }
      }, 1500);
    },
    [index, onFinish, questions, score, selectedAnswer],
  );

  if (!started) {
    return (
      <main className="app-frame app-frame-wide welcome-screen quiz-intro" data-testid="quiz-intro-screen">
        <div className="welcome-art quiz-intro-art" aria-hidden="true">
          <div className="welcome-sun" />
          <div className="quiz-intro-cards">
            <span className="quiz-chip quiz-chip-one">History</span>
            <span className="quiz-chip quiz-chip-two">Culture</span>
            <span className="quiz-chip quiz-chip-three">Food</span>
          </div>
          <span className="quiz-intro-mark">?</span>
          <div className="welcome-grain" />
        </div>
        <section className="welcome-content">
          <div className="mb-8 flex items-center gap-2" data-testid="quiz-intro-eyebrow">
            <span className="brand-mark"><Sparkles size={14} /></span>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5c5c5c]">Game 2 of 3</span>
          </div>
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="quiz-intro-kicker">
            You have {geoScore} Rasogollas so far
          </p>
          <h1 className="max-w-[320px] font-heading text-[3.65rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#1a1a1a]" data-testid="quiz-intro-title">
            Calcutta<span className="text-[#f0a800]">-</span><br />Quiz
          </h1>
          <p className="mt-6 max-w-[300px] font-sans text-[15px] leading-6 text-[#5c5c5c]" data-testid="quiz-intro-description">
            {triviaQuestions.length} questions on the city’s history and culture, then {foodQuestions.length} famous Kolkata foods to name from a picture.
          </p>
          <div className="mt-auto">
            <div className="mb-6 flex items-center gap-3 border-y border-black/8 py-4" data-testid="quiz-intro-facts">
              <div className="fact-item"><strong>{triviaQuestions.length}</strong><span>questions</span></div>
              <div className="fact-rule" />
              <div className="fact-item"><strong>{foodQuestions.length}</strong><span>food pictures</span></div>
              <div className="fact-rule" />
              <div className="fact-item"><strong className="fact-with-icon">{QUIZ_MAX} <img src={RASOGOLLA_ICON} alt="" className="rasogolla-icon rasogolla-icon-sm" /></strong><span>max Rasogollas</span></div>
            </div>
            <Button
              className="game-cta group w-full"
              size="lg"
              onClick={() => { playClick(); setStarted(true); }}
              data-testid="start-quiz-button"
            >
              <span>Start quiz</span>
              <ArrowRight className="ml-auto transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const question = questions[index];
  const nextQuestion = questions[index + 1];
  const CategoryIcon = categoryIcons[question.category];
  const isFood = Boolean(question.imageUrl);
  const number = String(index + 1).padStart(2, "0");

  return (
    <main className="app-frame app-frame-wide game-screen quiz-screen" data-testid="quiz-screen">
      <section className={`street-view quiz-visual ${isFood ? "quiz-visual-food" : "quiz-visual-trivia"}`} data-testid="quiz-visual-panel">
        <AnimatePresence mode="wait">
          {isFood ? (
            <motion.div key={question.id} className="food-stage" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              <img className="food-backdrop" src={question.imageUrl} alt="" aria-hidden="true" />
              <img className="food-image" src={question.imageUrl} alt="A famous Kolkata food to identify" data-testid="food-image" />
            </motion.div>
          ) : (
            <motion.div key={question.id} className="trivia-stage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <span className="trivia-number" aria-hidden="true">{number}</span>
              <span className="trivia-icon"><CategoryIcon size={26} strokeWidth={1.6} /></span>
              <span className="trivia-category" data-testid="quiz-category">{question.category}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {nextQuestion?.imageUrl && <link rel="preload" as="image" href={nextQuestion.imageUrl} />}
        <div className="street-view-header">
          <div className="location-pill" data-testid="quiz-pill"><Sparkles size={13} /><span>Calcutta-Quiz</span></div>
        </div>
      </section>

      <section className="answer-panel" data-testid="answer-panel">
        <div className="game-topline">
          <div className="score-pill" data-testid="quiz-score-counter">
            <img src={RASOGOLLA_ICON} alt="Rasogolla" className="rasogolla-icon" /> <span data-testid="quiz-score-value">{score}</span> Rasogollas
          </div>
          <span className="round-count" data-testid="quiz-round-counter">{number} <span>/ {questions.length}</span></span>
        </div>
        <div className="progress-track" data-testid="quiz-progress">
          <motion.div className="progress-fill" animate={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="question-kicker" data-testid="quiz-question-kicker">
              {isFood ? "FOOD" : question.category.toUpperCase()} · QUESTION {number}
            </p>
            <h2 className={isFood ? "question-title" : "question-title quiz-question-title"} data-testid="quiz-question-title">{question.question}</h2>
            <AnswerOptions
              options={question.options}
              correctAnswer={question.correctAnswer}
              selectedAnswer={selectedAnswer}
              onChoose={chooseAnswer}
              correctText="+10 Rasogollas! Spot on."
            />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

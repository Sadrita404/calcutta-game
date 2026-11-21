import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Compass,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { landmarks, RASOGOLLA_ICON, type LandmarkRound } from "@/data/landmarks";
import { AnswerOptions } from "@/components/AnswerOptions";
import { FinalScore } from "@/components/FinalScore";
import { QuizGame } from "@/components/QuizGame";
import { RasogollaCatcher } from "@/components/RasogollaCatcher";
import { playClick, playCorrect, playWrong } from "@/lib/sound";

type GamePhase = "welcome" | "playing" | "finished" | "quiz" | "catcher" | "final";

function shuffleOptions(options: string[]) {
  return [...options].sort(() => Math.random() - 0.5);
}

function createRounds(): LandmarkRound[] {
  return landmarks.map((landmark) => ({
    ...landmark,
    options: shuffleOptions(landmark.options),
  }));
}

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [rounds, setRounds] = useState<LandmarkRound[]>(createRounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [catcherScore, setCatcherScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const advanceTimer = useRef<number | null>(null);

  const startGame = useCallback(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setRounds(createRounds());
    setRoundIndex(0);
    setScore(0);
    setQuizScore(0);
    setCatcherScore(0);
    setSelectedAnswer(null);
    setPhase("playing");
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const chooseAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null) return;

      const currentRound = rounds[roundIndex];
      const correct = answer === currentRound.correctAnswer;
      playClick();
      if (correct) playCorrect();
      else playWrong();
      setSelectedAnswer(answer);
      if (correct) setScore((currentScore) => currentScore + 10);

      advanceTimer.current = window.setTimeout(() => {
        if (roundIndex === rounds.length - 1) {
          setPhase("finished");
        } else {
          setRoundIndex((currentIndex) => currentIndex + 1);
          setSelectedAnswer(null);
        }
      }, 1500);
    },
    [roundIndex, rounds, selectedAnswer],
  );

  const finishQuiz = useCallback((finalQuizScore: number) => {
    setQuizScore(finalQuizScore);
    setPhase("catcher");
  }, []);

  const finishCatcher = useCallback((finalCatcherScore: number) => {
    setCatcherScore(finalCatcherScore);
    setPhase("final");
  }, []);

  if (phase === "welcome") {
    return (
      <main className="app-frame app-frame-wide welcome-screen welcome-screen-banner" data-testid="welcome-screen">
        <div className="welcome-art welcome-banner" data-testid="welcome-banner">
          <img className="welcome-banner-backdrop" src="/banner/welcome-banner.jpg" alt="" aria-hidden="true" />
          <img
            className="welcome-banner-image"
            src="/banner/welcome-banner.jpg"
            alt="Kolkata: a city bus, Howrah Bridge, a yellow taxi, the Hooghly riverside and Victoria Memorial"
            fetchPriority="high"
            data-testid="welcome-banner-image"
          />
        </div>

        <section className="welcome-content">
          <div className="mb-8 flex items-center gap-2" data-testid="welcome-eyebrow">
            <span className="brand-mark"><Navigation size={15} fill="currentColor" /></span>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5c5c5c]">A street-view guessing game</span>
          </div>
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="welcome-kicker">Welcome to the city of joy</p>
          <h1 className="max-w-[320px] font-heading text-[3.65rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#1a1a1a]" data-testid="welcome-title">
            Calcutta<span className="text-[#f0a800]">-</span><br />Guesser
          </h1>
          <p className="mt-6 max-w-[290px] font-sans text-[15px] leading-6 text-[#5c5c5c]" data-testid="welcome-description">
            Find your way through ten iconic corners of Kolkata. Spot the place, pick the name, and collect Rasogollas.
          </p>

          <div className="mt-auto">
            <div className="mb-6 flex items-center gap-3 border-y border-black/8 py-4" data-testid="welcome-game-facts">
              <div className="fact-item"><strong>10</strong><span>landmarks</span></div>
              <div className="fact-rule" />
              <div className="fact-item"><strong className="fact-with-icon">100 <img src={RASOGOLLA_ICON} alt="" className="rasogolla-icon rasogolla-icon-sm" /></strong><span>max Rasogollas</span></div>
              <div className="fact-rule" />
              <div className="fact-item"><strong>3</strong><span>choices each</span></div>
            </div>
            <Button className="game-cta group w-full" size="lg" onClick={() => { playClick(); startGame(); }} aria-label="Start the Calcutta-Guesser game" data-testid="start-game-button">
              <span>Start game</span>
              <ArrowRight className="ml-auto transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </Button>
            <p className="mt-4 text-center font-sans text-[11px] text-[#8b8b8b]" data-testid="welcome-note">Tap Start game to begin round 1 · no map skills required</p>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "quiz") {
    return <QuizGame geoScore={score} onFinish={finishQuiz} />;
  }

  if (phase === "catcher") {
    return <RasogollaCatcher totalSoFar={score + quizScore} onFinish={finishCatcher} />;
  }

  if (phase === "final") {
    return <FinalScore geoScore={score} quizScore={quizScore} catcherScore={catcherScore} onRestart={startGame} />;
  }

  if (phase === "finished") {
    const resultMessage = score === 100 ? "Kolkata knows you back." : score >= 60 ? "A fine walk through the city." : "Every street is a new beginning.";
    return (
      <main className="app-frame" data-testid="results-screen">
        <section className="results-content">
          <div className="results-spark" aria-hidden="true"><Sparkles size={24} /></div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="results-kicker">Journey complete</p>
          <h1 className="mt-4 font-heading text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.06em] text-[#1a1a1a]" data-testid="results-title">You made it<br /><span className="text-[#f0a800]">through Kolkata.</span></h1>

          <div className="score-seal" data-testid="final-score-card">
            <div className="score-seal-inner">
              <img src={RASOGOLLA_ICON} alt="Rasogolla" className="score-seal-icon" data-testid="final-score-icon" />
              <span className="score-label">YOUR SCORE</span>
              <strong data-testid="final-score-value">{score}</strong>
              <span className="score-total">/ 100 RASOGOLLAS</span>
            </div>
          </div>
          <p className="mt-5 font-heading text-2xl italic text-[#1a1a1a]" data-testid="results-message">{resultMessage}</p>
          <p className="mt-2 max-w-[255px] text-center font-sans text-sm leading-5 text-[#5c5c5c]" data-testid="results-detail">You collected {score / 10} of 10 possible Rasogollas across the city.</p>

          <div className="mt-auto w-full">
            <div className="mb-5 flex items-center justify-center gap-2 text-[#f0a800]" aria-label={`${score / 10} Rasogollas collected`} data-testid="results-rasogolla-row">
              {Array.from({ length: 10 }).map((_, index) => (
                <img key={index} src={RASOGOLLA_ICON} alt="" className={index < score / 10 ? "rasogolla-dot is-earned" : "rasogolla-dot"} />
              ))}
            </div>
            <Button className="game-cta group w-full" size="lg" onClick={() => { playClick(); setPhase("quiz"); }} data-testid="next-game-button">
              <span>Next game: Calcutta-Quiz</span>
              <ArrowRight className="ml-auto transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </Button>
            <Button variant="ghost" className="secondary-cta mt-3 w-full" onClick={() => { playClick(); startGame(); }} data-testid="play-again-button">
              <RotateCcw size={16} />
              <span>Play Calcutta-Guesser again</span>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const currentRound = rounds[roundIndex];
  const nextRound = rounds[roundIndex + 1];

  return (
    <main className="app-frame app-frame-wide game-screen" data-testid="game-screen">
      <section className="street-view" data-testid="street-view-panel">
        <motion.img
          key={currentRound.id}
          className="street-view-image"
          src={currentRound.imageUrl}
          alt={`Street view clue from ${currentRound.location}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
        {nextRound && <link rel="preload" as="image" href={nextRound.imageUrl} />}
        <div className="street-view-shade" />
        <div className="street-view-header">
          <div className="location-pill" data-testid="location-pill"><MapPin size={14} fill="currentColor" /><span>Kolkata, West Bengal</span></div>
          <button className="icon-glass-button" aria-label="Compass" data-testid="compass-button"><Compass size={19} /></button>
        </div>
        <div className="street-view-controls" aria-hidden="true">
          <div className="control-stack"><Plus size={16} /><Minus size={16} /></div>
          <div className="pegman"><LocateFixed size={16} /></div>
        </div>
        <div className="image-caption" data-testid="image-caption">
          <span className="caption-kicker">LOOK AROUND</span>
          <span className="caption-location">Where are we?</span>
        </div>
      </section>

      <section className="answer-panel" data-testid="answer-panel">
        <div className="game-topline">
          <div className="score-pill" data-testid="score-counter"><img src={RASOGOLLA_ICON} alt="Rasogolla" className="rasogolla-icon" /> <span data-testid="score-value">{score}</span> Rasogollas</div>
          <span className="round-count" data-testid="round-counter">{String(roundIndex + 1).padStart(2, "0")} <span>/ 10</span></span>
        </div>
        <div className="progress-track" data-testid="round-progress">
          <motion.div className="progress-fill" animate={{ width: `${((roundIndex + 1) / 10) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentRound.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="question-kicker" data-testid="question-kicker">LANDMARK {String(roundIndex + 1).padStart(2, "0")}</p>
            <h2 className="question-title" data-testid="question-title">Which place is this?</h2>
            <p className="question-hint" data-testid="question-hint">Choose the landmark you think you’re seeing.</p>
            <AnswerOptions
              options={currentRound.options}
              correctAnswer={currentRound.correctAnswer}
              selectedAnswer={selectedAnswer}
              onChoose={chooseAnswer}
              correctText="+10 Rasogollas! Great eye."
            />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

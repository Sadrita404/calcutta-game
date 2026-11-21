import { useState } from "react";
import { Download, Gamepad2, LoaderCircle, MapPin, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RASOGOLLA_ICON } from "@/data/landmarks";
import { CATCHER_MAX, GEO_MAX, GRAND_MAX, QUIZ_MAX } from "@/data/quiz";
import { downloadScoreCard, scoreMessage } from "@/lib/scoreCard";
import { playClick } from "@/lib/sound";

interface FinalScoreProps {
  geoScore: number;
  quizScore: number;
  catcherScore: number;
  onRestart: () => void;
}

export function FinalScore({ geoScore, quizScore, catcherScore, onRestart }: FinalScoreProps) {
  const [saving, setSaving] = useState(false);
  const total = geoScore + quizScore + catcherScore;

  const handleDownload = async () => {
    playClick();
    setSaving(true);
    try {
      await downloadScoreCard(geoScore, quizScore, catcherScore);
      toast.success("Score card saved - share it with your friends!");
    } catch {
      toast.error("Couldn't create the score picture. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { label: "Calcutta-Guesser", value: geoScore, max: GEO_MAX, Icon: MapPin, testId: "final-geo-score" },
    { label: "Calcutta-Quiz", value: quizScore, max: QUIZ_MAX, Icon: Sparkles, testId: "final-quiz-score" },
    { label: "Rasogolla Catcher", value: catcherScore, max: CATCHER_MAX, Icon: Gamepad2, testId: "final-catcher-score" },
  ];

  return (
    <main className="app-frame" data-testid="final-scorecard-screen">
      <section className="results-content final-content">
        <div className="results-spark" aria-hidden="true"><Trophy size={22} /></div>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="final-kicker">All three games complete</p>
        <h1 className="mt-3 font-heading text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#1a1a1a]" data-testid="final-title">
          Your Kolkata<br /><span className="text-[#f0a800]">score card.</span>
        </h1>

        <div className="score-seal final-seal" data-testid="final-total-card">
          <div className="score-seal-inner">
            <img src={RASOGOLLA_ICON} alt="Rasogolla" className="score-seal-icon" />
            <span className="score-label">TOTAL</span>
            <strong data-testid="final-total-value">{total}</strong>
            <span className="score-total">/ {GRAND_MAX} RASOGOLLAS</span>
          </div>
        </div>
        <p className="mt-4 font-heading text-xl italic text-[#1a1a1a]" data-testid="final-message">{scoreMessage(total)}</p>

        <div className="final-breakdown" data-testid="final-breakdown">
          {rows.map(({ label, value, max, Icon, testId }) => (
            <div className="final-row" key={label} data-testid={testId}>
              <span className="final-row-icon"><Icon size={15} /></span>
              <span className="final-row-label">{label}</span>
              <span className="final-row-value">{value}<span> / {max}</span></span>
            </div>
          ))}
        </div>

        <div className="mt-auto w-full">
          <Button className="game-cta group w-full" size="lg" onClick={handleDownload} disabled={saving} data-testid="download-scorecard-button">
            {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Download size={18} />}
            <span>{saving ? "Creating picture…" : "Download score picture"}</span>
            <span className="ml-auto text-xs font-semibold uppercase tracking-widest opacity-60">PNG</span>
          </Button>
          <Button
            variant="ghost"
            className="secondary-cta mt-3 w-full"
            onClick={() => { playClick(); onRestart(); }}
            data-testid="final-play-again-button"
          >
            <RotateCcw size={16} />
            <span>Play all games again</span>
          </Button>
        </div>
      </section>
    </main>
  );
}

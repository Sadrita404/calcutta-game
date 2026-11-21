import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, Hand, Heart, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RASOGOLLA_ICON } from "@/data/landmarks";
import { CATCHER_LIVES, CATCHER_MAX, CATCHER_POINTS, CATCHER_TOTAL_SWEETS } from "@/data/catcher";
import { drawBowl, drawBurnt, drawChili, drawRasogolla } from "@/lib/catcherDraw";
import { playCatch, playClick, playCorrect, playWrong } from "@/lib/sound";

type Phase = "intro" | "countdown" | "playing" | "over";
type ItemKind = "rasogolla" | "chili" | "burnt";

interface FallingItem {
  kind: ItemKind;
  x: number;
  y: number;
  r: number;
  vy: number;
  rot: number;
  vr: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  text?: string;
  size: number;
}

interface Hud {
  score: number;
  lives: number;
  left: number;
}

interface CatcherResult {
  score: number;
  caught: number;
  reason: "done" | "lives";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function ChiliIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-20 -24 40 46" aria-hidden="true">
      <path d="M-10-11C-3-17 8-12 9-3C11 7 6 16-5 21C1 10-2 1-12-5Z" fill="#d9261a" />
      <path d="M-5-10Q3-10 4-2" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="-10" cy="-10" rx="6" ry="3.4" transform="rotate(-34 -10 -10)" fill="#2f7d32" />
      <path d="M-11-11Q-16-17-11-22" stroke="#2f7d32" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BurntIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-20 -24 40 46" aria-hidden="true">
      <path d="M-5-17Q-3-21-6-24M5-17Q7-21 4-24" stroke="rgba(70,60,55,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle r="15" fill="#2a170c" />
      <path d="M-8-1L-1 2L2-5M-1 2L1 8M5 2L9 5" stroke="#a5461a" strokeWidth="1.6" fill="none" />
      <circle cx="6" cy="-7" r="1.6" fill="#ff7a1a" />
      <circle cx="-7" cy="6" r="1.4" fill="#ff7a1a" />
    </svg>
  );
}

interface RasogollaCatcherProps {
  totalSoFar: number;
  onFinish: (catcherScore: number) => void;
}

export function RasogollaCatcher({ totalSoFar, onFinish }: RasogollaCatcherProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [session, setSession] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [hud, setHud] = useState<Hud>({ score: 0, lives: CATCHER_LIVES, left: CATCHER_TOTAL_SWEETS });
  const [hitPulse, setHitPulse] = useState(0);
  const [result, setResult] = useState<CatcherResult | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef(0.5);

  const startGame = () => {
    playClick();
    targetRef.current = 0.5;
    setHud({ score: 0, lives: CATCHER_LIVES, left: CATCHER_TOTAL_SWEETS });
    setResult(null);
    setCountdown(3);
    setPhase("countdown");
    setSession((value) => value + 1);
  };

  // One effect per game session: sets up the canvas, input and the animation loop.
  useEffect(() => {
    if (session === 0) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return;

    const icon = new Image();
    icon.src = RASOGOLLA_ICON;
    const size = { w: 0, h: 0 };
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    const game = {
      items: [] as FallingItem[],
      particles: [] as Particle[],
      bowl: 0.5,
      squash: 0,
      shake: 0,
      flash: 0,
      spawned: 0,
      caught: 0,
      score: 0,
      lives: CATCHER_LIVES,
      spawnTimer: 0.3,
      spawning: false,
      running: true,
      time: 0,
    };
    const keys = { left: false, right: false };
    const onKey = (event: KeyboardEvent) => {
      const down = event.type === "keydown";
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") keys.left = down;
      else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") keys.right = down;
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const timers = [
      window.setTimeout(() => { setCountdown(2); playClick(); }, 800),
      window.setTimeout(() => { setCountdown(1); playClick(); }, 1600),
      window.setTimeout(() => { setCountdown(0); playCorrect(); }, 2400),
      window.setTimeout(() => { game.spawning = true; setPhase("playing"); }, 2900),
    ];

    const burst = (x: number, y: number, color: string, text: string) => {
      game.particles.push({ x, y: y - 10, vx: 0, vy: -70, life: 0.9, max: 0.9, color, text, size: 20 });
      for (let i = 0; i < 9; i++) {
        const angle = (Math.PI * 2 * i) / 9;
        game.particles.push({ x, y, vx: Math.cos(angle) * 120, vy: Math.sin(angle) * 120 - 60, life: 0.5, max: 0.5, color, size: 3.2 });
      }
    };

    const endGame = (reason: CatcherResult["reason"]) => {
      game.running = false;
      setResult({ score: game.score, caught: game.caught, reason });
      setPhase("over");
      if (reason === "done") playCorrect();
    };

    let lastHud = "";
    const pushHud = () => {
      const next = { score: game.score, lives: game.lives, left: CATCHER_TOTAL_SWEETS - game.spawned };
      const key = `${next.score}|${next.lives}|${next.left}`;
      if (key !== lastHud) {
        lastHud = key;
        setHud(next);
      }
    };

    const update = (dt: number) => {
      const { w: W, h: H } = size;
      game.time += dt;
      const progress = game.spawned / CATCHER_TOTAL_SWEETS;

      // Bowl follows the finger/mouse target, keyboard nudges the target.
      if (keys.left) targetRef.current = clamp(targetRef.current - dt * 1.3, 0, 1);
      if (keys.right) targetRef.current = clamp(targetRef.current + dt * 1.3, 0, 1);
      game.bowl += (targetRef.current - game.bowl) * Math.min(1, dt * 16);
      game.squash = Math.max(0, game.squash - dt * 5);
      game.shake = Math.max(0, game.shake - dt);
      game.flash = Math.max(0, game.flash - dt * 1.6);

      if (game.spawning && game.spawned < CATCHER_TOTAL_SWEETS) {
        game.spawnTimer -= dt;
        if (game.spawnTimer <= 0) {
          const hazard = Math.random() < 0.12 + 0.14 * progress;
          const kind: ItemKind = hazard ? (Math.random() < 0.5 ? "chili" : "burnt") : "rasogolla";
          const r = clamp(W * 0.055, 17, 28);
          game.items.push({
            kind,
            x: r + Math.random() * (W - r * 2),
            y: -r * 2,
            r,
            vy: H * lerp(0.36, 0.72, progress) * (0.9 + Math.random() * 0.25),
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * (kind === "chili" ? 5 : 2),
          });
          if (kind === "rasogolla") game.spawned += 1;
          game.spawnTimer = lerp(0.95, 0.5, progress) * (0.85 + Math.random() * 0.3);
        }
      }

      const bowlW = clamp(W * 0.27, 86, 132);
      const bowlH = bowlW * 0.46;
      const bowlTop = H - bowlH - 22;
      const bowlX = clamp(game.bowl * W, bowlW / 2, W - bowlW / 2);

      game.items = game.items.filter((item) => {
        item.y += item.vy * dt;
        item.rot += item.vr * dt;
        const inBowl =
          item.y + item.r * 0.5 >= bowlTop - bowlH * 0.15 &&
          item.y - item.r <= bowlTop + bowlH * 0.35 &&
          Math.abs(item.x - bowlX) <= bowlW / 2 - item.r * 0.15;
        if (inBowl) {
          if (item.kind === "rasogolla") {
            game.caught += 1;
            game.score = Math.min(CATCHER_MAX, game.score + CATCHER_POINTS);
            game.squash = 1;
            burst(item.x, bowlTop, "#f0a800", `+${CATCHER_POINTS}`);
            playCatch();
          } else {
            game.lives -= 1;
            game.shake = 0.35;
            game.flash = 1;
            burst(item.x, bowlTop, "#e33b2e", item.kind === "chili" ? "Too spicy!" : "Burnt!");
            playWrong();
            navigator.vibrate?.(90);
            setHitPulse((value) => value + 1);
          }
          return false;
        }
        return item.y - item.r * 2 < H;
      });

      game.particles = game.particles.filter((particle) => {
        particle.life -= dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (!particle.text) particle.vy += 380 * dt;
        return particle.life > 0;
      });

      pushHud();
      if (game.lives <= 0) endGame("lives");
      else if (game.spawned >= CATCHER_TOTAL_SWEETS && !game.items.some((item) => item.kind === "rasogolla")) endGame("done");

      return { bowlW, bowlH, bowlTop, bowlX };
    };

    const draw = (bowl: { bowlW: number; bowlH: number; bowlTop: number; bowlX: number }) => {
      const { w: W, h: H } = size;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (game.shake > 0) ctx.translate((Math.random() - 0.5) * 12 * game.shake, (Math.random() - 0.5) * 8 * game.shake);

      for (const item of game.items) {
        ctx.save();
        ctx.translate(item.x, item.y);
        if (item.kind === "burnt") {
          drawBurnt(ctx, item.r, game.time);
        } else {
          ctx.rotate(item.rot);
          if (item.kind === "rasogolla") drawRasogolla(ctx, icon, item.r);
          else drawChili(ctx, item.r * 1.1);
        }
        ctx.restore();
      }

      drawBowl(ctx, icon, bowl.bowlX, bowl.bowlTop, bowl.bowlW, bowl.bowlH, game.squash, game.caught);

      for (const particle of game.particles) {
        ctx.globalAlpha = clamp(particle.life / particle.max, 0, 1);
        ctx.fillStyle = particle.color;
        if (particle.text) {
          ctx.font = `700 ${particle.size}px "Instrument Sans Variable", sans-serif`;
          ctx.textAlign = "center";
          ctx.lineWidth = 4;
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.strokeText(particle.text, particle.x, particle.y);
          ctx.fillText(particle.text, particle.x, particle.y);
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      if (game.flash > 0) {
        ctx.fillStyle = `rgba(227, 59, 46, ${game.flash * 0.22})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const bowl = update(dt);
      draw(bowl);
      if (game.running) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      game.running = false;
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [session]);

  const moveBowl = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    targetRef.current = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  };

  if (phase === "intro") {
    return (
      <main className="app-frame app-frame-wide welcome-screen catcher-intro" data-testid="catcher-intro-screen">
        <div className="welcome-art catcher-intro-art" aria-hidden="true">
          <div className="welcome-sun" />
          <img src={RASOGOLLA_ICON} alt="" className="catcher-drop catcher-drop-one" />
          <img src={RASOGOLLA_ICON} alt="" className="catcher-drop catcher-drop-two" />
          <span className="catcher-drop catcher-drop-three"><ChiliIcon size={34} /></span>
          <img src={RASOGOLLA_ICON} alt="" className="catcher-drop catcher-drop-four" />
          <div className="catcher-intro-bowl" />
          <div className="welcome-grain" />
        </div>
        <section className="welcome-content">
          <div className="mb-8 flex items-center gap-2" data-testid="catcher-intro-eyebrow">
            <span className="brand-mark"><Sparkles size={14} /></span>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5c5c5c]">Game 3 of 3 · Arcade</span>
          </div>
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="catcher-intro-kicker">
            You have {totalSoFar} Rasogollas so far
          </p>
          <h1 className="max-w-[340px] font-heading text-[3.3rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#1a1a1a]" data-testid="catcher-intro-title">
            Rasogolla<br /><span className="text-[#f0a800]">Catcher</span>
          </h1>
          <p className="catcher-intro-description mt-5 max-w-[320px] font-sans text-[15px] leading-6 text-[#5c5c5c]" data-testid="catcher-intro-description">
            Slide the clay bowl with one thumb and catch the falling Rasogollas. Dodge the chillies and burnt sweets.
          </p>
          <div className="mt-auto">
            <ul className="catcher-legend" data-testid="catcher-legend">
              <li><img src={RASOGOLLA_ICON} alt="" className="rasogolla-icon catcher-legend-icon" /><span>Rasogolla</span><strong className="text-[#2e7d32]">+{CATCHER_POINTS}</strong></li>
              <li><span className="catcher-legend-icon"><ChiliIcon /></span><span>Chili pepper</span><strong className="text-[#e33b2e]">−1 <Heart size={12} fill="currentColor" /></strong></li>
              <li><span className="catcher-legend-icon"><BurntIcon /></span><span>Burnt sweet</span><strong className="text-[#e33b2e]">−1 <Heart size={12} fill="currentColor" /></strong></li>
            </ul>
            <Button className="game-cta group w-full" size="lg" onClick={startGame} data-testid="start-catcher-button">
              <span>Start catching</span>
              <ArrowRight className="ml-auto transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "over" && result) {
    const perfect = result.caught === CATCHER_TOTAL_SWEETS;
    const title = result.reason === "lives" ? "Too spicy!" : perfect ? "Perfect bowl!" : "Bowl full!";
    return (
      <main className="app-frame" data-testid="catcher-over-screen">
        <section className="results-content">
          <div className="results-spark" aria-hidden="true"><img src={RASOGOLLA_ICON} alt="" className="h-full w-full rounded-full" /></div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e33b2e]" data-testid="catcher-over-kicker">
            {result.reason === "lives" ? "Out of hearts" : "All Rasogollas have fallen"}
          </p>
          <h1 className="mt-4 font-heading text-[3rem] font-semibold leading-[0.95] tracking-[-0.06em] text-[#1a1a1a]" data-testid="catcher-over-title">{title}</h1>
          <div className="score-seal" data-testid="catcher-score-card">
            <div className="score-seal-inner">
              <span className="score-label">CATCHER SCORE</span>
              <strong data-testid="catcher-score-value">{result.score}</strong>
              <span className="score-total">/ {CATCHER_MAX} RASOGOLLAS</span>
            </div>
          </div>
          <p className="mt-5 max-w-[260px] text-center font-sans text-sm leading-5 text-[#5c5c5c]" data-testid="catcher-over-detail">
            You caught {result.caught} of {CATCHER_TOTAL_SWEETS} Rasogollas.
          </p>
          <div className="mt-auto w-full">
            <Button className="game-cta group w-full" size="lg" onClick={() => { playClick(); onFinish(result.score); }} data-testid="catcher-finish-button">
              <span>See my final score card</span>
              <ArrowRight className="ml-auto transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </Button>
            <Button variant="ghost" className="secondary-cta mt-3 w-full" onClick={startGame} data-testid="catcher-retry-button">
              <RotateCcw size={16} />
              <span>Try Rasogolla Catcher again</span>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-frame catcher-screen" data-testid="catcher-screen">
      <header className="catcher-hud">
        <div className="score-pill" data-testid="catcher-score-counter">
          <img src={RASOGOLLA_ICON} alt="Rasogolla" className="rasogolla-icon" /> <span data-testid="catcher-live-score">{hud.score}</span> Rasogollas
        </div>
        <motion.div key={hitPulse} className="catcher-lives" animate={hitPulse ? { x: [0, -6, 6, -4, 4, 0] } : undefined} transition={{ duration: 0.4 }} data-testid="catcher-lives" aria-label={`${hud.lives} hearts left`}>
          {Array.from({ length: CATCHER_LIVES }).map((_, index) => (
            <Heart key={index} size={20} className={index < hud.lives ? "heart-full" : "heart-empty"} fill="currentColor" />
          ))}
        </motion.div>
      </header>
      <div className="catcher-progress">
        <div className="progress-track"><motion.div className="progress-fill" animate={{ width: `${((CATCHER_TOTAL_SWEETS - hud.left) / CATCHER_TOTAL_SWEETS) * 100}%` }} /></div>
        <span data-testid="catcher-remaining">{hud.left} left</span>
      </div>

      <div
        ref={stageRef}
        className="catcher-stage"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); moveBowl(event); }}
        onPointerMove={moveBowl}
        data-testid="catcher-stage"
      >
        <div className="catcher-skyline" aria-hidden="true" />
        <canvas ref={canvasRef} className="catcher-canvas" data-testid="catcher-canvas" />
        {phase === "countdown" && (
          <div className="catcher-countdown" data-testid="catcher-countdown">
            <motion.span key={countdown} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
              {countdown > 0 ? countdown : "Go!"}
            </motion.span>
            <p><Hand size={15} /> Drag anywhere to move the bowl</p>
          </div>
        )}
      </div>
    </main>
  );
}

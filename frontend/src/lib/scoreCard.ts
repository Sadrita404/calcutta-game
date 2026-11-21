import { RASOGOLLA_ICON } from "@/data/landmarks";
import { CATCHER_MAX, GEO_MAX, GRAND_MAX, QUIZ_MAX } from "@/data/quiz";

const HEADING = '"Playfair Display Variable", Georgia, serif';
const SANS = '"Instrument Sans Variable", Arial, sans-serif';
const WIDTH = 1080;
const HEIGHT = 1350;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export function scoreMessage(total: number) {
  const ratio = total / GRAND_MAX;
  if (ratio === 1) return "A true Kolkatan!";
  if (ratio >= 0.75) return "Kolkata runs in your heart.";
  if (ratio >= 0.5) return "A fine walk through the city.";
  return "Every street is a new beginning.";
}

function drawCard(ctx: CanvasRenderingContext2D, icon: HTMLImageElement, geoScore: number, quizScore: number, catcherScore: number) {
  const total = geoScore + quizScore + catcherScore;
  const cx = WIDTH / 2;

  // Paper background + saffron header band
  ctx.fillStyle = "#fdfbf7";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#edb93c";
  ctx.fillRect(0, 0, WIDTH, 470);
  ctx.fillStyle = "rgba(247, 220, 123, 0.9)";
  ctx.beginPath();
  ctx.arc(1010, 40, 110, 0, Math.PI * 2);
  ctx.fill();

  // Howrah-bridge style arch on the header
  ctx.strokeStyle = "rgba(141, 77, 52, 0.55)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-20, 420);
  ctx.quadraticCurveTo(cx, 250, WIDTH + 20, 420);
  ctx.stroke();
  for (let x = 60; x < WIDTH; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x, 420 - (170 - Math.abs(x - cx) / 4.2));
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `700 30px ${SANS}`;
  ctx.fillText("GUESSER  ·  QUIZ  ·  RASOGOLLA CATCHER", cx, 110);
  ctx.font = `600 96px ${HEADING}`;
  ctx.fillText("My Kolkata Score", cx, 220);

  // Rasogolla medallion overlapping the band
  ctx.save();
  ctx.fillStyle = "#fdfbf7";
  ctx.beginPath();
  ctx.arc(cx, 470, 122, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 470, 108, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(icon, cx - 108, 362, 216, 216);
  ctx.restore();

  // Total
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `600 210px ${HEADING}`;
  ctx.fillText(String(total), cx, 780);
  ctx.fillStyle = "#8a6a12";
  ctx.font = `700 36px ${SANS}`;
  ctx.fillText(`/ ${GRAND_MAX} RASOGOLLAS`, cx, 842);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `italic 500 50px ${HEADING}`;
  ctx.fillText(scoreMessage(total), cx, 925);

  // Breakdown rows
  const rows: [string, number, number][] = [
    ["Calcutta-Guesser", geoScore, GEO_MAX],
    ["Calcutta-Quiz", quizScore, QUIZ_MAX],
    ["Rasogolla Catcher", catcherScore, CATCHER_MAX],
  ];
  rows.forEach(([label, value, max], index) => {
    const y = 975 + index * 98;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(120, y, WIDTH - 240, 80, 22);
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = "#1a1a1a";
    ctx.font = `600 36px ${SANS}`;
    ctx.fillText(label, 160, y + 52);
    ctx.textAlign = "right";
    ctx.font = `700 38px ${SANS}`;
    ctx.fillText(`${value} / ${max}`, WIDTH - 160, y + 53);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#8b8b8b";
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(`Can you beat me?  ${window.location.host}`, cx, 1310);
}

/** Renders the score card to a PNG and triggers a download. */
export async function downloadScoreCard(geoScore: number, quizScore: number, catcherScore: number) {
  await Promise.all([
    document.fonts.load(`600 96px ${HEADING}`),
    document.fonts.load(`italic 500 50px ${HEADING}`),
    document.fonts.load(`700 36px ${SANS}`),
  ]).catch(() => undefined);
  const icon = await loadImage(RASOGOLLA_ICON);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  drawCard(ctx, icon, geoScore, quizScore, catcherScore);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create the score image");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `calcutta-score-${geoScore + quizScore + catcherScore}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

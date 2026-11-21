// Canvas drawing helpers for Rasogolla Catcher. All shapes are drawn around (0,0)
// unless noted, so the caller can translate/rotate freely.

export function drawRasogolla(ctx: CanvasRenderingContext2D, icon: HTMLImageElement, r: number) {
  if (icon.complete && icon.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, -r, -r, r * 2, r * 2);
    ctx.restore();
  } else {
    ctx.fillStyle = "#fff6e0";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawChili(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.scale(r / 20, r / 20); // designed in a 40x40 box
  const body = ctx.createLinearGradient(-10, -14, 8, 20);
  body.addColorStop(0, "#ff5a3c");
  body.addColorStop(1, "#b3140b");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-10, -11);
  ctx.bezierCurveTo(-3, -17, 8, -12, 9, -3);
  ctx.bezierCurveTo(11, 7, 6, 16, -5, 21);
  ctx.bezierCurveTo(1, 10, -2, 1, -12, -5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-5, -10);
  ctx.quadraticCurveTo(3, -10, 4, -2);
  ctx.stroke();
  // calyx + stem
  ctx.fillStyle = "#2f7d32";
  ctx.beginPath();
  ctx.ellipse(-10, -10, 6, 3.4, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2f7d32";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-11, -11);
  ctx.quadraticCurveTo(-16, -17, -11, -22);
  ctx.stroke();
  ctx.restore();
}

export function drawBurnt(ctx: CanvasRenderingContext2D, r: number, time: number) {
  // smoke wisps (drawn first, above the sweet)
  ctx.save();
  ctx.strokeStyle = "rgba(70,60,55,0.35)";
  ctx.lineWidth = Math.max(2, r * 0.14);
  ctx.lineCap = "round";
  for (let i = -1; i <= 1; i += 2) {
    const wob = Math.sin(time * 6 + i) * r * 0.15;
    ctx.beginPath();
    ctx.moveTo(i * r * 0.3, -r * 0.9);
    ctx.quadraticCurveTo(i * r * 0.3 + wob, -r * 1.35, i * r * 0.15 - wob, -r * 1.75);
    ctx.stroke();
  }
  ctx.restore();

  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, "#5a3622");
  g.addColorStop(0.7, "#2a170c");
  g.addColorStop(1, "#140a05");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8f3a10";
  ctx.lineWidth = Math.max(1.2, r * 0.07);
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.1);
  ctx.lineTo(-r * 0.1, r * 0.1);
  ctx.lineTo(r * 0.15, -r * 0.35);
  ctx.moveTo(-r * 0.1, r * 0.1);
  ctx.lineTo(r * 0.05, r * 0.55);
  ctx.moveTo(r * 0.35, r * 0.1);
  ctx.lineTo(r * 0.62, r * 0.3);
  ctx.stroke();
  ctx.fillStyle = "#ff7a1a";
  for (const [ex, ey] of [[0.4, -0.45], [-0.45, 0.4], [0.2, 0.4]]) {
    ctx.globalAlpha = 0.55 + Math.sin(time * 9 + ex * 10) * 0.35;
    ctx.beginPath();
    ctx.arc(ex * r, ey * r, Math.max(1.4, r * 0.08), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Terracotta "matir handi" bowl. (cx, top) is the centre of the rim. */
export function drawBowl(
  ctx: CanvasRenderingContext2D,
  icon: HTMLImageElement,
  cx: number,
  top: number,
  w: number,
  h: number,
  squash: number,
  caught: number,
) {
  ctx.save();
  ctx.translate(cx, top + h);
  ctx.scale(1 + squash * 0.08, 1 - squash * 0.1);
  ctx.translate(0, -h);

  // shadow
  ctx.fillStyle = "rgba(60, 30, 10, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, h + 6, w * 0.42, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // opening
  ctx.fillStyle = "#4a1c0b";
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // rasogollas peeking out of the bowl
  const peeks = Math.min(caught, 5);
  const pr = h * 0.27;
  const slots = [0, -0.22, 0.22, -0.38, 0.38];
  for (let i = 0; i < peeks; i++) {
    ctx.save();
    ctx.translate(slots[i] * w, -pr * (i === 0 ? 0.55 : 0.25));
    drawRasogolla(ctx, icon, pr);
    ctx.restore();
  }

  // body
  const body = ctx.createLinearGradient(-w / 2, 0, w / 2, h);
  body.addColorStop(0, "#c8653a");
  body.addColorStop(0.55, "#a64b24");
  body.addColorStop(1, "#7a3215");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.bezierCurveTo(-w / 2, h * 0.75, -w * 0.3, h, 0, h);
  ctx.bezierCurveTo(w * 0.3, h, w / 2, h * 0.75, w / 2, 0);
  ctx.ellipse(0, 0, w / 2, h * 0.2, 0, 0, Math.PI, false);
  ctx.closePath();
  ctx.fill();

  // decorative band + rim
  ctx.strokeStyle = "rgba(255, 214, 150, 0.55)";
  ctx.lineWidth = Math.max(1.5, h * 0.05);
  ctx.beginPath();
  ctx.ellipse(0, h * 0.38, w * 0.46, h * 0.16, 0, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.strokeStyle = "#e0865a";
  ctx.lineWidth = Math.max(3, h * 0.1);
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h * 0.2, 0, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
}

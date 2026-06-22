// src/canvas/rendererEffect.ts
import { assets } from "./assets"; // title.png を読み込む場所に合わせてね

let t = 0;

export function renderEffect(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: "title" | "menu" | "menu2" | "help" | "game" | "make" | "result",
  effectTimers: Record<string, number>,
  dt: number,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 1280, 720);
  const canvasRatio = 1280 / 720;
  let W, H, dx, dy;
  if (ratio > canvasRatio) {
    W = 1280;
    H = W / ratio;
    dy = (720 - H) / 2;
    dx = 0;
  } else {
    H = 720;
    W = H * ratio;
    dx = (1280 - W) / 2;
    dy = 0;
  }
  if (screen === "title") {
    const img = assets.title;

    const imgRatio = img.width / img.height;
    const layoutIsWide = ratio > 1.2;

    let drawW, drawH;

    if (layoutIsWide) {
      drawH = H * 0.23;
      drawW = drawH * imgRatio;
    } else {
      drawW = W * 0.8;
      drawH = drawW / imgRatio;
    }

    const offset = Math.sin(t) * (H * 0.01);
    t += 0.05;

    const x = dx + W * 0.5 - drawW / 2;
    const y = dy + H * 0.26 - drawH / 2 + offset;

    ctx.drawImage(img, x, y, drawW, drawH);
  }
  if (effectTimers.fadeIn > 0) {
    ctx.fillStyle = `rgba(0,0,0,${(300 - effectTimers.fadeIn) / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  } else if (effectTimers.fadeOut > 0) {
    ctx.fillStyle = `rgba(0,0,0,${effectTimers.fadeOut / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  }
}

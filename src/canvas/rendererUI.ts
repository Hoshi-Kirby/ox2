// rendererUI.ts
import { assets } from "./assets";

export function renderUI(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: "title" | "menu" | "menu2" | "help" | "game" | "make" | "result",
  effectTimers: Record<string, number>,
  hoverStates: Record<string, boolean>,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 1280, 720);

  const canvasW = 1280;
  const canvasH = 720;
  const canvasRatio = canvasW / canvasH;
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
  const layoutIsWide = ratio > 1.2;
  if (screen === "title") {
    let img = assets.btnStart;
    let btnW, btnH;

    if (layoutIsWide) {
      btnH = H * 0.06;
      btnW = btnH / 0.2365;
    } else {
      btnW = W * 0.4;
      btnH = btnW * 0.2365;
    }
    const x = dx + W * 0.5 - btnW / 2;
    const y = dy + H * 0.65;

    if (hoverStates.startButton) {
      img = assets.btnStartHover;
    }

    ctx.drawImage(img, x, y, btnW, btnH);
  }
  if (screen === "menu" || screen === "menu2") {
    if (layoutIsWide) {
      ctx.drawImage(assets.leftWhite, -400, 0, 1280 + 400, 720);
    } else {
      ctx.drawImage(assets.leftWhite, 0, 0, 1280 + 400, 720);
    }
  }
}

// src/canvas/rendererEffect.ts
import { assets } from "./assets";
type HoverUI = {
  startButton: boolean;
  back: boolean;
  menu: boolean[];
};
let t = 0;
let menuOffsets = [0, 0, 0, 0, 0];
let backOffset = 0;

export function renderEffect(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: "title" | "menu" | "menu2" | "help" | "game" | "make" | "result",
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
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

  const layoutIsWide = ratio > 1.2;
  if (screen === "title") {
    const img = assets.title;

    const imgRatio = img.width / img.height;

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
  } else if (screen === "menu") {
    let baseX = dx + W * 0.01;
    const baseY = dy + H * 0.1;

    let btnW = H * 0.45;
    const btnH =
      btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);

    let offsetX = H * 0.053;
    if (!layoutIsWide) {
      btnW = H * 0.4;
      baseX = dx + W * 0.5 - btnW / 2;
      offsetX = 0;
    }
    const offsetY = H * 0.15; // 縦の間隔

    for (let i = 0; i < 5; i++) {
      if (hoverStates.menu[i]) {
        menuOffsets[i] = Math.min(btnW * 0.1, menuOffsets[i] + dt * 0.4);
      } else {
        menuOffsets[i] = Math.max(0, menuOffsets[i] - dt * 0.6);
      }
      const x = baseX + offsetX * i + menuOffsets[i];
      const y = baseY + offsetY * i;

      ctx.drawImage(assets.buttonFrame1, x, y, btnW, btnH);
      const textImg = assets.menuText[i];
      if (textImg) {
        const textH = btnH * 0.8;
        const textW = textH / (textImg.height / textImg.width);
        const textX = x + btnW * 0.5 - textW * 0.5;
        const textY = y + btnH * 0.1;

        ctx.drawImage(textImg, textX, textY, textW, textH);
      }
    }

    if (hoverStates.back) {
      backOffset = Math.min(btnW * 0.1, backOffset + dt * 0.4);
    } else {
      backOffset = Math.max(0, backOffset - dt * 0.6);
    }
    const backX = baseX - H * 0.2;
    const backY = baseY + offsetY * 5 - H * 0.03;

    ctx.drawImage(assets.buttonFrame1, backX + backOffset, backY, btnW, btnH);
    const backImg = assets.backText;
    if (backImg) {
      const textH = btnH * 0.8;
      const textW = textH / (backImg.height / backImg.width);
      const textX = backX + btnW * 0.5;
      const textY = backY + btnH * 0.1;

      ctx.drawImage(backImg, textX, textY, textW, textH);
    }
  }
  if (effectTimers.fadeIn > 0) {
    ctx.fillStyle = `rgba(0,0,0,${(300 - effectTimers.fadeIn) / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  } else if (effectTimers.fadeOut > 0) {
    ctx.fillStyle = `rgba(0,0,0,${effectTimers.fadeOut / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  }
}

// rendererUI.ts
import { assets } from "./assets";
import type { Screen, HoverUI } from "../GameCanvas";

export function renderUI(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: Screen,
  effectTimers: Record<string, number>,
  hoverStates: HoverUI,
) {
  ctx.imageSmoothingEnabled = true;
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
    ctx.imageSmoothingEnabled = false;
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
  if (screen === "menu") {
    if (layoutIsWide) {
      ctx.drawImage(assets.leftWhite, -400, 0, 1280 + 400, 720);
    } else {
      ctx.drawImage(assets.leftWhite, 0, 0, 1280 + 400, 720);
    }
  }
  if (screen === "make") {
    const attrs = [
      "des",
      "gen",
      "dis",
      "sup",
    ] as (keyof typeof assets.cardAssets)[];
    let isPoolWide = true;

    const baseX = dx + W * 0.02;
    let baseY = dy + H * 0.02;

    const deckListW =
      H * 0.95 * (assets.deckList.width / assets.deckList.height);
    let cardPoolW = W - deckListW - W * 0.05;
    let cardPoolH = H - H * 0.2;

    if (!layoutIsWide) {
      baseY = dy + H * 0.2;
      cardPoolW = W - W * 0.05;
    }
    const cardAspectRatio =
      assets.cardAssets.des[1].height / assets.cardAssets.des[1].width;
    if (cardPoolH / 4 / (cardPoolW / 5) < cardAspectRatio) {
      isPoolWide = false;
    }

    let cardH = cardPoolH / 4 - cardPoolH * 0.01;
    let cardW = cardH / cardAspectRatio;
    let carddx = cardPoolW / 5;
    let carddy = cardPoolH / 4;
    if (isPoolWide) {
      cardW = cardPoolW / 5 - cardPoolW * 0.01;
      cardH = cardW * cardAspectRatio;
    }
    if (ratio < 1) {
    } else {
      for (let a = 0; a < attrs.length; a++) {
        for (let i = 1; i <= 5; i++) {
          const img = assets.cardAssets[attrs[a]][i];
          if (!img || !img.complete) continue;

          const x = baseX + (i - 1) * carddx;
          const y = baseY + a * carddy;

          ctx.drawImage(img, x, y, cardW, cardH);
        }
      }
    }
  } else if (screen === "game") {
    if (layoutIsWide) {
      let turnEndImg = assets.turnEnd;
      let turnEndBtnX = dx + W - H * 0.45;
      let turnEndBtnW = H * 0.4;
      if (ratio < 1.5) {
        turnEndBtnX = dx + W - H * 0.36;
        turnEndBtnW = H * 0.35;
      }
      if (hoverStates.turnEnd) {
        turnEndImg = assets.turnEndHover;
      }
      ctx.drawImage(
        turnEndImg,
        turnEndBtnX,
        dy + H * 0.45,
        turnEndBtnW,
        turnEndBtnW / (turnEndImg.width / turnEndImg.height),
      );
    }
  }
}

import { assets } from "./assets";
import type { Screen, Settings, HoverUI } from "../types";

export function renderEmpha(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: Screen,
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
  settingsRef: Settings,
) {
  ctx.imageSmoothingEnabled = true;
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
  if (screen === "make") {
    let leftWhiteX;

    if (layoutIsWide) {
      leftWhiteX = effectTimers.screenTransition - 200;
      ctx.drawImage(assets.leftWhite, -400 - leftWhiteX, 0, 1280 + 400, 720);
    } else {
      leftWhiteX =
        (100 + effectTimers.screenTransition) * 3 * (ratio / 1.2) ** 0.4;
      ctx.drawImage(assets.leftWhite, 0 - leftWhiteX, 0, 1280 + 400, 720);
    }
  } else if (screen === "game") {
    // ワイプ
    if (layoutIsWide) {
      const leftWipeX = -effectTimers.gameStartAnim;
      ctx.drawImage(
        assets.leftWipe,
        dx + leftWipeX,
        dy + H * 0.05,
        H * 0.95 * (assets.leftWipe.width / assets.leftWipe.height),
        H * 0.95,
      );
      const rightWipeX = effectTimers.gameStartAnim;
      ctx.drawImage(
        assets.rightWipe,
        dx + rightWipeX + W - H * 0.4,
        dy - H * 0.25,
        H * 0.4 * (assets.rightWipe.width / assets.rightWipe.height),
        H * 0.4,
      );
      ctx.drawImage(
        assets.rightWipe,
        dx + rightWipeX + W - H * 0.3,
        dy + H * 0.85,
        H * 0.4 * (assets.rightWipe.width / assets.rightWipe.height),
        H * 0.4,
      );
    }
    // ターンエンド
    let turnEndImg = assets.turnEnd;
    let turnEndBtnX = dx + W - H * 0.45;
    let turnEndBtnY = dy + H * 0.45;
    let turnEndBtnW = H * 0.4;
    if (ratio < 1.5) {
      turnEndBtnX = dx + W - H * 0.36;
      turnEndBtnW = H * 0.35;
    }
    if (hoverStates.turnEnd) {
      turnEndImg = assets.turnEndHover;
    }

    if (!layoutIsWide) {
      turnEndBtnW = H * 0.2;
      turnEndBtnX = dx + W * 0.5 - turnEndBtnW / 2;
      turnEndBtnY = dy + H * 0.7;
    }
    ctx.drawImage(
      turnEndImg,
      turnEndBtnX,
      turnEndBtnY,
      turnEndBtnW,
      turnEndBtnW / (turnEndImg.width / turnEndImg.height),
    );
  }
}

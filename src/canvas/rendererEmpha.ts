import { assets } from "./assets";
import type { Screen, Settings, HoverUI } from "../GameCanvas";

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
  }
}

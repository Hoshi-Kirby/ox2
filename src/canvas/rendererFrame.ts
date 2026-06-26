// src/canvas/rendererFrame.ts
import { assets } from "./assets";

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  screen:
    | "title"
    | "menu"
    | "menuOffline"
    | "menuHelp"
    | "menuDeck"
    | "menuSetting"
    | "help"
    | "game"
    | "make"
    | "result",
) {
  const canvas = ctx.canvas;
  const W = canvas.width;
  const H = canvas.height;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 1280, 720);
  if (screen === "title") {
    ctx.drawImage(assets.titleBg, 0, 0, W, H);
  } else if (
    screen === "menu" ||
    screen === "menuOffline" ||
    screen === "menuHelp" ||
    screen === "menuDeck" ||
    screen === "menuSetting"
  ) {
    ctx.drawImage(assets.menuBg, 0, 0, W, H);
  }
}

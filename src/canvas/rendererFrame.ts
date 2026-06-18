// src/canvas/rendererFrame.ts
import { assets } from "./assets";

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  screen: "title" | "menu" | "game" | "make" | "result",
) {
  const canvas = ctx.canvas;
  const W = canvas.width;
  const H = canvas.height;

  if (screen === "title") {
    ctx.drawImage(assets.titleBg, 0, 0, W, H);
  }
}

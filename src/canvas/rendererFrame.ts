// src/canvas/rendererFrame.ts
import { assets } from "./assets";

export async function renderFrame(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas;
  const W = canvas.width;
  const H = canvas.height;

  const img = await assets.titleBg;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
}

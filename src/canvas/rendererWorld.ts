import { loadImage } from "./assets";

export async function renderStatic(ctx: CanvasRenderingContext2D) {
  // 背景画像を読み込む
  const bg = await loadImage("/wallpaper.png");

  // Canvas 全体に描画
  ctx.drawImage(bg, 0, 0, ctx.canvas.width, ctx.canvas.height);

  // 盤面や駒もここに描く
  // drawBoard(ctx, G.board);
  // drawPieces(ctx, G.pieces);
}

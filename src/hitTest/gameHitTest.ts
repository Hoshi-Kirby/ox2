import { assets } from "../canvas/assets";

// 共通レイアウト計算
function computeLayout(ratio: number) {
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

  return { W, H, dx, dy, layoutIsWide: ratio > 1.2 };
}

// ターンエンド
export function isInsideTurnEndButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy } = computeLayout(ratio);
  let turnEndImg = assets.turnEnd;
  let bx = dx + W - H * 0.45;
  let bw = H * 0.4;
  if (ratio < 1.5) {
    bx = dx + W - H * 0.36;
    bw = H * 0.35;
  }
  const by = dy + H * 0.45;
  const bh = bw / (turnEndImg.width / turnEndImg.height);
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

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
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);
  let turnEndImg = assets.turnEnd;
  let bx = dx + W - H * 0.45;
  let by = dy + H * 0.45;
  let bw = H * 0.4;
  if (ratio < 1.5) {
    bx = dx + W - H * 0.36;
    bw = H * 0.35;
  }
  if (!layoutIsWide) {
    bw = H * 0.2;
    bx = dx + W * 0.5 - bw / 2;
    by = dy + H * 0.7;
  }

  const bh = bw / (turnEndImg.width / turnEndImg.height);
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

// 手札カードのホバー判定
export function isInsideHandCard(
  x: number,
  y: number,
  ratio: number,
  i: number,
  j: number,
  handSize: number,
  playerID: string,
) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);
  let baseX = W * 0.01;
  let cardPool = W * 0.98;
  if (layoutIsWide) {
    baseX = H * 0.42;
    cardPool = W - H * 0.8;
  }
  let cardW = cardPool / 5.1;
  let cardH =
    cardW * (assets.cardAssets.gen[1].height / assets.cardAssets.gen[1].width);

  if (cardH > H * 0.2) {
    cardH = H * 0.2;

    cardW =
      cardH /
      (assets.cardAssets.gen[1].height / assets.cardAssets.gen[1].width);
  }
  const isBottom = i === Number(playerID);
  const baseY = isBottom ? H * 0.96 - cardH : H * 0.04;

  let gap = (cardPool - cardW * 5) / 4;
  let cardX1 = baseX;
  if (handSize > 5) {
    gap = (cardPool - cardW * handSize) / (handSize - 1);
  } else {
    cardX1 = baseX + (cardPool - handSize * cardW - (handSize - 1) * gap) / 2;
  }
  const cardX = dx + cardX1 + j * (cardW + gap);
  const cardY = dy + baseY;
  return x >= cardX && x <= cardX + cardW && y >= cardY && y <= cardY + cardH;
}

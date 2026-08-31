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
// 駒
export function isInsideBoardCell(
  x: number,
  y: number,
  ratio: number,
  i: number,
  j: number,
  floor: number,
) {
  const { W, H, dx, dy } = computeLayout(ratio);
  const boardW = (() => {
    const layoutIsWide = ratio > 1.2;

    let w = H * 0.5;

    if (!layoutIsWide) {
      w = H * 0.4;
    } else if (ratio < 1.3) {
      w = W * 0.38;
    }

    return w;
  })();
  const boardH = boardW;
  const boardX = dx + W * 0.5 - boardW / 2;
  const boardY = dy + H * 0.5 - boardH / 2;
  const cellW = boardW / 5;
  const cellH = boardH / 5;
  const cellX = boardX + cellW * i;
  const cellY = boardY + cellH * j;
  return x >= cellX && x <= cellX + cellW && y >= cellY && y <= cellY + cellH;
}
// 囲碁駒
export function isInsideMidBoardCell(
  x: number,
  y: number,
  ratio: number,
  i: number, // 0 or 1
  j: number, // 0 or 1
  floor: number,
) {
  const { W, H, dx, dy } = computeLayout(ratio);

  // boardW は isInsideBoardCell と同じロジック
  const boardW = (() => {
    const layoutIsWide = ratio > 1.2;

    let w = H * 0.5;

    if (!layoutIsWide) {
      w = H * 0.4;
    } else if (ratio < 1.3) {
      w = W * 0.38;
    }

    return w;
  })();
  const boardH = boardW;
  const boardX = dx + W * 0.5 - boardW / 2;
  const boardY = dy + H * 0.5 - boardH / 2;
  const cellW = boardW / 5;
  const cellH = boardH / 5;
  const px = boardX + cellW * (i + 2);
  const py = boardY + cellH * (j + 2);
  const radius = cellW * 0.35; // 半径
  const dx2 = x - px;
  const dy2 = y - py;

  return dx2 * dx2 + dy2 * dy2 <= radius * radius;
}

// ポーズ
export function isInsidePauseButton(x: number, y: number, ratio: number) {
  const { H, dx, dy, layoutIsWide } = computeLayout(ratio);
  let bx, by, bw, bh;
  if (layoutIsWide) {
    bx = dx + H * 0.01;
    by = dy + H * 0.01;
    bw = H * 0.1;
    bh = H * 0.1;
  } else {
    bx = dx + H * 0.01;
    by = dy + H * 0.01;
    bw = H * 0.05;
    bh = H * 0.05;
  }
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
export function isInsidePauseContinueButton(
  x: number,
  y: number,
  ratio: number,
) {
  const { W, H, dx, dy } = computeLayout(ratio);
  const bw = H * 0.3;
  const bh = bw * (assets.pauseContinue.height / assets.pauseContinue.width);
  const bx = dx + W * 0.5 - bw / 2;
  const by = dy + H * 0.4;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
export function isInsidePauseRestartButton(
  x: number,
  y: number,
  ratio: number,
) {
  const { W, H, dx, dy } = computeLayout(ratio);
  const bw = H * 0.3;
  const bh = bw * (assets.pauseContinue.height / assets.pauseContinue.width);
  const bx = dx + W * 0.5 - bw / 2;
  const by = dy + H * 0.5;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
export function isInsidePauseEndButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy } = computeLayout(ratio);
  const bw = H * 0.3;
  const bh = bw * (assets.pauseContinue.height / assets.pauseContinue.width);
  const bx = dx + W * 0.5 - bw / 2;
  const by = dy + H * 0.6;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

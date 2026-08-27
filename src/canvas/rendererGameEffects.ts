import { assets } from "./assets";
import type { GameState } from "../game/MyGame";
import { cardDefs } from "../data";
import type { Screen, Settings, HoverUI, CardID } from "../types";

export function renderGameEffect(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: Screen,
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
  settingsRef: Settings,
  G: GameState,
  bgCtx: any,
  playerID: string,
) {
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, 1280, 720);
  const canvasRatio = 1280 / 720;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
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
  let boardW = H * 0.5;
  if (!layoutIsWide) {
    boardW = H * 0.4;
  } else if (ratio < 1.3) {
    boardW = W * 0.38;
  }
  const boardH = boardW;
  const boardX = dx + W * 0.5 - boardW / 2;
  const boardY = dy + H * 0.5 - boardH / 2;

  if (screen === "game") {
    // ctx.drawImage(assets.quickMenu[0], boardX, boardY, boardW, boardH);
    // 線
    // 駒
    // カード
    // //ホバー
    for (let i = 0; i < 2; i++) {
      const isBottom = i === Number(playerID);
      let baseX = W * 0.01;
      let cardPool = W * 0.98;
      if (layoutIsWide) {
        baseX = H * 0.42;
        cardPool = W - H * 0.8;
      }
      let cardW = cardPool / 5.1;
      let cardH =
        cardW *
        (assets.cardAssets.gen[1].height / assets.cardAssets.gen[1].width);
      if (cardH > H * 0.2) {
        cardH = H * 0.2;
        cardW =
          cardH /
          (assets.cardAssets.gen[1].height / assets.cardAssets.gen[1].width);
      }
      let baseY = isBottom ? H * 0.96 - cardH : H * 0.07;
      if (layoutIsWide) {
        baseY = isBottom ? H * 0.96 - cardH : H * 0.04;
      }

      // //最初の手札アニメーション
      const handSize = Math.min(
        G.hand[i].length,
        Math.floor(
          (1 - (effectTimers.gameStartCount - 1000) / 3500) * G.hand[i].length,
        ),
      );
      const animationDuration: number = 100;
      const elapsed: number = 4500 - effectTimers.gameStartCount;
      const animationStartTime: number = (3500 * handSize) / G.hand[i].length;
      const animationElapsed: number = elapsed - animationStartTime;
      const progress: number = Math.min(
        1,
        animationElapsed / animationDuration,
      );
      // //

      for (let j = 0; j < handSize; j++) {
        if (
          G.phase === "payCost" &&
          G.activeCard === j &&
          bgCtx.currentPlayer == i
        ) {
          continue;
        }
        if (hoverStates.hoverHands[i] === j) {
          const card = G.hand[i][j];
          const img = assets.cardAssets[card.attr][card.index];

          const afterX: number = getHandCardX(
            handSize,
            j,
            baseX,
            cardPool,
            cardW,
          );
          const beforeX: number = getHandCardX(
            handSize - 1, //要変更
            j,
            baseX,
            cardPool,
            cardW,
          );
          // 移動量
          const moveX: number = (beforeX - afterX) * (1 - progress);
          let activeY = 0;

          if (bgCtx.currentPlayer == i) {
            if (G.phase === "payCost" && G.costCards.indexOf(j) >= 0) {
              activeY = -cardH * 0.1;
            }
          }
          let x: number = dx + afterX + moveX;
          const y: number = dy + baseY + activeY;
          // カード画像
          ctx.drawImage(
            img,
            x - cardW * 0.02,
            y - cardH * 0.02,
            cardW + cardW * 0.04,
            cardH + cardH * 0.04,
          );
          const def = cardDefs[card.attr][card.index];
          const folder = def.costType === "flip" ? "w" : "r";
          const imgN = assets.costNumber[folder][def.cost];
          // コスト数字
          ctx.drawImage(
            imgN,
            x - cardW * 0.02,
            y - cardH * 0.02,
            (cardW + cardW * 0.04) * 0.3,
            (cardW + cardW * 0.04) * 0.3 * (imgN.height / imgN.width),
          );
        }
      }
    }

    // ウィンドウ
    // // カード効果
    for (let i = 0; i < 2; i++) {
      if (hoverStates.hoverHands[i] >= 0 && layoutIsWide) {
        const hoverIndex = hoverStates.hoverHands[i];
        if (hoverIndex >= 0 && hoverIndex < G.hand[i].length) {
          const card = G.hand[i][hoverIndex];
          const img = assets.cardDescriptionAssets[card.attr][card.index];
          ctx.drawImage(
            img,
            dx - H * 0.005,
            dy + H * 0.267,
            H * 0.38,
            H * 0.38 * (img.height / img.width),
          );
        }
      } else if (hoverStates.hoverHands[i] >= 0) {
        const hoverIndex = hoverStates.hoverHands[i];
        if (hoverIndex >= 0 && hoverIndex < G.hand[i].length) {
          const wipeRatio = assets.centerWipe.height / assets.centerWipe.width;
          let cWipeW = W * 0.9;
          let cWipeH = cWipeW * wipeRatio;
          if (cWipeH > H * 0.8) {
            cWipeH = H * 0.8;
            cWipeW = cWipeH / wipeRatio;
          }
          ctx.drawImage(
            assets.centerWipe,
            dx + W / 2 - cWipeW / 2,
            dy + H / 2 - cWipeH / 2,
            cWipeW,
            cWipeH,
          );
          const card = G.hand[i][hoverIndex];
          const img = assets.cardDescriptionAssets[card.attr][card.index];
          ctx.drawImage(
            img,
            dx + W / 2 - cWipeW * 0.49,
            dy + H / 2 - cWipeH * 0.47,
            cWipeW * 0.98,
            cWipeH * 0.98,
          );
        }
      }
    }
    // ターン
  }
}
function getHandCardX(
  handSize: number,
  index: number,
  baseX: number,
  cardPool: number,
  cardW: number,
): number {
  let gap = (cardPool - cardW * 5) / 4;
  let cardX = baseX;

  if (handSize > 5) {
    gap = (cardPool - cardW * handSize) / (handSize - 1);
  } else {
    cardX = baseX + (cardPool - handSize * cardW - (handSize - 1) * gap) / 2;
  }

  return cardX + index * (cardW + gap);
}

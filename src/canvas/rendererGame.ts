import { assets } from "./assets";
import type { GameState } from "../game/MyGame";
import type { Screen, Settings, HoverUI, CardID } from "../types";

export function renderGame(
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
    for (let i = 0; i < 2; i++) {
      ctx.drawImage(
        assets.neonLine,
        boardX + boardW * 0.02,
        boardY + boardH * 0.23 + boardH * 0.19 * i,
        boardW,
        boardW * (assets.neonLine.height / assets.neonLine.width),
      );
    }
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(boardX + boardW / 2, boardY + boardH / 2);
      ctx.rotate(Math.PI / 2);
      const lineY = -boardH / 2 + boardH * 0.23 + boardH * 0.19 * i;
      const lineX = -boardW / 2 + boardW * 0.02;

      ctx.drawImage(
        assets.neonLine,
        lineX,
        lineY,
        boardW,
        boardW * (assets.neonLine.height / assets.neonLine.width),
      );
      ctx.restore();
    }

    // 駒
    for (let z = 0; z < 3; z++) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          if (G.board[z][y][x] >= 1) {
            ctx.drawImage(
              assets.token[G.board[z][y][x] - 1],
              boardX + (boardW / 5) * x,
              boardY + (boardH / 5) * y,
              boardW / 5,
              boardH / 5,
            );
          }
        }
      }
    }
    // カード
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
      const baseY = isBottom ? H * 0.96 - cardH : H * 0.04;
      let gap = (cardPool - cardW * 5) / 4;
      let cardX = baseX;
      const handSize = G.hand[i].length;
      if (handSize > 5) {
        gap = (cardPool - cardW * handSize) / (handSize - 1);
      } else {
        cardX =
          baseX + (cardPool - handSize * cardW - (handSize - 1) * gap) / 2;
      }

      for (let j = 0; j < handSize; j++) {
        const card = G.hand[i][j];
        const img = assets.cardAssets[card.attr][card.index];
        const x = dx + cardX + j * (cardW + gap);
        const y = dy + baseY;
        ctx.drawImage(img, x, y, cardW, cardH);
      }
    }

    // ウィンドウ
    // ターン
    if (layoutIsWide) {
      ctx.drawImage(
        assets.token[bgCtx.currentPlayer],
        dx + H * 0.03,
        dy + H * 0.175,
        H * 0.08,
        H * 0.08,
      );
      ctx.drawImage(
        assets.noTurn,
        dx + H * 0.1,
        dy + H * 0.17,
        H * 0.26,
        H * 0.26 * (assets.noTurn.height / assets.noTurn.width),
      );

      ctx.font = "40px KiwiMaru-Medium";
      ctx.fillStyle = "#ffffff";

      const turnText = `ターン ${bgCtx.turn}`;

      ctx.fillText(turnText, dx + W * 0.1, dy + H * 0.85);
    }
  }
}

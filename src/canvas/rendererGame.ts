import { assets } from "./assets";
import type { GameState } from "../game/MyGame";
import { cardDefs } from "../data";
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
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        for (let z = 0; z < 3; z++) {
          const token = G.board[x][y][z];
          if (token >= 1) {
            const baseW = boardW / 5;
            const baseH = boardH / 5;
            const posX = boardX + baseW * x;
            const posY = boardY + baseH * y;
            if (G.animLog.place[x][y][z]) {
              const scale = 1 - Math.max(0, effectTimers.Gchange - 350) / 50;
              const w = baseW * scale;
              const h = baseH * scale;
              const drawX = posX + (baseW - w) / 2;
              const drawY = posY + (baseH - h) / 2;

              ctx.drawImage(assets.token[token - 1], drawX, drawY, w, h);
            } else {
              ctx.drawImage(assets.token[token - 1], posX, posY, baseW, baseH);
            }
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
      // 手札を捨てたかどうか
      const discardFlags = G.animLog.discardFlags[i];
      const isDiscardAnim = discardFlags.some((flag) => flag);

      // //カードごとのfor

      for (let j = 0; j < handSize; j++) {
        const card = G.hand[i][j];
        let img = assets.cardAssets[card.attr][card.index];

        type DeckColorKey =
          | "deckColor0"
          | "deckColor1"
          | "deckColor2"
          | "deckColor3";
        const backColorMap: Record<string, number> = {
          red: 0,
          green: 1,
          yellow: 2,
          blue: 3,
          rainbow: 4,
        };
        const deckIndex = settingsRef.game.selectedDeckP[i];
        const colorKey = `deckColor${deckIndex}` as DeckColorKey;
        const colorName = settingsRef.game[colorKey];
        const colorIndex = backColorMap[colorName] ?? 0;
        if (G.faceDown[i][j]) {
          img = assets.backCard[colorIndex];
        }

        const afterX = getHandCardX(handSize, j, baseX, cardPool, cardW);
        const beforeXadd = getHandCardX(
          handSize - 1,
          j,
          baseX,
          cardPool,
          cardW,
        );
        const beforeXremove = getHandCardXre(
          j,
          baseX,
          cardPool,
          cardW,
          discardFlags,
        );
        // ゲーム開始時のみアニメ
        let moveX = (beforeXadd - afterX) * (1 - progress);
        // ドロー時のアニメ
        if (G.animLog.draw[i]) {
          moveX =
            (beforeXadd - afterX) *
            (Math.max(0, effectTimers.Gchange - 300) / 100);
        }
        // トラッシュ時のアニメ
        if (isDiscardAnim) {
          moveX =
            (beforeXremove - afterX) *
            (Math.max(0, effectTimers.Gchange - 300) / 100);
        }

        let activeY = 0;
        if (bgCtx.currentPlayer == i) {
          if (G.phase === "payCost" && G.activeCard == j) {
            activeY = -cardH * 0.2;
          } else if (G.phase === "payCost" && G.costCards.indexOf(j) >= 0) {
            activeY = -cardH * 0.1;
          }
        }
        let x = dx + afterX + moveX;
        let y = dy + baseY + activeY;

        // 裏返すときのアニメ
        if (
          (G.animLog.flipFlags[i][j] || G.animLog.unflipFlags[i][j]) &&
          effectTimers.Gchange > 200
        ) {
          const t = effectTimers.Gchange; // 400 → 200
          let scaleX = Math.min(1, Math.abs(t - 300) / 100);
          ctx.save();
          ctx.translate(x + cardW / 2, y);
          ctx.scale(scaleX, 1);

          if (G.animLog.flipFlags[i][j] && t > 300) {
            img = assets.cardAssets[card.attr][card.index];
          } else if (G.animLog.unflipFlags[i][j] && t > 300) {
            img = assets.backCard[colorIndex];
          }
          x = -cardW / 2;
          y = 0;
        }
        // カード画像
        ctx.drawImage(img, x, y, cardW, cardH);
        const def = cardDefs[card.attr][card.index];
        const folder = def.costType === "flip" ? "w" : "r";
        const imgN = assets.costNumber[folder][def.cost];
        // コスト数字
        if (!G.faceDown[i][j]) {
          ctx.drawImage(
            imgN,
            x,
            y,
            cardW * 0.3,
            cardW * 0.3 * (imgN.height / imgN.width),
          );
        }

        if (
          (G.animLog.flipFlags[i][j] || G.animLog.unflipFlags[i][j]) &&
          effectTimers.Gchange > 200
        ) {
          ctx.restore();
        }
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
    } else {
      let tuenX = H * 0.06;
      ctx.drawImage(
        assets.token[bgCtx.currentPlayer],
        dx + H * 0.08,
        dy + H * 0,
        tuenX,
        tuenX,
      );
      ctx.drawImage(
        assets.noTurn,
        dx + H * 0.13,
        dy - H * 0.005,
        (tuenX * 26) / 8,
        ((tuenX * 26) / 8) * (assets.noTurn.height / assets.noTurn.width),
      );
    }
    // 山札
    if (layoutIsWide) {
      const rWipeX = dx + W - H * 0.39;

      ctx.drawImage(
        assets.token[1 - Number(playerID)],
        rWipeX,
        dy,
        H * 0.15 * (assets.token[1].width / assets.token[1].height),
        H * 0.15,
      );
      ctx.drawImage(
        assets.token[Number(playerID)],
        rWipeX,
        dy + H * 0.85,
        H * 0.15 * (assets.token[1].width / assets.token[1].height),
        H * 0.15,
      );

      ctx.font = "40px KiwiMaru-Medium";
      ctx.fillStyle = "#ffffff";
      const myDeckNumber = `山札 ${G.deck[Number(playerID)].length}枚`;
      const enemyDeckNumber = `山札 ${G.deck[1 - Number(playerID)].length}枚`;
      ctx.fillText(myDeckNumber, rWipeX + H * 0.25, dy + H * 0.94);
      ctx.fillText(enemyDeckNumber, rWipeX + H * 0.25, dy + H * 0.09);
    }
    // -ポーズ-

    if (layoutIsWide) {
      ctx.drawImage(
        assets.pauseBtn,
        dx + H * 0.01,
        dy + H * 0.01,
        H * 0.1,
        H * 0.1,
      );
    } else {
      ctx.drawImage(
        assets.pauseBtn,
        dx + H * 0.01,
        dy + H * 0.01,
        H * 0.05,
        H * 0.05,
      );
    }
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
function getHandCardXre(
  indexb: number,
  baseX: number,
  cardPool: number,
  cardW: number,
  discardFlags: boolean[],
): number {
  const handSize = discardFlags.length;
  let gap = (cardPool - cardW * 5) / 4;
  let cardX = baseX;

  if (handSize > 5) {
    gap = (cardPool - cardW * handSize) / (handSize - 1);
  } else {
    cardX = baseX + (cardPool - handSize * cardW - (handSize - 1) * gap) / 2;
  }
  let falseCount = 0;
  let index = 0;
  for (let i = 0; i < discardFlags.length; i++) {
    if (!discardFlags[i]) {
      if (falseCount === indexb) {
        index = i;
        break;
      }
      falseCount++;
    }
  }
  return cardX + index * (cardW + gap);
}

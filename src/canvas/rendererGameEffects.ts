import { assets } from "./assets";
import type { GameState } from "../game/MyGame";
import { cardDefs, canPlace } from "../data";
import type { Screen, Settings, HoverUI, CardID } from "../types";

let t = 0;
let winBlinkTimer = 0;
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
    const activeCardID = G.activeCardID;
    if (
      (G.phase === "selectTarget" || G.phase === "selectTarget2") &&
      activeCardID
    ) {
      if (activeCardID.attr === "dis" && activeCardID.index === 2) {
        for (let i = 0; i < 2; i++) {
          let img = assets.neonLine;
          if (!G.firewall.horizontal[i]) {
            ctx.save();
            ctx.filter = "brightness(1.5)";
            ctx.drawImage(
              img,
              boardX + boardW * 0.02,
              boardY + boardH * 0.23 + boardH * 0.19 * i,
              boardW,
              boardW * (assets.neonLine.height / assets.neonLine.width),
            );
            ctx.restore();
          }
        }
        for (let i = 0; i < 2; i++) {
          let img = assets.neonLine;
          if (!G.firewall.vertical[1 - i]) {
            ctx.save();
            ctx.filter = "brightness(1.5)";
            ctx.translate(boardX + boardW / 2, boardY + boardH / 2);
            ctx.rotate(Math.PI / 2);
            const lineY = -boardH / 2 + boardH * 0.23 + boardH * 0.19 * i;
            const lineX = -boardW / 2 + boardW * 0.02;

            ctx.drawImage(
              img,
              lineX,
              lineY,
              boardW,
              boardW * (assets.neonLine.height / assets.neonLine.width),
            );
            ctx.restore();
          }
        }
      }
    }
    // 駒
    winBlinkTimer += dt;
    if (winBlinkTimer >= 1000) {
      winBlinkTimer -= 1000;
    }
    const blinkAlpha =
      (Math.sin((winBlinkTimer / 1000) * Math.PI * 2) + 1) / 4 + 0.5;
    const winPosSet = new Set<string>();
    if (G.winner !== null) {
      for (const line of G.winnerLines) {
        for (const p of line) {
          winPosSet.add(`${p.x},${p.y},${p.z}`);
        }
      }
    }
    const floorOffset = -boardH * 0.05;
    for (let z = 0; z < 3; z++) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          let can = false;
          let skipCanPlace = false;
          const activeCardID = G.activeCardID;

          if (G.phase === "selectTarget" && activeCardID) {
            if (
              (activeCardID.attr === "des" && activeCardID.index === 3) ||
              (activeCardID.attr === "dis" && activeCardID.index === 2)
            ) {
              can = false;
            } else {
              can = canPlace(
                G,
                bgCtx,
                x,
                y,
                z,
                activeCardID.attr,
                activeCardID.index,
              );
            }
          }
          if (G.phase === "selectTarget2" && activeCardID) {
            let dIndex = 0;
            if (activeCardID.attr === "sup" && activeCardID.index === 2) {
              if (G.floor !== z) break;

              const t = G.targets[0];
              const { row, col } = t;
              if (row === null || col === null) break;
              if (row === undefined || col === undefined) break;
              if (col == x && row == y) {
                skipCanPlace = true;
              }
              const f = G.floor;
              if (Number.isInteger(col) && Number.isInteger(row)) {
                if (G.board[col][row][f] == 3) {
                  dIndex = 10;
                }
              } else {
                const mx = col - 1.5;
                const my = row - 1.5;
                if (G.midBoard[mx][my][f] == 3) {
                  dIndex = 10;
                } else {
                  dIndex = 20;
                }
              }
            }
            if (!skipCanPlace) {
              can = canPlace(
                G,
                bgCtx,
                x,
                y,
                z,
                activeCardID.attr,
                activeCardID.index + 10 + dIndex,
              );
            }
          }
          if (can) {
            const baseW = boardW / 5;
            const baseH = boardH / 5;
            const posX = boardX + baseW * x;
            const posY = boardY + baseH * y + floorOffset * z;
            ctx.drawImage(assets.dot, posX, posY, baseW, baseH);
          }
          // リザルト時
          const isWinPos = winPosSet.has(`${x},${y},${z}`);
          if (isWinPos) {
            ctx.globalAlpha = blinkAlpha;
            const token = G.board[x][y][z];
            if (token >= 1) {
              const baseW = boardW / 5;
              const baseH = boardH / 5;
              const posX = boardX + baseW * x;
              const posY = boardY + baseH * y + floorOffset * z;
              ctx.drawImage(assets.token[token - 1], posX, posY, baseW, baseH);
            }
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 3; z++) {
          let can = false;
          const activeCardID = G.activeCardID;

          if (G.phase === "selectTarget" && activeCardID) {
            if (activeCardID.attr === "des" && activeCardID.index === 3) {
              can = false;
            } else {
              can = canPlace(
                G,
                bgCtx,
                x + 1.5,
                y + 1.5,
                z,
                activeCardID.attr,
                activeCardID.index,
              );
            }
          }
          if (G.phase === "selectTarget2") {
          }
          if (can) {
            const baseW = boardW / 5;
            const baseH = boardH / 5;
            const posX = boardX + baseW * (x + 1.5);
            const posY = boardY + baseH * (y + 1.5) + floorOffset * z;
            ctx.drawImage(assets.dot, posX, posY, baseW, baseH);
          }
          const isWinPos = winPosSet.has(`${x + 1.5},${y + 1.5},${z}`);
          if (isWinPos) {
            ctx.globalAlpha = blinkAlpha;
            const token = G.midBoard[x][y][z];
            const baseW = boardW / 5;
            const baseH = boardH / 5;
            const posX = boardX + baseW * (x + 1.5);
            const posY = boardY + baseH * (y + 1.5) + floorOffset * z;
            ctx.drawImage(assets.token[token - 1], posX, posY, baseW, baseH);
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }
    if (G.winner !== null) {
      ctx.globalAlpha = blinkAlpha;
      ctx.strokeStyle = "white";
      ctx.lineWidth = boardW * 0.03;

      for (const line of G.winnerLines) {
        const p0 = line[0];
        const p2 = line[line.length - 1];

        const baseW = boardW / 5;
        const baseH = boardH / 5;

        const x0 = boardX + baseW * p0.x;
        const y0 = boardY + baseH * p0.y + floorOffset * p0.z;

        const x2 = boardX + baseW * p2.x;
        const y2 = boardY + baseH * p2.y + floorOffset * p2.z;

        ctx.beginPath();
        ctx.moveTo(x0 + baseW / 2, y0 + baseH / 2);
        ctx.lineTo(x2 + baseW / 2, y2 + baseH / 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }
    // カード
    // //ホバー
    if (effectTimers.Gchange <= 300) {
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
            (1 - (effectTimers.gameStartCount - 1000) / 3500) *
              G.hand[i].length,
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
                if (G.activeCard !== null) {
                  const card = G.hand[i][G.activeCard];
                  const def = cardDefs[card.attr][card.index];
                  if (def.costType === "flip") {
                    activeY = -cardH * 0.1;
                  } else if (def.costType === "discard") {
                    activeY = +cardH * 0.1;
                  } else if (def.costType === "mix") {
                    const total = def.cost;
                    const flipCount = Math.ceil(total / 2);
                    const discardCount = Math.floor(total / 2);

                    const flipTargets = G.costCards.slice(0, flipCount);
                    const discardTargets = G.costCards.slice(
                      flipCount,
                      flipCount + discardCount,
                    );

                    if (flipTargets.indexOf(j) >= 0) {
                      activeY = -cardH * 0.1;
                    } else if (discardTargets.indexOf(j) >= 0) {
                      activeY = +cardH * 0.1;
                    }
                  }
                }
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

            type FolderKey = "w" | "r" | "rw";
            const folderMap: Record<string, FolderKey> = {
              flip: "w",
              discard: "r",
              mix: "rw",
            };
            const folder = folderMap[def.costType] as FolderKey;
            const imgN =
              assets.costNumber[folder][
                Math.max(0, def.cost + G.costChange[i])
              ];
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
    // スタート
    if (effectTimers.gameStartCount > 600) {
      let alpha = 1;
      if (effectTimers.gameStartCount < 1100) {
        alpha = (effectTimers.gameStartCount - 600) / 500;
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      const teW = W * 0.3;
      const teH = teW * (assets.ready.height / assets.ready.width);
      ctx.drawImage(
        assets.ready,
        dx + W / 2 - teW / 2,
        dy + H / 2 - teH / 2,
        teW,
        teH,
      );

      ctx.restore();
    }
    if (600 > effectTimers.gameStartCount && effectTimers.gameStartCount > 0) {
      let alpha = 1;
      if (effectTimers.gameStartCount < 300) {
        alpha = effectTimers.gameStartCount / 300;
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      const teW = W * 0.3;
      const teH = teW * (assets.start!.height / assets.start!.width);
      ctx.drawImage(
        assets.start!,
        dx + W / 2 - teW / 2,
        dy + H / 2 - teH / 2,
        teW,
        teH,
      );

      ctx.restore();
    }
    if (effectTimers.finish > 0) {
      let alpha = 1;
      if (effectTimers.finish < 500) {
        alpha = effectTimers.finish / 500;
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      const teW = W * 0.7;
      const teH = teW * (assets.gameSet.height / assets.gameSet.width);
      ctx.drawImage(
        assets.gameSet,
        dx + W / 2 - teW / 2,
        dy + H / 2 - teH / 2,
        teW,
        teH,
      );

      ctx.restore();
    }

    // リザルト
    if (effectTimers.finish == 0 && G.winner !== null && G.isResult) {
      let img = assets.resultFrameH;
      if (ratio > 1) {
        img = assets.resultFrameW;
      }
      const wipeRatio = img.height / img.width;

      let cWipeW = W * 1;
      let cWipeH = cWipeW * wipeRatio;
      if (cWipeH > H * 1) {
        cWipeH = H * 1;
        cWipeW = cWipeH / wipeRatio;
      }

      ctx.drawImage(
        img,
        dx + W / 2 - cWipeW / 2,
        dy + H / 2 - cWipeH / 2,
        cWipeW,
        cWipeH,
      );
    }

    if (G.isPaused) {
      // -ポーズ-
      ctx.fillStyle = `rgba(0, 0, 0, 0.65)`;
      ctx.fillRect(0, 0, 1280, 720);
      // pause
      ctx.imageSmoothingEnabled = false;
      const img = assets.pause;
      let drawW, drawH;
      if (layoutIsWide) {
        drawH = H * 0.23;
        drawW = drawH * (img.width / img.height);
      } else {
        drawW = W * 0.8;
        drawH = drawW / (img.width / img.height);
      }
      const offset = Math.sin(t) * (H * 0.01);
      t += 0.05;
      const x = dx + W * 0.5 - drawW / 2;
      const y = dy + H * 0.26 - drawH / 2 + offset;
      ctx.drawImage(img, x, y, drawW, drawH);
      ctx.imageSmoothingEnabled = true;

      // ボタン
      const btnW = H * 0.3;
      const btnH =
        btnW * (assets.pauseContinue.height / assets.pauseContinue.width);
      const btnX = dx + W * 0.5 - btnW / 2;
      ctx.drawImage(assets.pauseContinue, btnX, dy + H * 0.4, btnW, btnH);
      ctx.drawImage(assets.pauseRestart, btnX, dy + H * 0.5, btnW, btnH);
      ctx.drawImage(assets.pauseEnd, btnX, dy + H * 0.6, btnW, btnH);
      if (hoverStates.pauseContinue) {
        ctx.drawImage(assets.pauseLight, btnX, dy + H * 0.4, btnW, btnH);
      }
      if (hoverStates.pauseRestart) {
        ctx.drawImage(assets.pauseLight, btnX, dy + H * 0.5, btnW, btnH);
      }
      if (hoverStates.pauseEnd) {
        ctx.drawImage(assets.pauseLight, btnX, dy + H * 0.6, btnW, btnH);
      }
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

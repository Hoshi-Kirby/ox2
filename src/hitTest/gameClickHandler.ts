import {
  isInsideTurnEndButton,
  isInsideHandCard,
  isInsidePauseButton,
  isInsidePauseContinueButton,
  isInsidePauseRestartButton,
  isInsidePauseEndButton,
  isInsideBoardCell,
  isInsideMidBoardCell,
  isInsideFireWall,
} from "./gameHitTest";
import type { Screen, CardID } from "../types";
import { playSe } from "../audio/audioManager";
import { assets } from "../canvas/assets";
type MoveFn = (...args: any[]) => void;

type Moves = Record<string, MoveFn>;

type ClickHandlerParams = {
  ratio: number;
  screen: Screen;
  setScreen: (s: Screen) => void;
  effectTimers: Record<string, number>;
  settings: any;
  G: any;
  ctx: any;
  moves: Moves;
  playerID: string;
};

export function createGameClickHandler({
  ratio,
  screen,
  setScreen,
  effectTimers,
  settings,
  G,
  ctx,
  moves,
  playerID,
}: ClickHandlerParams) {
  return function onClick(e: MouseEvent, canvas: HTMLCanvasElement) {
    if (settings.ui.inputLocked) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    // ポーズの影響を受ける------------------------------------------
    if (!G.isPaused) {
      if (effectTimers.Gchange <= 200 && effectTimers.turnStart == 0) {
        if (effectTimers.gameStartCount == 0) {
          if (effectTimers.Gchange == 0) {
            // ターンエンド
            if (G.phase === "idle") {
              if (isInsideTurnEndButton(x, y, ratio)) {
                moves.endTurn(ctx);
                effectTimers.turnStart = 400;
                effectTimers.Gchange = 400;
                setTimeout(() => {
                  moves.resetAnimLog();
                }, 300);
              }
            }
            // 駒
            let target: {
              row: number | null;
              col: number | null;
              indexH: number | null;
              indexV: number | null;
            } = { row: null, col: null, indexH: null, indexV: null };
            for (let i = 0; i < 2; i++) {
              for (let j = 0; j < 2; j++) {
                if (isInsideMidBoardCell(x, y, ratio, i, j, G.floor)) {
                  target = {
                    row: j + 1.5,
                    col: i + 1.5,
                    indexH: null,
                    indexV: null,
                  };
                  break;
                }
              }
              if (target.row !== null || target.col !== null) break;
            }
            if (target.row === null || target.col === null) {
              for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                  let f = G.floor;
                  const activeCardID = G.activeCardID;
                  if (
                    activeCardID &&
                    activeCardID.attr === "gen" &&
                    activeCardID.index === 6
                  ) {
                    f = 0;
                  }
                  if (isInsideBoardCell(x, y, ratio, i, j, f)) {
                    target = { row: j, col: i, indexH: null, indexV: null };
                    break;
                  }
                }
                if (target.row !== null || target.col !== null) break;
              }
            }
            // 罫線
            for (let j = 0; j < 2; j++) {
              if (isInsideFireWall(x, y, ratio, 0, j)) {
                target.indexH = j;
                break;
              }
            }
            for (let j = 0; j < 2; j++) {
              if (isInsideFireWall(x, y, ratio, 1, j)) {
                target.indexV = j;
                break;
              }
            }
            if (target) {
              moves.registerTarget({
                row: target.row,
                col: target.col,
                index: null,
                indexH: target.indexH,
                indexV: target.indexV,
              });
              effectTimers.Gchange = 400;
              setTimeout(() => {
                moves.resetAnimLog();
              }, 300);
            }
          }
          // カード
          const result: [number, number] = [-1, -1];

          for (let i = 0; i < 2; i++) {
            const handLength = G.hand[i].length;

            for (let j = handLength - 1; j >= 0; j--) {
              const inside = isInsideHandCard(
                x,
                y,
                ratio,
                i,
                j,
                handLength,
                playerID,
              );

              if (inside) {
                result[i] = j;
                break;
              }
            }
          }

          if (result[ctx.currentPlayer] >= 0) {
            moves.useCard(result[ctx.currentPlayer]);
            effectTimers.Gchange = 400;
            setTimeout(() => {
              moves.resetAnimLog();
            }, 300);
          }
          if (result[1 - ctx.currentPlayer] >= 0) {
            moves.registerTarget({
              row: null,
              col: null,
              index: result[1 - ctx.currentPlayer],
              indexH: null,
              indexV: null,
            });
            effectTimers.Gchange = 400;
            setTimeout(() => {
              moves.resetAnimLog();
            }, 300);
          }
        }
      }
      // ポーズ
      if (isInsidePauseButton(x, y, ratio)) {
        moves.openPause();
      }
    } else {
      // ポーズ中
      if (isInsidePauseContinueButton(x, y, ratio)) {
        moves.closePause();
      }
      if (isInsidePauseRestartButton(x, y, ratio)) {
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;
        settings.ui.inputLocked = true;

        setTimeout(() => {
          moves.reset();
          effectTimers.fadeOut = 300;
          effectTimers.gameStartAnim = 300;
          effectTimers.gameStartCount = 4500;
          settings.ui.inputLocked = false;
        }, 300);
      }
      if (isInsidePauseEndButton(x, y, ratio)) {
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;
        settings.ui.inputLocked = true;

        setTimeout(() => {
          setScreen("menuOffline");
          effectTimers.fadeOut = 300;
          effectTimers.gameStartAnim = 300;
          effectTimers.gameStartCount = 4500;
          setTimeout(() => {
            settings.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
    }
    // ポーズの影響を受けない------------------------------------------
  };
}

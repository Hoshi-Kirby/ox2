import {
  isInsideTurnEndButton,
  isInsideHandCard,
  isInsidePauseButton,
  isInsidePauseContinueButton,
  isInsidePauseRestartButton,
  isInsidePauseEndButton,
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
  reset: () => void;
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
  reset,
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
      if (effectTimers.gameStartCount == 0) {
        // ターンエンド
        if (isInsideTurnEndButton(x, y, ratio)) {
          moves.endTurn(ctx);
          effectTimers.turnStart = 400;
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

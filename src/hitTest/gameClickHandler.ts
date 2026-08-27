import { isInsideTurnEndButton, isInsideHandCard } from "./gameHitTest";
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

    // ターンエンド
    if (isInsideTurnEndButton(x, y, ratio)) {
      moves.endTurn(ctx);
      effectTimers.turnStart = 400;
    }

    // カード
    // カード
    if (effectTimers.gameStartCount == 0) {
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
  };
}

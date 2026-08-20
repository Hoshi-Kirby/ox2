import { isInsideTurnEndButton } from "./gameHitTest";
import type { Screen, CardID } from "../GameCanvas";
import { playSe } from "../audio/audioManager";
import { assets } from "../canvas/assets";
type MoveFn = (...args: any[]) => void;

type Moves = Record<string, MoveFn>;

type ClickHandlerParams = {
  ratio: number;
  screen: Screen;
  setScreen: (s: Screen) => void;
  effectTimers: Record<string, number>;
  settingsRef: any;
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
  settingsRef,
  G,
  ctx,
  moves,
  playerID,
}: ClickHandlerParams) {
  return function onClick(e: MouseEvent, canvas: HTMLCanvasElement) {
    if (settingsRef.current.ui.inputLocked) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isInsideTurnEndButton(x, y, ratio)) {
      moves.endTurn(ctx);
      effectTimers.turnStart = 400;
    }
  };
}

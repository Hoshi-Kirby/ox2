import { isInsideTurnEndButton } from "./gameHitTest";
import type { Screen, HoverUI, PressTimers } from "../GameCanvas";

type HoverParams = {
  ratio: number;
  screen: Screen;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverStatesRef: React.MutableRefObject<HoverUI>;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  settingsRef: any;
  pressTimers: PressTimers;
};

export function createGameHoverHandler({
  ratio,
  screen,
  mouseRef,
  hoverStatesRef,
  setHoverStates,
  settingsRef,
  pressTimers,
}: HoverParams) {
  let running = true;
  let lastTime = performance.now();

  function loop(now: number) {
    if (!running) return;

    const dt = now - lastTime;
    lastTime = now;

    const { x, y } = mouseRef.current;

    if (screen === "game") {
      // ターンエンド
      if (ratio > 1.2) {
        const insideTurnEnd = isInsideTurnEndButton(x, y, ratio);

        if (hoverStatesRef.current.turnEnd !== insideTurnEnd) {
          setHoverStates((prev) => ({ ...prev, turnEnd: insideTurnEnd }));
        }
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  return () => {
    running = false;
  };
}

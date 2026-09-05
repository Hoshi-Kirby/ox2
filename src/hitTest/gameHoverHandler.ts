import {
  isInsideTurnEndButton,
  isInsideHandCard,
  isInsidePauseContinueButton,
  isInsidePauseRestartButton,
  isInsidePauseEndButton,
  isInsideOneMoreButton,
  isInsideEndButton,
} from "./gameHitTest";
import type { Screen, HoverUI, PressTimers } from "../types";

type HoverParams = {
  ratio: number;
  screen: Screen;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverStatesRef: React.MutableRefObject<HoverUI>;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  settings: any;
  isTouching: React.MutableRefObject<boolean>;
  pressTimers: PressTimers;
  effectTimers: Record<string, number>;
  G: any;
  ctx: any;
  playerID: string;
};

export function createGameHoverHandler({
  ratio,
  screen,
  mouseRef,
  hoverStatesRef,
  setHoverStates,
  settings,
  isTouching,
  pressTimers,
  effectTimers,
  G,
  ctx,
  playerID,
}: HoverParams) {
  let running = true;
  let lastTime = performance.now();
  let pressHandTarget = [-1, -1];

  function loop(now: number) {
    if (!running) return;

    const dt = now - lastTime;
    lastTime = now;

    const { x, y } = mouseRef.current;

    if (!G.isPaused) {
      if (!(effectTimers.finish == 0 && G.winner !== null && G.isResult)) {
        // ポーズの影響を受ける------------------------------------------
        // ターンエンド
        const insideTurnEnd = isInsideTurnEndButton(x, y, ratio);

        if (hoverStatesRef.current.turnEnd !== insideTurnEnd) {
          setHoverStates((prev) => ({ ...prev, turnEnd: insideTurnEnd }));
        }

        // 手札ホバー
        const [h0, h1] = getHoverHandIndex(
          x,
          y,
          ratio,
          G,
          playerID,
          effectTimers,
        );

        const targets: [number, number] = [h0, h1];
        if (settings.ui.deviceMode === "mouse") {
          // マウス → 即時 hover

          if (
            hoverStatesRef.current.hoverHands[0] !== h0 ||
            hoverStatesRef.current.hoverHands[1] !== h1
          ) {
            hoverStatesRef.current.hoverHands = [h0, h1];

            setHoverStates((prev) => ({
              ...prev,
              hoverHands: [h0, h1],
            }));
          }
        } else {
          // タッチ → 長押し

          const nextHover: [number, number] = [
            hoverStatesRef.current.hoverHands[0],
            hoverStatesRef.current.hoverHands[1],
          ];
          if (!isTouching.current) {
            pressTimers.hands[0] = 0;
            pressTimers.hands[1] = 0;
            pressHandTarget = [-1, -1];

            nextHover[0] = -1;
            nextHover[1] = -1;

            if (
              nextHover[0] !== hoverStatesRef.current.hoverHands[0] ||
              nextHover[1] !== hoverStatesRef.current.hoverHands[1]
            ) {
              hoverStatesRef.current.hoverHands = nextHover;
              setHoverStates((prev) => ({ ...prev, hoverHands: nextHover }));
            }
            return requestAnimationFrame(loop);
          }

          for (let i = 0; i < 2; i++) {
            const target = targets[i];

            if (pressHandTarget[i] !== target) {
              pressHandTarget[i] = target;

              pressTimers.hands[i] = 0;

              if (target === -1) {
                nextHover[i] = -1;
              }
            }

            if (target !== -1) {
              pressTimers.hands[i] += dt;

              if (pressTimers.hands[i] > 300 && nextHover[i] !== target) {
                nextHover[i] = target;
              }
            }
          }

          if (
            nextHover[0] !== hoverStatesRef.current.hoverHands[0] ||
            nextHover[1] !== hoverStatesRef.current.hoverHands[1]
          ) {
            hoverStatesRef.current.hoverHands = nextHover;

            setHoverStates((prev) => ({
              ...prev,
              hoverHands: nextHover,
            }));
          }
        }
      } else {
        // リザルトのボタン
        const insideOne = isInsideOneMoreButton(x, y, ratio);

        if (hoverStatesRef.current.resultOneMore !== insideOne) {
          setHoverStates((prev) => ({ ...prev, resultOneMore: insideOne }));
        }
        const insideEnd = isInsideEndButton(x, y, ratio);

        if (hoverStatesRef.current.resultEnd !== insideEnd) {
          setHoverStates((prev) => ({ ...prev, resultEnd: insideEnd }));
        }
      }
    } else {
      // ポーズ中----------------------------------------------------
      const insideContinue = isInsidePauseContinueButton(x, y, ratio);
      if (hoverStatesRef.current.pauseContinue !== insideContinue) {
        setHoverStates((prev) => ({ ...prev, pauseContinue: insideContinue }));
      }
      const insideRestart = isInsidePauseRestartButton(x, y, ratio);
      if (hoverStatesRef.current.pauseRestart !== insideRestart) {
        setHoverStates((prev) => ({ ...prev, pauseRestart: insideRestart }));
      }
      const insideEnd = isInsidePauseEndButton(x, y, ratio);
      if (hoverStatesRef.current.pauseEnd !== insideEnd) {
        setHoverStates((prev) => ({ ...prev, pauseEnd: insideEnd }));
      }
    }
    // ポーズの影響を受けない------------------------------------------

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  return () => {
    running = false;
  };
}
// 手札ホバー判定（index を返す）
export function getHoverHandIndex(
  x: number,
  y: number,
  ratio: number,
  G: any,
  playerID: string,
  effectTimers: any,
): [number, number] {
  const result: [number, number] = [-1, -1];

  for (let i = 0; i < 2; i++) {
    const handLength = G.hand[i].length;

    const handSize = Math.min(
      handLength,
      Math.floor(
        (1 - (effectTimers.gameStartCount - 1000) / 3500) * handLength,
      ),
    );

    for (let j = handSize - 1; j >= 0; j--) {
      if (!G.faceDown[i][j]) {
        const inside = isInsideHandCard(x, y, ratio, i, j, handSize, playerID);
        if (inside) {
          result[i] = j;
          break;
        }
      }
    }
  }

  return result;
}

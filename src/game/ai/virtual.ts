import type { GameState } from "../MyGame";
import * as basic from "../moves/basic";
import { getSelectTargetAction, getSelectTarget2Action } from "./cpu";
import { evaluateState } from "./evaluate";

export type VirtualState = {
  G: GameState;
  ctx: any;
};

export function createVirtualState(G: GameState, ctx: any): VirtualState {
  return {
    G: structuredClone(G),
    ctx: {
      ...ctx,
      random: ctx.random,
    },
  };
}

export function virtualUseCard(state: VirtualState, cardIndex: number): void {
  basic.useCard(
    {
      G: state.G,
      ctx: state.ctx,
    },
    cardIndex,
  );
}

export function virtualRegisterTarget(
  state: VirtualState,
  target: {
    row: number | null;
    col: number | null;
    index: number | null;
    indexH: number | null;
    indexV: number | null;
  },
): void {
  basic.registerTarget(
    {
      G: state.G,
      ctx: state.ctx,
    },
    target,
  );
}

export function virtualStep(state: VirtualState): void {
  if (state.G.phase === "payCostFlip" || state.G.phase === "payCostDiscard") {
    const player = Number(state.ctx.currentPlayer);

    const cardIndex = state.G.hand[player].findIndex(
      (_, index) =>
        index !== state.G.activeCard &&
        !state.G.faceDown[player][index] &&
        !state.G.costCards.includes(index),
    );

    if (cardIndex >= 0) {
      virtualUseCard(state, cardIndex);
    }

    return;
  }

  if (state.G.phase === "selectTarget") {
    const actions = getSelectTargetAction(state.G, state.ctx);

    if (actions.length === 0) {
      return;
    }

    let bestState: VirtualState | null = null;
    let bestScore = -Infinity;

    for (const action of actions) {
      const nextState = createVirtualState(state.G, state.ctx);

      virtualRegisterTarget(nextState, action.args[0]);

      const score = evaluateState(nextState.G, nextState.ctx, "1");

      console.log("仮想ターゲット:", action.args[0], `評価=${score}`);

      if (score > bestScore) {
        bestScore = score;
        bestState = nextState;
      }
    }

    if (bestState !== null) {
      state.G = bestState.G;
      state.ctx = bestState.ctx;
    }

    return;
  }

  if (state.G.phase === "selectTarget2") {
    const actions = getSelectTarget2Action(state.G, state.ctx);

    if (actions.length === 0) {
      return;
    }

    let bestState: VirtualState | null = null;
    let bestScore = -Infinity;

    for (const action of actions) {
      const nextState = createVirtualState(state.G, state.ctx);

      virtualRegisterTarget(nextState, action.args[0]);

      const score = evaluateState(nextState.G, nextState.ctx, "1");

      console.log("仮想ターゲット2:", action.args[0], `評価=${score}`);

      if (score > bestScore) {
        bestScore = score;
        bestState = nextState;
      }
    }

    if (bestState !== null) {
      state.G = bestState.G;
      state.ctx = bestState.ctx;
    }

    return;
  }
}

export function virtualRunAction(state: VirtualState, cardIndex: number): void {
  // idleからカードを使う
  virtualUseCard(state, cardIndex);

  let safety = 0;

  while (state.G.phase !== "idle") {
    virtualStep(state);

    safety++;

    // 無限ループ防止
    if (safety >= 20) {
      console.warn(
        "virtualRunAction: 20ステップ以内にidleへ戻りませんでした",
        state.G.phase,
      );
      break;
    }
  }
}

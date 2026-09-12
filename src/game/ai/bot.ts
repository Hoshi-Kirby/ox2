import { Bot } from "boardgame.io/ai";
import {
  createVirtualState,
  virtualRunAction,
  virtualRegisterTarget,
} from "./virtual";
import { getCPUActions } from "./cpu";
import { evaluateState } from "./evaluate";

export class MyBot extends Bot {
  play({ G, ctx }: { G: any; ctx: any }, playerID: string) {
    console.log("CPU PLAY", {
      phase: G.phase,
      currentPlayer: ctx.currentPlayer,
      cpuMove: G.cpuMove,
    });

    const actions = getCPUActions(G, ctx);

    console.log("CPU ACTIONS", actions);

    if (actions.length === 0) {
      return new Promise<{
        action: any;
        metadata?: any;
      }>(() => {});
    }

    const baseState = createVirtualState(G, ctx);
    const baseScore = evaluateState(baseState.G, baseState.ctx, playerID);

    // 何もしない = endTurn を暫定の最善手にする
    let bestAction: any = {
      move: "endTurn",
      args: [],
    };
    let bestScore = baseScore;
    for (const cpuAction of actions) {
      if (cpuAction.move === "endTurn") {
        continue;
      }

      if (cpuAction.move === "useCard") {
        const cardIndex = cpuAction.args[0];
        const state = createVirtualState(G, ctx);
        const success = virtualRunAction(state, cardIndex);
        if (!success) {
          continue;
        }
        const score = evaluateState(state.G, state.ctx, playerID);
        if (score > bestScore) {
          bestScore = score;
          bestAction = cpuAction;
        }
      }

      if (cpuAction.move === "registerTarget") {
        const target = cpuAction.args[0];
        const state = createVirtualState(G, ctx);
        virtualRegisterTarget(state, target);

        const score = evaluateState(state.G, state.ctx, playerID);

        if (score > bestScore) {
          bestScore = score;
          bestAction = cpuAction;
        }
      }
    }

    if (bestAction !== null) {
      const action = this.enumerate(G, ctx, playerID).find(
        (action: any) =>
          action.type === "MAKE_MOVE" &&
          action.payload.type === bestAction.move &&
          JSON.stringify(action.payload.args) ===
            JSON.stringify(bestAction.args),
      );

      if (action) {
        return Promise.resolve({
          action,
        });
      }
    }

    return Promise.resolve({
      action: this.random(this.enumerate(G, ctx, playerID)),
    });
  }
}

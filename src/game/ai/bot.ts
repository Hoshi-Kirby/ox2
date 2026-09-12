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
    const actions = getCPUActions(G, ctx);

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

    console.log("仮想:", `TurnEnd`, `評価=${baseScore}`);
    let bestScore = baseScore;
    for (const cpuAction of actions) {
      if (cpuAction.move === "endTurn") {
        continue;
      }

      if (cpuAction.move === "useCard") {
        const cardIndex = cpuAction.args[0];
        const state = createVirtualState(G, ctx);
        virtualRunAction(state, cardIndex);
        const score = evaluateState(state.G, state.ctx, playerID);
        console.log(
          "仮想:",
          `card=${cardIndex}`,
          `評価=${score}`,
          state.G.phase,
        );
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

        console.log("仮想:", "target=", target, `評価=${score}`, state.G.phase);

        if (score > bestScore) {
          bestScore = score;
          bestAction = cpuAction;
        }
      }
    }

    console.log("実:", G.phase);

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

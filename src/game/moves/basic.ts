import type { GameState } from "../MyGame";
import { cardDefs, canPlace } from "../../data";
import * as gen from "./gen";
import * as dis from "./dis";
import * as sup from "./sup";
import * as des from "./des";
import type { CardAttr, CardKey } from "../../types";

type CardFunction = (G: GameState, ctx: any) => void;
type CardModule = Record<CardKey, CardFunction>;
// ターンエンド
export function endTurn({
  events,
  G,
  ctx,
}: {
  events: any;
  G: any;
  ctx: any;
}): void {
  const player = ctx.currentPlayer;
  G.animLog.unflipFlags[player] = Array(G.faceDown[player].length).fill(false);
  for (let i = 0; i < G.faceDown[player].length; i++) {
    if (G.faceDown[player][i]) {
      G.animLog.unflipFlags[player][i] = true;
    }
  }

  G.faceDown[player].fill(false);
  G.animLog.costChange[player] = -G.costChange[player];
  G.costChange[player] = 0;
  G.cpuMove = true;
  decreaseTurnEffects({ G });

  events.endTurn();
}
// カードを使うときの共通 move
export function useCard(
  { G, ctx }: { G: GameState; ctx: any },
  cardIndex: number,
) {
  // idle → カードを選択して次のフェーズへ
  if (G.phase === "idle") {
    const player = ctx.currentPlayer;
    if (!G.faceDown[player][cardIndex]) {
      const faceUpCount = G.faceDown[player].filter((v) => v === false).length;
      const card = G.hand[player][cardIndex];
      const def = cardDefs[card.attr][card.index];

      if (
        faceUpCount >=
        def.costFlip + def.costDiscard + 1 + G.costChange[player]
      ) {
        console.log("カード使用判定", {
          player,
          cardIndex,
          faceUpCount,
          costFlip: def.costFlip,
          costDiscard: def.costDiscard,
          costChange: G.costChange[player],
          required: def.costFlip + def.costDiscard + 1 + G.costChange[player],
          faceDown: [...G.faceDown[player]],
        });
        G.activeCard = cardIndex; // 今使うカードをセット
        G.cpuMove = true;
        if (def.costFlip + G.costChange[player] > 0) {
          G.phase = "payCostFlip";
        } else if (
          def.costDiscard + Math.min(0, def.costFlip + G.costChange[player]) >
          0
        ) {
          G.phase = "payCostDiscard";
        } else {
          // コスト0
          G.activeCardID = { ...G.hand[player][G.activeCard!] };
          G.animLog.discardFlags[player] = Array(G.hand[player].length).fill(
            false,
          );
          G.animLog.discardHand[player] = [...G.hand[player]];
          G.animLog.discardFlags[player][G.activeCard!] = true;
          G.hand[player].splice(G.activeCard!, 1);
          G.faceDown[player].splice(G.activeCard!, 1);
          G.deck[player].push(G.activeCardID);
          G.animLog.flipFlags[player].splice(G.activeCard!, 1);
          G.animLog.unflipFlags[player].splice(G.activeCard!, 1);
          if (
            !canPlaceAnywhere(G, ctx, G.activeCardID.attr, G.activeCardID.index)
          ) {
            G.phase = "idle";
            G.targets = [];
            return;
          }
          if (def.auto) {
            callCardFunction({ G, ctx });
            G.phase = "idle";
            G.targets = [];
            return;
          }
          G.phase = "selectTarget";
        }
        return;
      }
    }
  }
  // payCost → コスト選択
  if (G.phase === "payCostFlip") {
    if (
      cardIndex !== G.activeCard &&
      !G.faceDown[ctx.currentPlayer][cardIndex]
    ) {
      // すでに選択済みなら削除
      G.cpuMove = true;
      const idx = G.costCards.indexOf(cardIndex);
      if (idx >= 0) {
        G.costCards.splice(idx, 1);
      } else {
        G.costCards.push(cardIndex);
      }
      const player = ctx.currentPlayer;
      const card = G.hand[player][G.activeCard!];
      const def = cardDefs[card.attr][card.index];
      if (
        G.costCards.length >= Math.max(0, def.costFlip + G.costChange[player])
      ) {
        // アクティブカード、アニメログ
        G.activeCardID = { ...G.hand[player][G.activeCard!] };
        G.animLog.discardFlags[player] = Array(G.hand[player].length).fill(
          false,
        );
        G.animLog.discardHand[player] = [...G.hand[player]];

        for (const idx of G.costCards) {
          G.animLog.flipFlags[player][idx] = true;
        }

        for (const idx of G.costCards) {
          G.faceDown[player][idx] = true;
        }

        G.costCards = [];

        if (
          def.costDiscard + Math.min(0, def.costFlip + G.costChange[player]) >
          0
        ) {
          G.phase = "payCostDiscard";
        } else {
          G.phase = "selectTarget";
          G.animLog.discardFlags[player][G.activeCard!] = true;
          G.hand[player].splice(G.activeCard!, 1);
          G.faceDown[player].splice(G.activeCard!, 1);
          G.deck[player].push(G.activeCardID);
          G.animLog.flipFlags[player].splice(G.activeCard!, 1);
          G.animLog.unflipFlags[player].splice(G.activeCard!, 1);
          if (
            !canPlaceAnywhere(G, ctx, G.activeCardID.attr, G.activeCardID.index)
          ) {
            G.phase = "idle";
            G.targets = [];
            return;
          }
          if (def.auto) {
            callCardFunction({ G, ctx });
            G.phase = "idle";
            G.targets = [];
            return;
          }
        }
      }
    }
    return;
  }
  if (G.phase === "payCostDiscard") {
    if (
      cardIndex !== G.activeCard &&
      !G.faceDown[ctx.currentPlayer][cardIndex]
    ) {
      // すでに選択済みなら削除
      G.cpuMove = true;
      const idx = G.costCards.indexOf(cardIndex);
      if (idx >= 0) {
        G.costCards.splice(idx, 1);
      } else {
        G.costCards.push(cardIndex);
      }
      const player = ctx.currentPlayer;
      const card = G.hand[player][G.activeCard!];
      const def = cardDefs[card.attr][card.index];
      if (
        G.costCards.length >=
        Math.max(
          def.costDiscard + Math.min(0, def.costFlip + G.costChange[player]),
          0,
        )
      ) {
        // アクティブカード、アニメログ
        G.activeCardID = { ...G.hand[player][G.activeCard!] };
        G.animLog.discardFlags[player] = Array(G.hand[player].length).fill(
          false,
        );
        G.animLog.discardHand[player] = [...G.hand[player]];

        for (const idx of G.costCards) {
          G.animLog.discardFlags[player][idx] = true;
        }
        G.animLog.discardFlags[player][G.activeCard!] = true;

        const discardCards = G.costCards.map((idx) => G.hand[player][idx]);
        for (const card of discardCards) {
          G.deck[player].push(card);
        }
        let active = G.activeCard!;

        const sorted = [...G.costCards].sort((a, b) => b - a);
        for (const idx of sorted) {
          if (idx < active) {
            active--;
          }
          G.hand[player].splice(idx, 1);
          G.faceDown[player].splice(idx, 1);
          G.animLog.flipFlags[player].splice(idx, 1);
          G.animLog.unflipFlags[player].splice(idx, 1);
        }
        G.activeCard = active;

        G.hand[player].splice(G.activeCard!, 1);
        G.faceDown[player].splice(G.activeCard!, 1);
        G.deck[player].push(G.activeCardID);
        G.animLog.flipFlags[player].splice(G.activeCard!, 1);
        G.animLog.unflipFlags[player].splice(G.activeCard!, 1);
        G.costCards = [];
        if (
          !canPlaceAnywhere(G, ctx, G.activeCardID.attr, G.activeCardID.index)
        ) {
          G.phase = "idle";
          G.targets = [];
          return;
        }
        if (def.auto) {
          callCardFunction({ G, ctx });
          G.phase = "idle";
          G.targets = [];
          return;
        }
        G.phase = "selectTarget";
      }
    }
    return;
  }

  return;
}
// 盤面又はカード
export function registerTarget(
  { G, ctx }: { G: GameState; ctx: any },
  target: {
    row: number | null;
    col: number | null;
    index: number | null;
    indexH: number | null;
    indexV: number | null;
  },
) {
  if (G.phase == "selectTarget") {
    G.targets[0] = target;
    callCardFunction({ G, ctx });
    return;
  }

  if (G.phase == "selectTarget2") {
    G.targets[1] = target;
    callCardFunction({ G, ctx });
    return;
  }
}
// それぞれの関数呼び出し
export function callCardFunction({ G, ctx }: { G: GameState; ctx: any }) {
  const card = G.activeCardID;
  if (!card) return;
  const { attr, index } = card;
  const table: Record<CardAttr, CardModule> = {
    gen,
    dis,
    sup,
    des,
  };

  const fn = table[attr][`card${index}`];
  if (fn) fn(G, ctx);
  G.cpuMove = true;
}
export function canPlaceAnywhere(
  G: GameState,
  ctx: any,
  attr: CardAttr,
  index: number,
) {
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        if (canPlace(G, ctx, x, y, z, attr, index)) {
          return true;
        }
      }
    }
  }
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 3; z++) {
        if (canPlace(G, ctx, x + 1.5, y + 1.5, z, attr, index)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function openPause({ G }: { G: GameState }) {
  G.isPaused = true;
}
export function closePause({ G }: { G: GameState }) {
  G.isPaused = false;
}
export function openresult({ G }: { G: GameState }) {
  G.isResult = !G.isResult;
}
// cpu動けるよ
export function cpuCanMove({ G }: { G: GameState }) {
  G.cpuMove = false;
  G.cpuGameStart = false;
  G.animLog.draw = [false, false];
  G.animLog.drawCount = [1, 1];
  G.animLog.discardFlags = [[], []];
  G.animLog.flipFlags = [[], []];
  G.animLog.unflipFlags = [[], []];
  G.animLog.costChange = [0, 0];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      for (let h = 0; h < 3; h++) {
        G.animLog.place[r][c][h] = false;
        G.animLog.remove[r][c][h] = 0;
      }
    }
  }
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      for (let h = 0; h < 3; h++) {
        G.animLog.placeMid[r][c][h] = false;
        G.animLog.removeMid[r][c][h] = 0;
      }
    }
  }
}
// アニメログの初期化
export function resetAnimLog({ G }: { G: GameState }) {
  G.animLog.draw = [false, false];
  G.animLog.drawCount = [1, 1];
  G.animLog.discardFlags = [[], []];
  G.animLog.flipFlags = [[], []];
  G.animLog.unflipFlags = [[], []];
  G.animLog.costChange = [0, 0];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      for (let h = 0; h < 3; h++) {
        G.animLog.place[r][c][h] = false;
        G.animLog.remove[r][c][h] = 0;
      }
    }
  }
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      for (let h = 0; h < 3; h++) {
        G.animLog.placeMid[r][c][h] = false;
        G.animLog.removeMid[r][c][h] = 0;
      }
    }
  }
}
// ターン数減らす
export function decreaseTurnEffects({ G }: { G: GameState }) {
  // NOTFOUND（5×5×3）
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        if (G.notFoundTurns[x][y][z] > 0) {
          G.notFoundTurns[x][y][z]--;
          if (G.notFoundTurns[x][y][z] == 0) {
            G.board[x][y][z] = 0;
            G.animLog.remove[x][y][z] = 6;
          }
        }
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (G.firewallTurns[i][j] > 0) {
        G.firewallTurns[i][j]--;
        if (G.firewallTurns[i][j] == 0) {
          if (i == 0) {
            G.firewall.horizontal[j] = false;
          } else {
            G.firewall.vertical[j] = false;
          }
        }
      }
    }
  }
}

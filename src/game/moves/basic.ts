import type { GameState } from "../MyGame";
import { cardDefs, canPlace } from "../../data";
import * as gen from "./gen";
import * as dis from "./dis";
import * as sup from "./sup";
import * as des from "./des";
import type { CardAttr, CardKey, CheckKey } from "../../types";

type CardFunction = (G: GameState, ctx: any) => void;
type CardModule = Record<CardKey, CardFunction>;
type CheckModule = Record<CheckKey, CardFunction>;

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

      if (faceUpCount >= def.cost + 1) {
        G.activeCard = cardIndex; // 今使うカードをセット
        G.phase = "payCost"; // 次のフェーズへ}
        return;
      }
    }
  }
  // payCost → コスト選択
  if (G.phase === "payCost") {
    if (
      cardIndex !== G.activeCard &&
      !G.faceDown[ctx.currentPlayer][cardIndex]
    ) {
      // すでに選択済みなら削除
      const idx = G.costCards.indexOf(cardIndex);
      if (idx >= 0) {
        G.costCards.splice(idx, 1);
      } else {
        G.costCards.push(cardIndex);
      }
      const player = ctx.currentPlayer;
      const card = G.hand[player][G.activeCard!];
      const def = cardDefs[card.attr][card.index];
      if (G.costCards.length >= def.cost) {
        // アクティブカード、アニメログ
        G.activeCardID = { ...G.hand[player][G.activeCard!] };
        G.animLog.discardFlags[player] = Array(G.hand[player].length).fill(
          false,
        );
        if (def.costType === "discard") {
          for (const idx of G.costCards) {
            G.animLog.discardFlags[player][idx] = true;
          }
          G.animLog.discardFlags[player][G.activeCard!] = true;
        } else if (def.costType === "flip") {
          for (const idx of G.costCards) {
            G.animLog.flipFlags[player][idx] = true;
          }
          G.animLog.discardFlags[player][G.activeCard!] = true;
        }

        if (def.costType === "flip") {
          // 裏返す：対象カードの faceDown を true にする
          for (const idx of G.costCards) {
            G.faceDown[player][idx] = true;
          }
        } else if (def.costType === "discard") {
          const player = ctx.currentPlayer;
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
        }
        G.hand[player].splice(G.activeCard!, 1);
        G.faceDown[player].splice(G.activeCard!, 1);
        G.deck[player].push(G.activeCardID);
        G.animLog.flipFlags[player].splice(G.activeCard!, 1);
        G.animLog.unflipFlags[player].splice(G.activeCard!, 1);
        G.costCards = [];
        G.phase = "selectTarget";
        if (
          !canPlaceAnywhere(G, ctx, G.activeCardID.attr, G.activeCardID.index)
        ) {
          G.phase = "idle";
          G.targets = [];
        }
      }
    }
    return;
  }
  return;
}
// 盤面又はカード
export function registerTarget(
  { G, ctx }: { G: GameState; ctx: any },
  target: { row: number | null; col: number | null; index: number | null },
) {
  if (G.phase == "selectTarget") {
    G.targets[0] = target;
    callCardFunction(G, ctx);
    return;
  }

  if (G.phase == "selectTarget2") {
    G.targets[1] = target;
    callCardFunction(G, ctx);
    return;
  }
}
// それぞれの関数呼び出し
export function callCardFunction(G: GameState, ctx: any) {
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
  return false;
}

export function openPause({ G }: { G: GameState }) {
  G.isPaused = true;
}
export function closePause({ G }: { G: GameState }) {
  G.isPaused = false;
}

// アニメログの初期化
export function resetAnimLog({ G }: { G: GameState }) {
  G.animLog.draw = [false, false];
  G.animLog.discardFlags = [[], []];
  G.animLog.flipFlags = [[], []];
  G.animLog.unflipFlags = [[], []];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      for (let h = 0; h < 3; h++) {
        G.animLog.place[r][c][h] = false;
        G.animLog.remove[r][c][h] = 0;
      }
    }
  }
}

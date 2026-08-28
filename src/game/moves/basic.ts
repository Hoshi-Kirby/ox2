import type { GameState } from "../MyGame";
import { cardDefs } from "../../data";

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
  G.faceDown[ctx.currentPlayer].fill(false);
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
        G.activeCardID = { ...G.hand[player][G.activeCard!] };
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
          }

          G.activeCard = active;
        }
        G.hand[player].splice(G.activeCard!, 1);
        G.faceDown[player].splice(G.activeCard!, 1);
        G.deck[player].push(G.activeCardID);
        G.costCards = [];
        G.phase = "idle"; //あとで"selectTarget";
      }
    }
    return;
  }
  return;
}
export function openPause({ G }: { G: GameState }) {
  G.isPaused = true;
}
export function closePause({ G }: { G: GameState }) {
  G.isPaused = false;
}

import type { GameState } from "../MyGame";
import { cardDefs } from "../../data";

// ターンエンド
export function endTurn({ events }: { events: any }) {
  events.endTurn();
}
// カードを使うときの共通 move
export function useCard(
  { G, ctx }: { G: GameState; ctx: any },
  cardIndex: number,
) {
  // idle → カードを選択して次のフェーズへ
  if (G.phase === "idle") {
    G.activeCard = cardIndex; // 今使うカードをセット
    G.phase = "payCost"; // 次のフェーズへ
    return;
  }
  // payCost → コスト選択
  if (G.phase === "payCost") {
    if (cardIndex !== G.activeCard) {
      // すでに選択済みなら削除
      const idx = G.costCards.indexOf(cardIndex);
      if (idx >= 0) {
        G.costCards.splice(idx, 1);
      } else {
        G.costCards.push(cardIndex);
      }
      const player = ctx.currentPlayer;
      const card = G.hand[player][G.activeCard!];
      const required = cardDefs[card.attr][card.index];
      if (G.costCards.length >= required.cost) {
        G.phase = "selectTarget";
      }
    }
    return;
  }
}

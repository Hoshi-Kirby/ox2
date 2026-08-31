import type { GameState } from "../MyGame";
import { canPlace } from "../../data";

export function card1(G: GameState, ctx: any) {
  // deleteキー
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "des", 1)) {
      G.animLog.remove[col][row][f] = G.board[col][row][f];
      G.board[col][row][f] = 0;
      G.phase = "idle";
      G.targets = [];
      return;
    }
    return;
  }
}
export function card2(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}
export function card3(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}
export function card4(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}
export function card5(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}
export function card6(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}
export function card7(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
  }
}

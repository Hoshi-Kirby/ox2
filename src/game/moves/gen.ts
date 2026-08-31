import type { GameState } from "../MyGame";
import { canPlace } from "../../data";

export function card1(G: GameState, ctx: any) {
  // シュレ猫
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "gen", 1)) {
      if (Number.isInteger(col) && Number.isInteger(row)) {
        G.board[col][row][f] = 3;
        G.animLog.place[col][row][f] = true;
      } else {
        const mx = col - 1.5;
        const my = row - 1.5;
        G.midBoard[mx][my][f] = 3;
        G.animLog.placeMid[mx][my][f] = true;
      }
      G.phase = "idle";
      G.targets = [];
      return;
    }
    return;
  }
}
export function card2(G: GameState, ctx: any) {
  // 外れ値
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "gen", 2)) {
      G.board[col][row][f] = Number(ctx.currentPlayer) + 1;
      G.phase = "idle";
      G.targets = [];
      G.animLog.place[col][row][f] = true;
      return;
    }
    return;
  }
}
export function card3(G: GameState, ctx: any) {
  // 囲碁
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "gen", 3)) {
      const mx = col - 1.5;
      const my = row - 1.5;
      G.midBoard[mx][my][f] = Number(ctx.currentPlayer) + 1;
      G.phase = "idle";
      G.targets = [];
      G.animLog.placeMid[mx][my][f] = true;
      return;
    }
    return;
  }
}
export function card4(G: GameState, ctx: any) {
  // append
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "gen", 4)) {
      G.board[col][row][f] = Number(ctx.currentPlayer) + 1;
      G.phase = "idle";
      G.targets = [];
      G.animLog.place[col][row][f] = true;
      return;
    }
    return;
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

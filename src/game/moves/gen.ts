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
      G.notFoundTurns[col][row][f] = 0;
      return;
    }
    return;
  }
}
export function card5(G: GameState, ctx: any) {
  // ジャンプ
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "gen", 5)) {
      G.board[col][row][f] = 5 - Number(ctx.currentPlayer);
      G.phase = "idle";
      G.targets = [];
      G.animLog.place[col][row][f] = true;
      return;
    }
    return;
  }
}
export function card6(G: GameState, ctx: any) {
  // prepend
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;

    if (canPlace(G, ctx, col, row, 0, "gen", 6)) {
      G.board[col][row][0] = Number(ctx.currentPlayer) + 1;
      G.phase = "idle";
      G.targets = [];
      G.animLog.place[col][row][0] = true;
      G.notFoundTurns[col][row][0] = 0;
      return;
    }
    return;
  }
}
export function card7(G: GameState, ctx: any) {
  //  積み将棋
  G.floor++;
}

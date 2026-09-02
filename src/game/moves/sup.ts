import type { GameState } from "../MyGame";
import { drawRandom } from "../MyGame";
import { canPlace } from "../../data";

export function card1(G: GameState, ctx: any) {
  //デフレスパイラル
  G.costChange[ctx.currentPlayer]--;
  G.animLog.costChange[ctx.currentPlayer] = -1;
}
export function card2(G: GameState, ctx: any) {
  // 倒置法
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "sup", 2)) {
      G.phase = "selectTarget2";
      return;
    }
    return;
  }
  if (G.phase === "selectTarget2") {
    const t2 = G.targets[1];
    if (!t2) return;
    const { row: row2, col: col2 } = t2;
    if (row2 === null || col2 === null) return;
    if (row2 === undefined || col2 === undefined) return;
    const f = G.floor;
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    if (row == row2 && col == col2) return;
    const player = Number(ctx.currentPlayer);

    if (Number.isInteger(col) && Number.isInteger(row)) {
      if (G.board[col][row][f] == 3) {
        if (canPlace(G, ctx, col2, row2, f, "sup", 22)) {
          if (G.board[col2][row2][f] == 0) {
            G.board[col][row][f] = 2 - player;
          }
          G.board[col2][row2][f] = player + 1;
          G.animLog.place[col][row][f] = true;
          G.animLog.place[col2][row2][f] = true;
          G.phase = "idle";
          G.targets = [];
          return;
        }
      } else if (canPlace(G, ctx, col2, row2, f, "sup", 12)) {
        const temp = G.board[col][row][f];
        G.board[col][row][f] = G.board[col2][row2][f];
        G.board[col2][row2][f] = temp;
        G.animLog.place[col][row][f] = true;
        G.animLog.place[col2][row2][f] = true;
        G.phase = "idle";
        G.targets = [];
        return;
      }
    } else {
      const mx = col - 1.5;
      const my = row - 1.5;
      if (G.midBoard[mx][my][f] == 3) {
        if (canPlace(G, ctx, col2, row2, f, "sup", 22)) {
          if (G.board[col2][row2][f] == 0) {
            G.midBoard[mx][my][f] = 2 - player;
          }
          G.board[col2][row2][f] = player + 1;
          G.animLog.placeMid[mx][my][f] = true;
          G.animLog.place[col2][row2][f] = true;
          G.phase = "idle";
          G.targets = [];
          return;
        }
      } else if (canPlace(G, ctx, col2, row2, f, "sup", 32)) {
        const temp = G.midBoard[mx][my][f];
        G.midBoard[mx][my][f] = G.board[col2][row2][f];
        G.board[col2][row2][f] = temp;
        G.animLog.placeMid[mx][my][f] = true;
        G.animLog.place[col2][row2][f] = true;
        G.phase = "idle";
        G.targets = [];
        return;
      }
    }
    return;
  }
}
export function card3(G: GameState, ctx: any) {
  // 北抜き
  const player = ctx.currentPlayer;
  drawRandom(G.deck[player], G.hand[player], G.faceDown[player], ctx.random);
  G.animLog.draw[player] = true;
}
export function card4(G: GameState, ctx: any) {
  // 一石返し
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "sup", 4)) {
      const player = Number(ctx.currentPlayer);
      G.board[col][row][f] = player + 1;
      G.animLog.place[col][row][f] = true;
      G.phase = "idle";
      G.targets = [];
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

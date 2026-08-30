import type { GameState } from "../MyGame";

export function card1(G: GameState, ctx: any) {
  if (G.phase === "selectTarget") {
    // ここに card の効果処理を書く
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
    const t = G.targets[0];
    if (!t) return;

    const { row, col } = t;

    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;

    if (row == 0 || col === 0 || row == 4 || col === 4) return;

    const f = G.floor;

    if (G.board[col][row][f] === 0) {
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

export function check4(G: GameState, ctx: any) {
  let canPlace = false;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (G.board[r][c][G.floor] === 0) {
        canPlace = true;
        break;
      }
    }
    if (canPlace) break;
  }
  if (!canPlace) {
    G.phase = "idle";
    G.targets = [];
  }
}

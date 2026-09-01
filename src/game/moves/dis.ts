import type { GameState } from "../MyGame";
import { canPlace } from "../../data";

export function card1(G: GameState, ctx: any) {
  // ハイパーインフレ
  G.costChange[1 - ctx.currentPlayer]++;
  G.animLog.costChange[1 - ctx.currentPlayer] = 1;
}
export function card2(G: GameState, ctx: any) {
  // ファイアウォール
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { indexH, indexV } = t;
    if (indexH === null && indexV === null) return;
    if (indexH !== null && indexV !== null) return;
    const f = 0;
    let head: number;
    let index: number;
    if (indexH !== null) {
      head = 0;
      index = indexH;
    } else {
      head = 1;
      index = indexV!;
    }

    if (canPlace(G, ctx, head, index, f, "dis", 2)) {
      if (head == 0) {
        G.firewall.horizontal[index] = true;
      } else {
        G.firewall.vertical[index] = true;
      }
      G.phase = "selectTarget2";
      G.firewallTurns[head][index] = 5;
      if (
        G.firewall.horizontal[0] &&
        G.firewall.horizontal[1] &&
        G.firewall.vertical[0] &&
        G.firewall.vertical[1]
      ) {
        G.phase = "idle";
      }
      return;
    }

    return;
  }
  if (G.phase === "selectTarget2") {
    const t = G.targets[1];
    if (!t) return;
    const { indexH, indexV } = t;
    if (indexH === null && indexV === null) return;
    if (indexH !== null && indexV !== null) return;
    const f = 0;
    let head: number;
    let index: number;
    if (indexH !== null) {
      head = 0;
      index = indexH;
    } else {
      head = 1;
      index = indexV!;
    }

    if (canPlace(G, ctx, head, index, f, "dis", 2)) {
      if (head == 0) {
        G.firewall.horizontal[index] = true;
      } else {
        G.firewall.vertical[index] = true;
      }
      G.phase = "idle";
      G.targets = [];
      G.firewallTurns[head][index] = 5;
      return;
    }

    return;
  }
}
export function card3(G: GameState, ctx: any) {
  // NOT FOUND
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;

    if (canPlace(G, ctx, col, row, f, "dis", 3)) {
      G.board[col][row][f] = Number(ctx.currentPlayer) + 6;
      G.phase = "idle";
      G.targets = [];
      G.animLog.place[col][row][f] = true;
      G.notFoundTurns[col][row][f] = 4;
      return;
    }
    return;
  }
}
export function card4(G: GameState, ctx: any) {
  // 落石注意
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        if (G.board[x][y][z] == 4 || G.board[x][y][z] == 5) {
          G.board[x][y][z] -= 3;
          G.animLog.place[x][y][z] = true;
        }
      }
    }
  }
  G.firewall.horizontal[0] = false;
  G.firewall.horizontal[1] = false;
  G.firewall.vertical[0] = false;
  G.firewall.vertical[1] = false;
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 3; z++) {
        if (G.midBoard[x][y][z] >= 1) {
          G.animLog.removeMid[x][y][z] = G.midBoard[x][y][z];
          const row = x * 2 + 1,
            col = y * 2 + 1;
          if (
            G.board[row][col][z] < 3 &&
            G.board[row][col][z] != G.midBoard[x][y][z]
          ) {
            if (G.board[row][col][z] == 0) {
              G.board[row][col][z] = G.midBoard[x][y][z];
            } else {
              G.board[row][col][z] = 3;
            }
            G.animLog.place[row][col][z] = true;
          }
          G.midBoard[x][y][z] = 0;
        }
      }
    }
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

import type { GameState } from "../MyGame";
import { canPlace } from "../../data";
import { updateWinner } from "./check";

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
      const player = Number(ctx.currentPlayer);
      if (G.board[col][row][f] == 3) {
        G.board[col][row][f] = player + 1;
        G.animLog.place[col][row][f] = true;
      } else {
        G.animLog.remove[col][row][f] = G.board[col][row][f];
        G.board[col][row][f] = 0;
      }
      G.removeCount[player]++;
      G.phase = "idle";
      G.targets = [];
      return;
    }
    return;
  }
}
export function card2(G: GameState, ctx: any) {
  // 超新星爆発
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { row, col } = t;
    if (row === null || col === null) return;
    if (row === undefined || col === undefined) return;
    const f = G.floor;
    if (canPlace(G, ctx, col, row, f, "des", 2)) {
      console.log("うぇ");
      const dirs = [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dx, dy] of dirs) {
        const nx = col + dx;
        const ny = row + dy;
        if (nx < 0 || nx > 4 || ny < 0 || ny > 4) continue;
        G.animLog.remove[nx][ny][f] = G.board[nx][ny][f];
        G.board[nx][ny][f] = 0;
        if (G.animLog.remove[nx][ny][f] != 0) {
          G.removeCount[ctx.currentPlayer]++;
        }
      }
      G.phase = "idle";
      G.targets = [];
      return;
    }
    return;
  }
}
export function card3(G: GameState, ctx: any) {
  // 狙撃
  if (G.phase === "selectTarget") {
    const t = G.targets[0];
    if (!t) return;
    const { index } = t;
    if (index === null || index === undefined) return;
    const enemy = 1 - Number(ctx.currentPlayer);
    G.animLog.discardHand[enemy] = [...G.hand[enemy]];
    G.animLog.discardFaceDown[enemy] = [...G.faceDown[enemy]];
    const hand = G.hand[enemy];
    const faceDown = G.faceDown[enemy];
    if (index < 0 || index >= hand.length) return;

    G.animLog.discardFlags[enemy] = Array(hand.length).fill(false);
    G.animLog.discardFlags[enemy][index] = true;
    G.deck[enemy].push(hand[index]);
    hand.splice(index, 1);
    if (index < faceDown.length) {
      faceDown.splice(index, 1);
    }
    G.phase = "idle";
    G.targets = [];
  }
}

export function card4(G: GameState, ctx: any) {
  // メテオ
  meteo(G);
  G.removeCount[ctx.currentPlayer]++;
  G.phase = "idle";
  G.targets = [];
  updateWinner(G, ctx);
}
export function card5(G: GameState, ctx: any) {
  // ダーツ
  const enemy = 1 - Number(ctx.currentPlayer);
  const hand = G.hand[enemy];
  const faceDown = G.faceDown[enemy];
  const index = Math.floor(Math.random() * hand.length);

  G.animLog.discardFlags[enemy] = Array(hand.length).fill(false);
  G.animLog.discardFlags[enemy][index] = true;
  G.deck[enemy].push(hand[index]);
  hand.splice(index, 1);
  if (index < faceDown.length) {
    faceDown.splice(index, 1);
  }
  G.phase = "idle";
  G.targets = [];
}
export function card6(G: GameState, ctx: any) {
  // 流星群
  for (let i = 0; i < 3; i++) {
    meteo(G);
    G.removeCount[ctx.currentPlayer]++;
  }
  G.phase = "idle";
  G.targets = [];
  updateWinner(G, ctx);
}
export function card7(G: GameState, ctx: any) {
  // 世界恐慌card4(G, ctx);
  const enemy = 1 - Number(ctx.currentPlayer);
  G.animLog.discardHand[enemy] = [...G.hand[enemy]];
  G.animLog.discardFaceDown[enemy] = [...G.faceDown[enemy]];
  card4(G, ctx);
  G.removeCount[ctx.currentPlayer]++;
  card5(G, ctx);
  const hand = G.hand[enemy];
  const faceDown = G.faceDown[enemy];

  if (hand.length > 0) {
    // ランダムで 1 枚裏返す
    const index = Math.floor(Math.random() * hand.length);
    faceDown[index] = true;
    G.animLog.flipFlags[enemy][index] = true;
  }

  G.phase = "idle";
  G.targets = [];
  updateWinner(G, ctx);
}

// メテオ
function meteo(G: GameState) {
  const targets = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        const token = G.board[x][y][z];
        if (token !== 0) {
          targets.push({ x, y, z, isMid: false });
        }
      }
    }
  }
  for (let mx = 0; mx < 2; mx++) {
    for (let my = 0; my < 2; my++) {
      for (let z = 0; z < 3; z++) {
        const token = G.midBoard[mx][my][z];
        if (token !== 0) {
          targets.push({
            x: mx + 1.5,
            y: my + 1.5,
            z,
            isMid: true,
          });
        }
      }
    }
  }
  if (targets.length === 0) {
    G.phase = "idle";
    return;
  }
  const t = targets[Math.floor(Math.random() * targets.length)];
  if (t.isMid) {
    G.animLog.removeMid[t.x - 1.5][t.y - 1.5][t.z] =
      G.midBoard[t.x - 1.5][t.y - 1.5][t.z];
    G.midBoard[t.x - 1.5][t.y - 1.5][t.z] = 0;
  } else {
    G.animLog.remove[t.x][t.y][t.z] = G.board[t.x][t.y][t.z];
    G.board[t.x][t.y][t.z] = 0;
  }
}

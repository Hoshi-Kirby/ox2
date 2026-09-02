import type { GameState } from "../MyGame";
import { drawRandom } from "../MyGame";
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
        const top = G.midBoard[x][y][z];
        if (top >= 1) {
          G.animLog.removeMid[x][y][z] = top;
          const row = x * 2 + 1;
          const col = y * 2 + 1;
          const bottom = G.board[row][col][z];
          const bottomTurns = G.notFoundTurns[row][col][z];
          const result = combinePieceWithTurns(bottom, top, bottomTurns, 0);

          G.board[row][col][z] = result.piece;
          G.notFoundTurns[row][col][z] = result.turns;

          if (result.piece !== bottom) {
            G.animLog.place[row][col][z] = true;
          }
          G.midBoard[x][y][z] = 0;
        }
      }
    }
  }
}
export function card5(G: GameState, ctx: any) {
  // 再結晶
  const player = ctx.currentPlayer;
  let handlength = 0;
  G.animLog.discardHand = [[...G.hand[0]], [...G.hand[1]]];
  G.animLog.discardFaceDown = [[...G.faceDown[0]], [...G.faceDown[1]]];

  for (let i = G.hand[player].length - 1; i >= 0; i--) {
    if (!G.faceDown[player][i]) {
      G.deck[player].push(G.hand[player][i]);
      G.hand[player].splice(i, 1);
      G.faceDown[player].splice(i, 1);
      G.animLog.discardFlags[player][i] = true;
      handlength++;
    }
  }
  if (handlength > 0) {
    G.animLog.draw[player] = true;
    G.animLog.drawCount[player] = handlength;
  }
  for (let i = 0; i < handlength; i++) {
    drawRandom(G.deck[player], G.hand[player], G.faceDown[player], ctx.random);
  }
  handlength = 0;
  for (let i = G.hand[1 - player].length - 1; i >= 0; i--) {
    if (!G.faceDown[1 - player][i]) {
      G.deck[1 - player].push(G.hand[1 - player][i]);
      G.hand[1 - player].splice(i, 1);
      G.faceDown[1 - player].splice(i, 1);
      G.animLog.discardFlags[1 - player][i] = true;
      handlength++;
    }
  }
  if (handlength > 0) {
    G.animLog.draw[1 - player] = true;
    G.animLog.drawCount[1 - player] = handlength;
  }
  for (let i = 0; i < handlength; i++) {
    drawRandom(
      G.deck[1 - player],
      G.hand[1 - player],
      G.faceDown[1 - player],
      ctx.random,
    );
  }
}
export function card6(G: GameState, ctx: any) {
  // ゲシュタルト崩壊
  G.floor = 0;
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const z0 = G.board[x][y][0];
      const z1 = G.board[x][y][1];
      const z2 = G.board[x][y][2];
      const t0 = G.notFoundTurns[x][y][0];
      const t1 = G.notFoundTurns[x][y][1];
      const t2 = G.notFoundTurns[x][y][2];
      if (z1 > 0) G.animLog.remove[x][y][1] = z1;
      if (z2 > 0) G.animLog.remove[x][y][2] = z2;

      const r01 = combinePieceWithTurns(z0, z1, t0, t1);
      const r012 = combinePieceWithTurns(r01.piece, z2, r01.turns, t2);

      const newPiece = r012.piece;
      const newTurns = r012.turns;
      if (z0 !== newPiece) {
        G.animLog.place[x][y][0] = true;
      }
      G.board[x][y][0] = newPiece;
      G.notFoundTurns[x][y][0] = newTurns;

      G.board[x][y][1] = 0;
      G.board[x][y][2] = 0;
      G.notFoundTurns[x][y][1] = 0;
      G.notFoundTurns[x][y][2] = 0;
    }
  }

  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      const z0 = G.midBoard[x][y][0];
      const z1 = G.midBoard[x][y][1];
      const z2 = G.midBoard[x][y][2];
      if (z1 > 0) {
        G.animLog.removeMid[x][y][1] = z1;
      }
      if (z2 > 0) {
        G.animLog.removeMid[x][y][2] = z2;
      }

      G.midBoard[x][y][0] = combinePiece(combinePiece(z0, z1), z2);
      G.midBoard[x][y][1] = 0;
      G.midBoard[x][y][2] = 0;
      if (z0 != G.midBoard[x][y][0]) {
        G.animLog.placeMid[x][y][0] = true;
      }
    }
  }
}
export function card7(G: GameState, ctx: any) {
  // オールイン
  const player = ctx.currentPlayer;
  G.animLog.discardFlags[player] = Array(G.hand[player].length).fill(true);
  G.animLog.discardFlags[1 - player] = Array(G.hand[1 - player].length).fill(
    true,
  );
  G.animLog.discardHand = [[...G.hand[0]], [...G.hand[1]]];
  G.animLog.discardFaceDown = [[...G.faceDown[0]], [...G.faceDown[1]]];

  for (let p = 0; p < 2; p++) {
    G.animLog.discardFlags[p] = Array(G.hand[p].length).fill(true);

    G.deck[p].push(...G.hand[p]);
    G.hand[p] = [];
    G.animLog.draw[p] = true;
    G.animLog.drawCount[p] = 10;

    for (let i = 0; i < 10; i++) {
      drawRandom(G.deck[p], G.hand[p], G.faceDown[p], ctx.random);
    }
  }
  G.faceDown[player] = Array(10).fill(true);
}

// 組み合わせ関数
function combinePieceWithTurns(
  bottom: number,
  top: number,
  bottomTurns: number,
  topTurns: number,
): { piece: number; turns: number } {
  const piece = combinePiece(bottom, top);

  if (piece !== 6 && piece !== 7) {
    return { piece, turns: 0 };
  }
  if (bottom === 6 || bottom === 7) {
    return { piece: bottom, turns: bottomTurns };
  }
  if (top === 6 || top === 7) {
    return { piece: top, turns: topTurns };
  }
  return { piece, turns: 0 };
}

function isCircle(x: number) {
  return x === 1 || x === 4 || x === 3;
}

function isCross(x: number) {
  return x === 2 || x === 5 || x === 3;
}

function combinePiece(bottom: number, top: number): number {
  // 0（空）は何でも上書きされる
  if (top === 0) return bottom;
  if (bottom === 0) return top;
  // NOTFOUND が駒に負ける（駒が優先）
  if (bottom === 6 || bottom === 7) {
    // bottom が NOTFOUND、top が駒
    // ○側NOTFOUND + ○系 → ○
    if (bottom === 6 && isCircle(top)) return 1;
    // ×側NOTFOUND + ×系 → ×
    if (bottom === 7 && isCross(top)) return 2;
    // それ以外 → bottomが優先
    return bottom;
  }
  if (top === 6 || top === 7) {
    // NOTFOUND は駒に負ける
    return bottom;
  }
  // ○と ○スキップ → ○スキップ
  if ((bottom === 1 && top === 4) || (bottom === 4 && top === 1)) return 4;
  // ×と ×スキップ → ×スキップ
  if ((bottom === 2 && top === 5) || (bottom === 5 && top === 2)) return 5;
  // ○系と ×系 → シュレ猫
  if (isCircle(bottom) && isCross(top)) return 3;
  if (isCircle(top) && isCross(bottom)) return 3;
  // それ以外は bottom を優先
  return bottom;
}

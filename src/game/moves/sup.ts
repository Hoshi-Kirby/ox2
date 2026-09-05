import type { GameState } from "../MyGame";
import { drawRandom } from "../MyGame";
import { canPlace } from "../../data";
import { updateWinner } from "./check";

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
      G.moveCount[ctx.currentPlayer]++;
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
          updateWinner(G, ctx);
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
        updateWinner(G, ctx);
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
          updateWinner(G, ctx);
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
        updateWinner(G, ctx);
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
      updateWinner(G, ctx);
      return;
    }
    return;
  }
}
export function card5(G: GameState, ctx: any) {
  // 酸化還元
  const circles = [];
  const crosses = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        const p = G.board[x][y][z];
        if (p === 1) circles.push({ x, y, z, isMid: false });
        if (p === 2) crosses.push({ x, y, z, isMid: false });
      }
    }
  }
  for (let mx = 0; mx < 2; mx++) {
    for (let my = 0; my < 2; my++) {
      for (let z = 0; z < 3; z++) {
        const p = G.midBoard[mx][my][z];
        if (p === 1) circles.push({ x: mx, y: my, z, isMid: true });
        if (p === 2) crosses.push({ x: mx, y: my, z, isMid: true });
      }
    }
  }

  if (circles.length === 0 || crosses.length === 0) return;
  const c0 = circles[Math.floor(Math.random() * circles.length)];
  const c1 = crosses[Math.floor(Math.random() * crosses.length)];

  const get = (obj: any) =>
    obj.isMid ? G.midBoard[obj.x][obj.y][obj.z] : G.board[obj.x][obj.y][obj.z];
  const set = (obj: any, val: number) => {
    if (obj.isMid) {
      G.midBoard[obj.x][obj.y][obj.z] = val;
    } else {
      G.board[obj.x][obj.y][obj.z] = val;
    }
  };
  const temp = get(c0);
  set(c0, get(c1));
  set(c1, temp);
  if (c0.isMid) {
    G.animLog.placeMid[c0.x][c0.y][c0.z] = true;
  } else {
    G.animLog.place[c0.x][c0.y][c0.z] = true;
  }
  if (c1.isMid) {
    G.animLog.placeMid[c1.x][c1.y][c1.z] = true;
  } else {
    G.animLog.place[c1.x][c1.y][c1.z] = true;
  }
  G.moveCount[ctx.currentPlayer]++;
  G.phase = "idle";
  G.targets = [];
  updateWinner(G, ctx);
}

export function card6(G: GameState, ctx: any) {
  // 革命
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        G.animLog.place[x][y][z] = true;
        switch (G.board[x][y][z]) {
          case 1:
            G.board[x][y][z] = 2;
            break;
          case 2:
            G.board[x][y][z] = 1;
            break;
          case 4:
            G.board[x][y][z] = 5;
            break;
          case 5:
            G.board[x][y][z] = 4;
            break;
          case 6:
            G.board[x][y][z] = 7;
            break;
          case 7:
            G.board[x][y][z] = 6;
            break;
          default:
            G.animLog.place[x][y][z] = false;
            break;
        }
      }
    }
  }
}
export function card7(G: GameState, ctx: any) {
  // スライド
  const dirs = ["right", "left", "down", "up"];
  const dir = dirs[Math.floor(Math.random() * 4)];

  if (dir === "right") {
    for (let x = 4; x >= 0; x--) {
      for (let y = 0; y < 5; y++) {
        for (let z = 0; z < 3; z++) {
          slideCell(G, x, y, z, 1, 0);
        }
      }
    }
    for (let x = 1; x >= 0; x--) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 3; z++) {
          slideCellMidBoard(G, x, y, z, 1, 0);
        }
      }
    }
  }

  if (dir === "left") {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        for (let z = 0; z < 3; z++) {
          slideCell(G, x, y, z, -1, 0);
        }
      }
    }
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 3; z++) {
          slideCellMidBoard(G, x, y, z, -1, 0);
        }
      }
    }
  }

  if (dir === "down") {
    for (let y = 4; y >= 0; y--) {
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 3; z++) {
          slideCell(G, x, y, z, 0, 1);
        }
      }
    }
    for (let y = 1; y >= 0; y--) {
      for (let x = 0; x < 2; x++) {
        for (let z = 0; z < 3; z++) {
          slideCellMidBoard(G, x, y, z, 0, 1);
        }
      }
    }
  }

  if (dir === "up") {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 3; z++) {
          slideCell(G, x, y, z, 0, -1);
        }
      }
    }
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        for (let z = 0; z < 3; z++) {
          slideCellMidBoard(G, x, y, z, 0, -1);
        }
      }
    }
  }
  G.moveCount[ctx.currentPlayer]++;
  updateWinner(G, ctx);
}

function slideCell(
  G: GameState,
  x: number,
  y: number,
  z: number,
  dx: number,
  dy: number,
) {
  const piece = G.board[x][y][z];
  if (piece === 0) return;
  const wasInner = 1 <= x && x <= 3 && 1 <= y && y <= 3;
  let nx = x;
  let ny = y;

  while (true) {
    const nextX = nx + dx;
    const nextY = ny + dy;
    if (nextX < 0 || nextX >= 5 || nextY < 0 || nextY >= 5) break;

    const nextInner = 1 <= nextX && nextX <= 3 && 1 <= nextY && nextY <= 3;
    if (wasInner && !nextInner) break;
    if (G.board[nextX][nextY][z] !== 0) break;
    G.board[nextX][nextY][z] = piece;
    G.board[nx][ny][z] = 0;
    nx = nextX;
    ny = nextY;
  }
  if (x != nx || y != ny) {
    G.animLog.remove[x][y][z] = piece;
    G.animLog.place[nx][ny][z] = true;
    G.notFoundTurns[nx][ny][z] = G.notFoundTurns[x][y][z];
    G.notFoundTurns[x][y][z] = 0;
  }
}
function slideCellMidBoard(
  G: GameState,
  x: number,
  y: number,
  z: number,
  dx: number,
  dy: number,
) {
  const piece = G.midBoard[x][y][z];
  if (piece === 0) return;
  const nx = x + dx;
  const ny = y + dy;
  if (nx < 0 || nx >= 2 || ny < 0 || ny >= 2) return;
  if (G.midBoard[nx][ny][z] !== 0) return;

  G.animLog.removeMid[x][y][z] = piece;
  G.animLog.placeMid[nx][ny][z] = true;
  G.midBoard[nx][ny][z] = piece;
  G.midBoard[x][y][z] = 0;
}

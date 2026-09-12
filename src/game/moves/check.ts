import type { GameState } from "../MyGame";

type Pos = {
  x: number; // 0〜4 or 1.5/2.5
  y: number; // 0〜4 or 1.5/2.5
  z: number; // 0〜2
};
export function updateWinner(G: GameState, ctx: any) {
  const oLines = checkWin(G, 0);
  const xLines = checkWin(G, 1);

  const oWin = oLines.length > 0;
  const xWin = xLines.length > 0;

  if (!oWin && !xWin) {
    G.winner = null;
    G.winnerLines = [];
    return;
  }
  // ① ライン本数で比較
  if (oLines.length > xLines.length) {
    G.winner = 0;
    G.winnerLines = oLines;
    return;
  }
  if (xLines.length > oLines.length) {
    G.winner = 1;
    G.winnerLines = xLines;
    return;
  }
  const oCount = countPieces(G, 0);
  const xCount = countPieces(G, 1);

  if (oCount > xCount) {
    G.winner = 0;
    G.winnerLines = oLines;
    return;
  }
  if (xCount > oCount) {
    G.winner = 1;
    G.winnerLines = xLines;
    return;
  }

  const current = Number(ctx.currentPlayer);
  G.winner = current;
  G.winnerLines = current === 0 ? oLines : xLines;
}
export function countPieces(G: GameState, player: number): number {
  let count = 0;

  // board の駒
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        const v = G.board[x][y][z];
        if (isMyPieceBoard(v, player)) count++;
      }
    }
  }

  // midBoard の駒
  for (let mx = 0; mx < 2; mx++) {
    for (let my = 0; my < 2; my++) {
      for (let z = 0; z < 3; z++) {
        const v = G.midBoard[mx][my][z];
        if (isMyPieceMid(v, player)) count++;
      }
    }
  }

  return count;
}
// ラインの個数
export function checkWin(G: GameState, player: number): Pos[][] {
  // 3D 全方向ステップ
  const directions: Pos[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        if (
          dx > 0 ||
          (dx === 0 && dy > 0) ||
          (dx === 0 && dy === 0 && dz > 0)
        ) {
          directions.push({ x: dx, y: dy, z: dz });
        }
      }
    }
  }

  // 盤面上の「自分の駒」＋midBoard の「自分の駒」を全部集める
  const starts: Pos[] = [];

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        const v = G.board[x][y][z];
        if (isMyPieceBoard(v, player)) {
          starts.push({ x, y, z });
        }
      }
    }
  }

  for (let mx = 0; mx < 2; mx++) {
    for (let my = 0; my < 2; my++) {
      for (let z = 0; z < 3; z++) {
        const v = G.midBoard[mx][my][z];
        if (isMyPieceMid(v, player)) {
          const x = 1.5 + mx;
          const y = 1.5 + my;
          starts.push({ x, y, z });
        }
      }
    }
  }
  const results: Pos[][] = [];
  for (const A of starts) {
    for (const dir of directions) {
      const line1 = checkLine(G, player, A, dir, false);
      if (line1) results.push(line1);

      if (shouldUseHalfStep(dir)) {
        const halfDir = { x: dir.x / 2, y: dir.y / 2, z: dir.z };
        const line2 = checkLine(G, player, A, halfDir, true);
        if (line2) results.push(line2);
      }
    }
  }

  return results;
}
type ReachInfo = {
  target: Pos;
  passedValue: number | null;
};
// リーチ
export function findReach(G: GameState, player: number): ReachInfo[] {
  const directions: Pos[] = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;

        if (
          dx > 0 ||
          (dx === 0 && dy > 0) ||
          (dx === 0 && dy === 0 && dz > 0)
        ) {
          directions.push({
            x: dx,
            y: dy,
            z: dz,
          });
        }
      }
    }
  }

  const starts: Pos[] = [];

  // board
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 3; z++) {
        const v = G.board[x][y][z];

        if (isMyPieceBoard(v, player)) {
          starts.push({ x, y, z });
        }
      }
    }
  }

  // midBoard
  for (let mx = 0; mx < 2; mx++) {
    for (let my = 0; my < 2; my++) {
      for (let z = 0; z < 3; z++) {
        const v = G.midBoard[mx][my][z];

        if (isMyPieceMid(v, player)) {
          starts.push({
            x: 1.5 + mx,
            y: 1.5 + my,
            z,
          });
        }
      }
    }
  }

  const results: ReachInfo[] = [];
  for (const A of starts) {
    for (const dir of directions) {
      const line1 = checkReachLine(G, player, A, dir, false);
      if (line1) {
        results.push(...line1);
      }
      if (shouldUseHalfStep(dir)) {
        const halfDir = {
          x: dir.x / 2,
          y: dir.y / 2,
          z: dir.z,
        };
        const line2 = checkReachLine(G, player, A, halfDir, true);
        if (line2) {
          results.push(...line2);
        }
      }
    }
  }

  return results;
}

function isMyPieceBoard(v: number, player: number): boolean {
  // board: 0 空, 1◯,2×,3両方,4◯ジャンプ,5×ジャンプ,6×不可,7◯不可
  if (v === 3) return true;
  if (player === 0) return v === 1 || v === 4;
  if (player === 1) return v === 2 || v === 5;
  return false;
}

function isMyPieceMid(v: number, player: number): boolean {
  // midBoard: 0 空,1◯,2×,3両方
  if (v === 3) return true;
  if (player === 0) return v === 1;
  if (player === 1) return v === 2;
  return false;
}

function isOppPieceBoard(v: number, player: number): boolean {
  if (v === 3) return false; // 両方自分扱い
  if (player === 0) return v === 2 || v === 5;
  if (player === 1) return v === 1 || v === 4;
  return false;
}

function isJumpForPlayerBoard(v: number, player: number): boolean {
  if (player === 0) return v === 5; // ×ジャンプ
  if (player === 1) return v === 4; // ◯ジャンプ
  return false;
}

function sampleCell(G: GameState, pos: Pos): number | null {
  const { x, y, z } = pos;
  if (z < 0 || z >= 3) return null;

  const isIntX = Number.isInteger(x);
  const isIntY = Number.isInteger(y);
  const isIntZ = Number.isInteger(z);
  if (!isIntZ) {
    return null;
  }

  if (isIntX && isIntY && isIntZ) {
    const ix = x | 0;
    const iy = y | 0;
    if (ix < 0 || ix >= 5 || iy < 0 || iy >= 5) return null;
    return G.board[ix][iy][z];
  }

  // midBoard: x,y は 1.5 or 2.5 のみ
  const mx = x - 1.5;
  const my = y - 1.5;
  if ((mx === 0 || mx === 1) && (my === 0 || my === 1) && isIntZ) {
    const imx = mx | 0;
    const imy = my | 0;
    if (imx < 0 || imx >= 2 || imy < 0 || imy >= 2) return null;
    return G.midBoard[imx][imy][z];
  }

  return null;
}

function shouldUseHalfStep(dir: Pos): boolean {
  // midBoard を使う条件：斜め方向（|dx|==|dy|==1）
  const isDiagonal = Math.abs(dir.x) === 1 && Math.abs(dir.y) === 1;
  if (!isDiagonal) return false;

  return true;
}

function hasFirewallBetween(G: GameState, pos: Pos, next: Pos): boolean {
  // 横方向の壁
  if (pos.y === 1 && next.y === 2) return G.firewall.horizontal[0];
  if (pos.y === 2 && next.y === 1) return G.firewall.horizontal[0];

  if (pos.y === 2 && next.y === 3) return G.firewall.horizontal[1];
  if (pos.y === 3 && next.y === 2) return G.firewall.horizontal[1];

  // 縦方向の壁
  if (pos.x === 1 && next.x === 2) return G.firewall.vertical[0];
  if (pos.x === 2 && next.x === 1) return G.firewall.vertical[0];

  if (pos.x === 2 && next.x === 3) return G.firewall.vertical[1];
  if (pos.x === 3 && next.x === 2) return G.firewall.vertical[1];

  return false;
}

// ラインがあるか
function checkLine(
  G: GameState,
  player: number,
  A: Pos,
  step: Pos,
  useHalf: boolean,
): Pos[] | null {
  let countMy = 0;
  let pos: Pos = { ...A };
  const line: Pos[] = [];
  for (let k = 0; k < 6; k++) {
    const v = sampleCell(G, pos);
    if (v === null) break;
    line.push({ ...pos });

    const isIntX = Number.isInteger(pos.x);
    const isIntY = Number.isInteger(pos.y);

    if (useHalf) {
      // ★ midBoard 探索モード
      if (!isIntX || !isIntY) {
        // midBoard 上
        if (isMyPieceMid(v, player)) {
          countMy++;
        } else {
          break;
        }
      } else {
        // board 上
        if (isMyPieceBoard(v, player)) {
          countMy++;
        } else if (isOppPieceBoard(v, player)) {
          if (isJumpForPlayerBoard(v, player)) {
          } else {
            break;
          }
        } else {
          break;
        }
      }
    } else {
      // ★ 通常 board 探索モード
      if (isIntX && isIntY) {
        // board 上
        if (isMyPieceBoard(v, player)) {
          countMy++;
        } else if (isOppPieceBoard(v, player)) {
          if (isJumpForPlayerBoard(v, player)) {
          } else {
            break;
          }
        } else {
          break;
        }

        // ここで「途中の midBoard（step/2）」をチェック
        const midPos: Pos = {
          x: pos.x + step.x / 2,
          y: pos.y + step.y / 2,
          z: pos.z + step.z / 2,
        };
        const mv = sampleCell(G, midPos);
        if (mv !== null) {
          const midIntX = Number.isInteger(midPos.x);
          const midIntY = Number.isInteger(midPos.y);
          if (!midIntX || !midIntY) {
            // midBoard 上
            if (mv === 0) {
            } else {
              break;
            }
          }
        }
      } else {
        // ★ midBoard の通常探索（縦方向だけ許可）
        const isVertical = step.x === 0 && step.y === 0 && step.z === 1;

        if (isVertical) {
          if (isMyPieceMid(v, player)) {
            countMy++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    if (countMy >= 3) return line;
    const next = {
      x: pos.x + step.x,
      y: pos.y + step.y,
      z: pos.z + step.z,
    };
    if (hasFirewallBetween(G, pos, next)) break;

    pos = next;
  }

  return null;
}
// リーチがあるか
function checkReachLine(
  G: GameState,
  player: number,
  A: Pos,
  step: Pos,
  useHalf: boolean,
): ReachInfo[] {
  const results: ReachInfo[] = [];
  let countMy = 0;
  let firstMy: Pos | null = null;
  let passed: Pos | null = null;
  let passedValue: number | null = null;
  let pos: Pos = { ...A };

  for (let k = 0; k < 6; k++) {
    const v = sampleCell(G, pos);
    if (v === null) break;
    const isIntX = Number.isInteger(pos.x);
    const isIntY = Number.isInteger(pos.y);
    let isMyPiece = false;
    let isPassable = false;

    if (useHalf) {
      // ★ midBoard 探索モード
      if (!isIntX || !isIntY) {
        if (isMyPieceMid(v, player)) {
          isMyPiece = true;
        } else {
          isPassable = true;
        }
      } else {
        if (isMyPieceBoard(v, player)) {
          isMyPiece = true;
        } else {
          isPassable = true;
        }
      }
    } else {
      // ★ 通常 board 探索モード
      if (isIntX && isIntY) {
        if (isMyPieceBoard(v, player)) {
          isMyPiece = true;
        } else if (isOppPieceBoard(v, player)) {
          if (isJumpForPlayerBoard(v, player)) {
          } else {
            isPassable = true;
          }
        } else {
          isPassable = true;
        }

        // ここで「途中の midBoard（step/2）」をチェック
        const midPos: Pos = {
          x: pos.x + step.x / 2,
          y: pos.y + step.y / 2,
          z: pos.z + step.z / 2,
        };
        const mv = sampleCell(G, midPos);
        if (mv !== null) {
          const midIntX = Number.isInteger(midPos.x);
          const midIntY = Number.isInteger(midPos.y);
          if (!midIntX || !midIntY) {
            if (mv === 0) {
            } else {
              break;
            }
          }
        }
      } else {
        const isVertical = step.x === 0 && step.y === 0 && step.z === 1;

        if (isVertical) {
          if (isMyPieceMid(v, player)) {
            isMyPiece = true;
          } else {
            isPassable = true;
          }
        } else {
          break;
        }
      }
    }

    // 自分
    if (isMyPiece) {
      countMy++;
      if (firstMy === null) {
        firstMy = { ...pos };
      } else if (countMy === 2) {
        if (passed !== null) {
          results.push({
            target: { ...passed },
            passedValue,
          });
        } else {
          const before = checkReachTarget(G, player, firstMy, {
            x: -step.x,
            y: -step.y,
            z: -step.z,
          });

          if (before !== null) {
            results.push(before);
          }

          const after = checkReachTarget(G, player, pos, step);

          if (after !== null) {
            results.push(after);
          }
        }

        break;
      }

      pos = {
        x: pos.x + step.x,
        y: pos.y + step.y,
        z: pos.z + step.z,
      };

      continue;
    }
    // 自分以外
    if (isPassable) {
      if (passed !== null) {
        break;
      }

      passed = { ...pos };
      passedValue = v;

      pos = {
        x: pos.x + step.x,
        y: pos.y + step.y,
        z: pos.z + step.z,
      };

      continue;
    }

    break;
  }

  return results;
}

function checkReachTarget(
  G: GameState,
  player: number,
  base: Pos,
  step: Pos,
): ReachInfo | null {
  const target: Pos = {
    x: base.x + step.x,
    y: base.y + step.y,
    z: base.z + step.z,
  };
  const v = sampleCell(G, target);

  if (v === null) {
    return null;
  }

  const isDiagonal = Math.abs(step.x) === 1 && Math.abs(step.y) === 1;
  if (isDiagonal) {
    const midPos: Pos = {
      x: base.x + step.x / 2,
      y: base.y + step.y / 2,
      z: base.z + step.z / 2,
    };

    const mv = sampleCell(G, midPos);
    if (mv !== null) {
      const midIntX = Number.isInteger(midPos.x);
      const midIntY = Number.isInteger(midPos.y);
      if (!midIntX || !midIntY) {
        if (mv === 0) {
        } else {
          return null;
        }
      }
    }
  }

  if (isMyPieceBoard(v, player) || isMyPieceMid(v, player)) {
    return null;
  }

  // 自分の駒以外ならリーチ
  return {
    target,
    passedValue: v,
  };
}

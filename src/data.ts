// src/data/cardDefs.ts
import type { CardAttr, CardNum } from "./types";
import type { GameState } from "./game/MyGame";

export interface CardDef {
  cost: number;
  costType: "flip" | "discard" | "mix";
  auto: boolean;
}
export const cardDefs: Record<CardAttr, Record<CardNum, CardDef>> = {
  des: {
    1: { cost: 2, costType: "discard", auto: false }, //deleteキー
    2: { cost: 3, costType: "discard", auto: false }, //超新星爆発
    3: { cost: 1, costType: "discard", auto: false }, //狙撃
    4: { cost: 2, costType: "mix", auto: true }, //メテオ
    5: { cost: 3, costType: "flip", auto: true }, //ダーツ
    6: { cost: 2, costType: "mix", auto: true }, //流星群
    7: { cost: 3, costType: "mix", auto: true }, //世界恐慌
  },

  gen: {
    1: { cost: 6, costType: "mix", auto: false }, //シュレ猫
    2: { cost: 6, costType: "mix", auto: false }, //外れ値
    3: { cost: 7, costType: "mix", auto: false }, //囲碁
    4: { cost: 5, costType: "mix", auto: false }, //append
    5: { cost: 1, costType: "discard", auto: false }, //ジャンプ
    6: { cost: 5, costType: "mix", auto: false }, //prepend
    7: { cost: 3, costType: "flip", auto: true }, //積み将棋
  },

  dis: {
    1: { cost: 0, costType: "flip", auto: true }, //ハイパーインフレ
    2: { cost: 2, costType: "mix", auto: false }, //ファイアウォール
    3: { cost: 1, costType: "discard", auto: false }, //NOT FOUND
    4: { cost: 3, costType: "flip", auto: true }, //落石注意
    5: { cost: 4, costType: "flip", auto: true }, //再結晶
    6: { cost: 3, costType: "discard", auto: true }, //ゲシュタルト崩壊
    7: { cost: 5, costType: "flip", auto: true }, //オールイン
  },

  sup: {
    1: { cost: 1, costType: "discard", auto: true }, //デフレスパイラル
    2: { cost: 2, costType: "flip", auto: false }, //倒置法
    3: { cost: 2, costType: "mix", auto: true }, //北抜き
    4: { cost: 7, costType: "mix", auto: false }, //一石返し
    5: { cost: 4, costType: "flip", auto: true }, //酸化還元
    6: { cost: 4, costType: "discard", auto: true }, //革命
    7: { cost: 3, costType: "discard", auto: true }, //スライド
  },
};

export function canPlace(
  G: GameState,
  ctx: any,
  x: number,
  y: number,
  z: number,
  attr: string,
  index: number,
): boolean {
  const player = Number(ctx.currentPlayer);
  const f = G.floor;
  let token;
  if (Number.isInteger(x) && Number.isInteger(y)) {
    token = G.board[x][y][z];
  } else {
    token = G.midBoard[x - 1.5][y - 1.5][z];
  }

  // deleteキー
  if (attr === "des" && index === 1) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      (token === 2 - player || token === 3 || token === 5 - player)
    );
  }

  // 超新星爆発
  if (attr === "des" && index === 2) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
    if (z !== f) return false;
    const dirs = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx > 4 || ny < 0 || ny > 4) continue;
      if (G.board[nx][ny][z] !== 0) {
        return true;
      }
    }
    return false;
  }
  // 狙撃
  if (attr === "des" && index === 3) {
    const enemy = 1 - Number(ctx.currentPlayer);
    return G.hand[enemy].length !== 0;
  }
  // メテオ
  if (attr === "des" && index === 4) {
    return token != 0;
  }
  // ダーツ
  if (attr === "des" && index === 5) {
    const enemy = 1 - Number(ctx.currentPlayer);
    return G.hand[enemy].length !== 0;
  }
  // 流星群
  if (attr === "des" && index === 6) {
    return token != 0;
  }
  // 世界恐慌
  if (attr === "des" && index === 7) {
    return true;
  }
  // シュレ猫
  if (attr === "gen" && index === 1) {
    return z == f && (token === 2 - player || token === 5 - player);
  }
  // 外れ値
  if (attr === "gen" && index === 2) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      (x == 0 || x == 4 || y == 0 || y == 4) &&
      z == f &&
      token === 0
    );
  }
  // 囲碁
  if (attr === "gen" && index === 3) {
    return (
      !Number.isInteger(x) && !Number.isInteger(y) && z == f && token === 0
    );
  }

  // append
  if (attr === "gen" && index === 4) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      (token === 0 || token === 6 + player)
    );
  }
  // ジャンプ
  if (attr === "gen" && index === 5) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      token === 2 - player
    );
  }
  // prepend
  if (attr === "gen" && index === 6) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == 0 &&
      (token === 0 || token === 6 + player)
    );
  }
  // 積み将棋
  if (attr === "gen" && index === 7) {
    return f < 2;
  }
  // ハイパーインフレ
  if (attr === "dis" && index === 1) {
    return true;
  }
  // ファイアウォール
  if (attr === "dis" && index === 2) {
    let res = false;
    if (x == 0 && y < 2) {
      res = !G.firewall.horizontal[y];
    }
    if (x == 1 && y < 2) {
      res = !G.firewall.vertical[y];
    }
    return res;
  }
  // NOT FOUND
  if (attr === "dis" && index === 3) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      token === 0
    );
  }
  // 落石注意
  if (attr === "dis" && index === 4) {
    return true;
  }
  // 再結晶
  if (attr === "dis" && index === 5) {
    return true;
  }
  // ゲシュタルト崩壊
  if (attr === "dis" && index === 6) {
    return f > 0;
  }
  // オールイン
  if (attr === "dis" && index === 7) {
    return true;
  }
  // デフレスパイラル
  if (attr === "sup" && index === 1) {
    return true;
  }
  // 倒置法
  // 交換前
  if (attr === "sup" && index === 2) {
    return (
      z == f && (token === player + 1 || token === 3 || token === player + 4)
    );
  }
  // 交換後
  if (attr === "sup" && index === 12) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      token !== 6 &&
      token !== 7
    );
  }
  // 交換後、交換前がシュレ猫
  if (attr === "sup" && index === 22) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      (token === 0 || token === player + 1)
    );
  }
  // 交換後、交換前が囲碁(囲碁シュレ猫は22)
  if (attr === "sup" && index === 32) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      0 <= token &&
      token <= 3
    );
  }
  // 北抜き
  if (attr === "sup" && index === 3) {
    return true;
  }
  // 一石返し
  if (attr === "sup" && index === 4) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      z == f &&
      (token === 2 - player || token === 3 || token === 5 - player)
    );
  }
  // 酸化還元
  if (attr === "sup" && index === 5) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x != 0 &&
      x != 4 &&
      y != 0 &&
      y != 4 &&
      token === 2 - player
    );
  }
  // 革命
  if (attr === "sup" && index === 6) {
    return true;
  }
  // スライド
  if (attr === "sup" && index === 7) {
    return true;
  }
  return false;
}

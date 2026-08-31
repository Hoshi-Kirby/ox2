// src/data/cardDefs.ts
import type { CardAttr, CardNum } from "./types";
import type { GameState } from "./game/MyGame";

export interface CardDef {
  cost: number;
  costType: "flip" | "discard";
}
export const cardDefs: Record<CardAttr, Record<CardNum, CardDef>> = {
  des: {
    1: { cost: 3, costType: "discard" },
    2: { cost: 2, costType: "discard" },
    3: { cost: 1, costType: "flip" },
    4: { cost: 9, costType: "discard" },
    5: { cost: 2, costType: "flip" },
    6: { cost: 9, costType: "flip" },
    7: { cost: 4, costType: "discard" },
  },

  gen: {
    1: { cost: 1, costType: "flip" },
    2: { cost: 2, costType: "flip" },
    3: { cost: 1, costType: "discard" },
    4: { cost: 5, costType: "flip" },
    5: { cost: 2, costType: "discard" },
    6: { cost: 1, costType: "flip" },
    7: { cost: 4, costType: "discard" },
  },

  dis: {
    1: { cost: 0, costType: "flip" },
    2: { cost: 2, costType: "discard" },
    3: { cost: 1, costType: "flip" },
    4: { cost: 3, costType: "discard" },
    5: { cost: 2, costType: "flip" },
    6: { cost: 1, costType: "flip" },
    7: { cost: 4, costType: "discard" },
  },

  sup: {
    1: { cost: 1, costType: "flip" },
    2: { cost: 2, costType: "flip" },
    3: { cost: 1, costType: "discard" },
    4: { cost: 3, costType: "flip" },
    5: { cost: 2, costType: "discard" },
    6: { cost: 1, costType: "flip" },
    7: { cost: 4, costType: "discard" },
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
  const token = G.board[x][y][z];

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
      token === 0
    );
  }

  // 他のカードは後で追加
  return false;
}

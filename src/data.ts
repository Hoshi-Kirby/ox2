// src/data/cardDefs.ts
import type { CardAttr, CardNum } from "./types";

export interface CardDef {
  cost: number;
  costType: "flip" | "discard";
}

// des/gen/dis/sup × 1〜7 の二次元構造
export const cardDefs: Record<CardAttr, Record<CardNum, CardDef>> = {
  des: {
    1: { cost: 1, costType: "flip" },
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

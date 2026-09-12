import type { GameState } from "../MyGame";
import { countPieces, findReach, checkWin } from "../moves/check.ts";
import { cardDefs } from "../../data";
type Pos = {
  x: number; // 0〜4 or 1.5/2.5
  y: number; // 0〜4 or 1.5/2.5
  z: number; // 0〜2
};
type ReachInfo = {
  target: Pos;
  passedValue: number | null;
};
// リーチなど
export type EvaluationData = {
  myPieces: number;
  opponentPieces: number;
  myReach: ReachInfo[];
  opponentReach: ReachInfo[];
  myLines: number;
  opponentLines: number;
};

// リーチ数など
export function analyzeState(G: GameState, playerID: string): EvaluationData {
  const me = Number(playerID);
  const opponent = me === 0 ? 1 : 0;
  const myPieces = countPieces(G, me);
  const opponentPieces = countPieces(G, opponent);
  const myReach = findReach(G, me);
  const opponentReach = findReach(G, opponent);
  const myLines = checkWin(G, me).length;
  const opponentLines = checkWin(G, opponent).length;

  return {
    myPieces,
    opponentPieces,
    myReach,
    opponentReach,
    myLines,
    opponentLines,
  };
}

// カード価値
export function evaluateCard(
  G: GameState,
  card: GameState["hand"][0][0],
  player: number,
  data: EvaluationData,
): number {
  const opponent = player === 0 ? 1 : 0;
  const def = cardDefs[card.attr][card.index];

  let value = 0;

  if (card.attr === "des") {
    if (card.index === 1) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === G.floor &&
          target.x != 0 &&
          target.x != 4 &&
          target.y != 0 &&
          target.y != 4 &&
          reach.passedValue === opponent + 1
        ) {
          value = 2;
        }
      }
      value += data.opponentReach.length * 5;
    } else if (card.index === 2) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === G.floor &&
          reach.passedValue === opponent + 1
        ) {
          value = 2;
        }
      }
      value += data.opponentReach.length * 5;
    } else if (card.index === 3) {
      value = 3 - G.hand[opponent].length / 5;
    } else if (card.index === 4) {
      value =
        (data.opponentPieces / (data.opponentPieces + data.myPieces)) * 2 + 1;
    } else if (card.index === 5) {
      value = 3 - G.hand[opponent].length / 5;
    } else if (card.index === 6) {
      value =
        (data.opponentPieces / (data.opponentPieces + data.myPieces)) * 2 + 1;
    } else if (card.index === 7) {
      value = 3 - G.hand[opponent].length / 5;
      value +=
        (data.opponentPieces / (data.opponentPieces + data.myPieces)) * 1.5 + 1;
    }
  } else if (card.attr === "gen") {
    if (card.index === 1) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (target.z === G.floor && reach.passedValue === opponent + 1) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 2) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          (target.x == 0 || target.x == 4 || target.y == 0 || target.y == 4) &&
          target.z === G.floor &&
          reach.passedValue === 0
        ) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 3) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          !Number.isInteger(target.x) &&
          !Number.isInteger(target.y) &&
          target.z === G.floor &&
          reach.passedValue === 0
        ) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 4) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === G.floor &&
          (reach.passedValue === 0 || reach.passedValue === player + 6)
        ) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 5) {
      value = 1 + data.myPieces / 5;
    } else if (card.index === 6) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === 0 &&
          (reach.passedValue === 0 || reach.passedValue === player + 6)
        ) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 7) {
      value = 2;
    }
  } else if (card.attr === "dis") {
    if (card.index === 1) {
      value = 2;
    } else if (card.index === 2) {
      for (const reach of data.opponentReach) {
        const { target } = reach;
        if (Number.isInteger(target.x) && Number.isInteger(target.y)) {
          value = 5;
        }
      }
      value += 1;
    } else if (card.index === 3) {
      for (const reach of data.opponentReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === G.floor &&
          reach.passedValue === 0
        ) {
          value = 5;
        }
      }
      value += 1;
    } else if (card.index === 4) {
      value = 2;
    } else if (card.index === 5) {
      value = 2;
    } else if (card.index === 6) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (target.z === 2) {
          value += 2;
        }
      }
      value += 2;
    } else if (card.index === 7) {
      value = 2;
    }
  } else if (card.attr === "sup") {
    if (card.index === 1) {
      value = 2;
    } else if (card.index === 2) {
      if (data.myPieces > 2) {
        for (const reach of data.myReach) {
          const { target } = reach;
          if (target.z === G.floor && reach.passedValue !== opponent + 6) {
            value += 10;
          }
        }
      }
      value += 1;
    } else if (card.index === 3) {
      value = 2;
    } else if (card.index === 4) {
      for (const reach of data.myReach) {
        const { target } = reach;
        if (
          Number.isInteger(target.x) &&
          Number.isInteger(target.y) &&
          target.z === G.floor &&
          (reach.passedValue === opponent || reach.passedValue === opponent + 4)
        ) {
          value += 10;
        }
      }
      value += 1;
    } else if (card.index === 5) {
      if (data.myPieces > 2) {
        for (const reach of data.myReach) {
          const { target } = reach;
          if (target.z === G.floor && reach.passedValue !== opponent + 6) {
            value += 4;
          }
        }
      }
      value += 1;
    } else if (card.index === 6) {
      value =
        (data.opponentReach.length /
          (data.opponentReach.length + data.myReach.length)) *
          10 +
        1;
    } else if (card.index === 7) {
      value = 2;
    }
  }

  // 使えるか
  if (
    G.hand[player].length + 2 >=
    def.costFlip + def.costDiscard + 1 + G.costChange[player]
  ) {
    value *= 1.2;
  }

  return value;
}

// 手札価値
export function evaluateHand(
  G: GameState,
  player: number,
  data: EvaluationData,
): number {
  let value = 0;

  for (const card of G.hand[player]) {
    value += evaluateCard(G, card, player, data);
  }

  if (G.hand[player].length >= 10) {
    value *= 0.5;
  } else if (G.hand[player].length === 9) {
    value *= 0.75;
  }

  return value;
}

// 盤面価値
export function evaluateState(
  G: GameState,
  _ctx: any,
  playerID: string,
): number {
  const me = Number(playerID);
  const opponent = me === 0 ? 1 : 0;
  const data = analyzeState(G, playerID);

  const myHandValue = evaluateHand(G, me, data) * 0.5;
  const opponentHandValue = evaluateHand(G, opponent, data);

  const boardValue =
    data.myPieces * 3 -
    data.opponentPieces * 2 +
    (data.myReach.length - data.opponentReach.length * 2) * 10 +
    (data.myLines - data.opponentLines) * 100 +
    myHandValue -
    opponentHandValue;
  return boardValue;
}

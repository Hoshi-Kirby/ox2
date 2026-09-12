import type { GameState } from "../MyGame";

import { canPlace, cardDefs } from "../../data";

type CPUAction = {
  move: string;
  args: any[];
};

const CPU_PLAYER = 1;

function randomItem<T>(array: T[]): T | null {
  if (array.length === 0) return null;

  return array[Math.floor(Math.random() * array.length)];
}

// コスト選択
function getRandomCostCard(G: GameState): number | null {
  const candidates: number[] = [];
  for (let i = 0; i < G.hand[CPU_PLAYER].length; i++) {
    if (i === G.activeCard) {
      continue;
    }
    if (G.faceDown[CPU_PLAYER][i]) {
      continue;
    }
    if (G.costCards.includes(i)) {
      continue;
    }
    candidates.push(i);
  }
  return randomItem(candidates);
}
// すべて版
function getHandCards(G: GameState): number[] {
  const candidates: number[] = [];

  for (let i = 0; i < G.hand[CPU_PLAYER].length; i++) {
    if (G.faceDown[CPU_PLAYER][i]) {
      continue;
    }

    const player = CPU_PLAYER;
    const faceUpCount = G.faceDown[player].filter((v) => v === false).length;

    const card = G.hand[player][i];
    const def = cardDefs[card.attr][card.index];

    const costFlip = def.costFlip + G.costChange[player];

    const costDiscard = def.costDiscard + Math.min(0, costFlip);

    const totalCost = costFlip + costDiscard + 1;

    if (faceUpCount >= totalCost) {
      candidates.push(i);
    }
  }

  return candidates;
}
// 通常の盤面から canPlace() が true の場所を取得
function getBoardTargets(G: GameState, ctx: any): any[] {
  const targets: any[] = [];
  const activeCardID = G.activeCardID;
  if (!activeCardID) {
    return targets;
  }

  for (let z = 0; z < 3; z++) {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (canPlace(G, ctx, x, y, z, activeCardID.attr, activeCardID.index)) {
          targets.push({
            row: y,
            col: x,
            index: null,
            indexH: null,
            indexV: null,
          });
        }
      }
    }
  }
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 3; z++) {
        if (
          canPlace(
            G,
            ctx,
            x + 1.5,
            y + 1.5,
            z,
            activeCardID.attr,
            activeCardID.index,
          )
        ) {
          targets.push({
            row: y + 1.5,
            col: x + 1.5,
            index: null,
            indexH: null,
            indexV: null,
          });
        }
      }
    }
  }
  return targets;
}
// selectTarget
export function getSelectTargetAction(G: GameState, ctx: any): CPUAction[] {
  const card = G.activeCardID;
  if (!card) {
    return [];
  }

  // des3
  if (card.attr === "des" && card.index === 3) {
    const enemy = 1 - CPU_PLAYER;
    const candidates: number[] = [];

    for (let i = 0; i < G.hand[enemy].length; i++) {
      candidates.push(i);
    }

    return candidates.map((index) => ({
      move: "registerTarget",
      args: [
        {
          row: null,
          col: null,
          index,
          indexH: null,
          indexV: null,
        },
      ],
    }));
  }
  // dis2
  if (card.attr === "dis" && card.index === 2) {
    const targets: any[] = [];

    for (let i = 0; i < 2; i++) {
      if (!G.firewall.horizontal[i]) {
        targets.push({
          row: null,
          col: null,
          index: null,
          indexH: i,
          indexV: null,
        });
      }
    }
    for (let i = 0; i < 2; i++) {
      if (!G.firewall.vertical[i]) {
        targets.push({
          row: null,
          col: null,
          index: null,
          indexH: null,
          indexV: i,
        });
      }
    }
    return targets.map((target) => ({
      move: "registerTarget",
      args: [target],
    }));
  }
  // その他
  const targets = getBoardTargets(G, ctx);

  return targets.map((target) => ({
    move: "registerTarget",
    args: [target],
  }));
}

// selectTarget2
export function getSelectTarget2Action(G: GameState, ctx: any): CPUAction[] {
  const card = G.activeCardID;

  if (!card) {
    return [];
  }
  // dis2
  if (card.attr === "dis" && card.index === 2) {
    const targets: any[] = [];

    for (let i = 0; i < 2; i++) {
      if (!G.firewall.horizontal[i]) {
        targets.push({
          row: null,
          col: null,
          index: null,
          indexH: i,
          indexV: null,
        });
      }
    }
    for (let i = 0; i < 2; i++) {
      if (!G.firewall.vertical[i]) {
        targets.push({
          row: null,
          col: null,
          index: null,
          indexH: null,
          indexV: i,
        });
      }
    }

    // const firstTarget = G.targets[0];

    // const filtered = targets.filter((target) => {
    //   if (!firstTarget) {
    //     return true;
    //   }

    //   if (
    //     target.indexH !== null &&
    //     firstTarget.indexH !== null &&
    //     target.indexH === firstTarget.indexH
    //   ) {
    //     return false;
    //   }

    //   if (
    //     target.indexV !== null &&
    //     firstTarget.indexV !== null &&
    //     target.indexV === firstTarget.indexV
    //   ) {
    //     return false;
    //   }

    //   return true;
    // });

    // const target = randomItem(filtered);

    if (!targets) {
      return [];
    }

    return [
      {
        move: "registerTarget",
        args: [targets],
      },
    ];
  }
  // sup2
  if (card.attr === "sup" && card.index === 2) {
    const targets: any[] = [];
    const firstTarget = G.targets[0];
    if (!firstTarget) {
      return [];
    }
    const { row, col } = firstTarget;
    if (row === null || col === null) {
      return [];
    }
    let dIndex = 0;
    const f = G.floor;
    if (Number.isInteger(col) && Number.isInteger(row)) {
      if (G.board[col][row][f] === 3) {
        dIndex = 10;
      }
    } else {
      const mx = col - 1.5;
      const my = row - 1.5;

      if (G.midBoard[mx][my][f] === 3) {
        dIndex = 10;
      } else {
        dIndex = 20;
      }
    }

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (x === col && y === row) {
          continue;
        }

        if (canPlace(G, ctx, x, y, f, card.attr, card.index + 10 + dIndex)) {
          targets.push({
            row: y,
            col: x,
            index: null,
            indexH: null,
            indexV: null,
          });
        }
      }
    }
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        const targetX = x + 1.5;
        const targetY = y + 1.5;
        if (targetX === col && targetY === row) {
          continue;
        }
        if (
          canPlace(
            G,
            ctx,
            targetX,
            targetY,
            f,
            card.attr,
            card.index + 10 + dIndex,
          )
        ) {
          targets.push({
            row: targetY,
            col: targetX,
            index: null,
            indexH: null,
            indexV: null,
          });
        }
      }
    }

    const target = randomItem(targets);

    if (!target) {
      return [];
    }

    return [
      {
        move: "registerTarget",
        args: [target],
      },
    ];
  }

  return [];
}

// CPU
// CPU
export function getCPUActions(G: GameState, ctx: any): CPUAction[] {
  const actions: CPUAction[] = [];
  if (Number(ctx.currentPlayer) !== CPU_PLAYER || G.cpuMove) {
    return [];
  }

  if (G.phase === "selectTarget") {
    return getSelectTargetAction(G, ctx);
  }

  if (G.phase === "selectTarget2") {
    return getSelectTarget2Action(G, ctx);
  }

  if (G.phase === "payCostFlip" || G.phase === "payCostDiscard") {
    const cardIndex = getRandomCostCard(G);

    if (cardIndex !== null) {
      actions.push({
        move: "useCard",
        args: [cardIndex],
      });
    }

    return actions;
  }

  actions.push({
    move: "endTurn",
    args: [],
  });

  if (G.phase === "idle") {
    const cardIndexes = getHandCards(G);

    for (const cardIndex of cardIndexes) {
      actions.push({
        move: "useCard",
        args: [cardIndex],
      });
    }

    return actions;
  }
  return actions;
}

import * as basic from "./moves/basic";
import type { CardID, Settings, SeName } from "../types";
import { getCPUActions } from "./ai/cpu";
import { Stage } from "boardgame.io/core";

type DeckKey = "deck0" | "deck1" | "deck2" | "deck3";
type Pos = {
  x: number; // 0〜4 or 1.5/2.5
  y: number; // 0〜4 or 1.5/2.5
  z: number; // 0〜2
};
export interface GameState {
  phase:
    | "idle"
    | "payCostFlip"
    | "payCostDiscard"
    | "selectTarget"
    | "selectTarget2";
  isPaused: boolean;
  pausedPlayer: number;
  firstPlayer: number;
  board: number[][][];
  midBoard: number[][][];
  firewall: {
    horizontal: boolean[];
    vertical: boolean[];
  };

  floor: number;
  onlineDeckP1: CardID[] | null;
  deck: [CardID[], CardID[]];
  hand: [CardID[], CardID[]];
  faceDown: [boolean[], boolean[]];

  activeCard: number | null;
  activeCardID: CardID | null;
  costCards: number[];
  targets: Array<{
    row: number | null;
    col: number | null;
    index: number | null;
    indexH: number | null;
    indexV: number | null;
  }>;
  costChange: number[];
  notFoundTurns: number[][][];
  firewallTurns: number[][];

  winner: number | null;
  winnerLines: Pos[][];
  animLog: {
    draw: [boolean, boolean];
    drawCount: number[];
    discardFlags: [boolean[], boolean[]];
    discardHand: [CardID[], CardID[]];
    discardFaceDown: [boolean[], boolean[]];
    flipFlags: [boolean[], boolean[]];
    unflipFlags: [boolean[], boolean[]];
    place: boolean[][][];
    remove: number[][][];
    placeMid: boolean[][][];
    removeMid: number[][][];
    costChange: number[];
  };
  placeCount: number[];
  moveCount: number[];
  removeCount: number[];
  isResult: boolean;

  cpuMove: boolean;
  cpuGameStart: boolean;
  seEvents: SeName[];
  gameStarted: boolean;
  roomEnded: boolean;
  gameRestart: boolean;
}

export function createMyGame(settings: Settings) {
  return {
    name: "ox2",
    setup: (
      { random }: { random: any },
      setupData?: Settings,
    ): GameState => {
      const gameSettings = setupData ?? settings;
      return createInitialState(gameSettings, random);
    },
    moves: {
      endTurn: (args: any) => basic.endTurn(args, !settings.ui.seEnabled),
      useCard: (args: any, cardIndex: number) =>
        basic.useCard(args, cardIndex, !settings.ui.seEnabled),
      registerTarget: (args: any, target: any) =>
        basic.registerTarget(args, target, !settings.ui.seEnabled),
      resetAnimLog: basic.resetAnimLog,
      openPause: basic.openPause,
      closePause: basic.closePause,
      endOnlineGame: basic.endOnlineGame,
      restartOnlineGame: basic.restartOnlineGame,
      openresult: basic.openresult,
      cpuCanMove: basic.cpuCanMove,
      reset: ({ G, ctx, random }: { G: GameState; ctx: any; random: any }) => {
        const onlineDeckP1 = G.onlineDeckP1;

        const initialState = createInitialState(settings, random, onlineDeckP1);

        Object.assign(G, initialState);
        G.onlineDeckP1 = onlineDeckP1;
        ctx.turn = 1;
        ctx.currentPlayer = initialState.firstPlayer;
        G.gameStarted = true;
      },
      startOnlineGame: (
        {
          G,
          ctx,
          random,
        }: {
          G: GameState;
          ctx: any;
          random: any;
        },
        deck1: CardID[],
      ) => {
        G.onlineDeckP1 = deck1;

        const initialState = createInitialState(
          settings,
          random,
          G.onlineDeckP1,
        );

        Object.assign(G, initialState);
        G.onlineDeckP1 = deck1;
        ctx.turn = 1;
        ctx.currentPlayer = initialState.firstPlayer;
        G.gameStarted = true;
      },
    },
    ai: {
      enumerate: (G: GameState, ctx: any, _playerID: string) => {
        return getCPUActions(G, ctx);
      },
    },

    turn: {
      order: {
        first: ({ G }: { G: GameState }) => G.firstPlayer,
        next: ({ ctx }: { ctx: any }) => {
          return (Number(ctx.currentPlayer) + 1) % 2;
        },
      },
      activePlayers: {
        all: Stage.NULL,
      },
      onBegin: ({
        G,
        ctx,
        random,
      }: {
        G: GameState;
        ctx: any;
        random: any;
      }) => {
        ctx.random = random;
        if (ctx.turn === 1) {
          return;
        }

        const player = ctx.currentPlayer;

        if (
          drawRandom(G.deck[player], G.hand[player], G.faceDown[player], random)
        ) {
          G.animLog.draw[player] = true;
          if (ctx.turn > 2) {
            if (
              drawRandom(
                G.deck[player],
                G.hand[player],
                G.faceDown[player],
                random,
              )
            ) {
              G.animLog.drawCount[player] = 2;
            }
          }
        }
      },
    },
  };
}

function createInitialState(
  settings: Settings,
  random: any,
  onlineDeckP1: CardID[] | null = null,
): GameState {
  let firstPlayer = settings.game.firstPlayer;

  if (firstPlayer === 2) {
    firstPlayer = random.Die(2) - 1;
  }

  const deckP0 = settings.game.selectedDeckP[0];
  const deckP1 = settings.game.selectedDeckP[1];

  let deck0 = [...settings.game[`deck${deckP0}` as DeckKey]];
  let deck1 =
    onlineDeckP1 !== null
      ? [...onlineDeckP1]
      : [...settings.game[`deck${deckP1}` as DeckKey]];

  if (!settings.game.shiftCardEnabled) {
    deck0 = deck0.map((card) => {
      if (card.index === 6) {
        return { ...card, index: 4 };
      }

      if (card.index === 7) {
        return { ...card, index: 5 };
      }

      return card;
    });

    deck1 = deck1.map((card) => {
      if (card.index === 6) {
        return { ...card, index: 4 };
      }

      if (card.index === 7) {
        return { ...card, index: 5 };
      }

      return card;
    });
  }

  const initialHandCount = settings.game.initialHand;

  const hand0: CardID[] = [];
  const hand1: CardID[] = [];
  const face: boolean[] = [];

  for (let i = 0; i < initialHandCount; i++) {
    drawRandom(deck0, hand0, face, random);
    drawRandom(deck1, hand1, face, random);
  }

  return {
    phase: "idle",
    isPaused: false,
    pausedPlayer: 0,
    firstPlayer,

    board: Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Array(3).fill(0)),
    ),
    midBoard: Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => Array(3).fill(0)),
    ),
    firewall: {
      horizontal: [false, false],
      vertical: [false, false],
    },

    floor: 0,
    onlineDeckP1: null,
    deck: [deck0, deck1],
    hand: [hand0, hand1],

    faceDown: [
      Array(hand0.length).fill(false),
      Array(hand1.length).fill(false),
    ],

    activeCard: null,
    activeCardID: null,
    costCards: [],
    targets: [],
    costChange: [0, 0],
    notFoundTurns: Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Array(3).fill(0)),
    ),
    firewallTurns: [
      [0, 0],
      [0, 0],
    ],

    winner: null,
    winnerLines: [],
    animLog: {
      draw: [false, false],
      drawCount: [1, 1],
      discardFlags: [[], []],
      discardHand: [[], []],
      discardFaceDown: [[], []],
      flipFlags: [[], []],
      unflipFlags: [[], []],
      place: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => Array(3).fill(false)),
      ),
      remove: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => Array(3).fill(0)),
      ),
      placeMid: Array.from({ length: 2 }, () =>
        Array.from({ length: 2 }, () => Array(3).fill(false)),
      ),
      removeMid: Array.from({ length: 2 }, () =>
        Array.from({ length: 2 }, () => Array(3).fill(0)),
      ),
      costChange: [0, 0],
    },
    placeCount: [0, 0],
    moveCount: [0, 0],
    removeCount: [0, 0],
    isResult: true,

    cpuMove: true,
    cpuGameStart: true,
    seEvents: [],
    gameStarted: !settings.game.isOnline,
    roomEnded: false,
    gameRestart: false,
  };
}

export function drawRandom(
  deck: CardID[],
  hand: CardID[],
  face: boolean[],
  random: any,
) {
  if (hand.length >= 10) {
    return false;
  }

  const idx = random.Die(deck.length) - 1;
  const card = deck.splice(idx, 1)[0];

  hand.push(card);
  face.push(false);
  return true;
}

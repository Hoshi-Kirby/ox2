import * as basic from "./moves/basic";
import type { CardID, Settings } from "../types";

type DeckKey = "deck0" | "deck1" | "deck2" | "deck3";

export interface GameState {
  phase: "idle" | "selectCard" | "payCost" | "selectTarget" | "resolve";
  isPaused: boolean;
  firstPlayer: number;
  board: number[][][];
  deck: [CardID[], CardID[]];
  hand: [CardID[], CardID[]];
  faceDown: [boolean[], boolean[]];

  activeCard: number | null;
  activeCardID: CardID | null;
  costCards: number[];
  targets: Array<{
    row?: number;
    col?: number;
    index?: number;
  }>;

  animLog: {
    draw: [boolean, boolean];
    discardFlags: [boolean[], boolean[]];
    flipFlags: [boolean[], boolean[]];
    unflipFlags: [boolean[], boolean[]];
    place: boolean[][][];
    remove: boolean[][][];
  };
}

export function createMyGame(settings: Settings) {
  return {
    setup: ({ random }: { random: any }): GameState => {
      return createInitialState(settings, random);
    },

    moves: {
      ...basic,

      reset: ({ G, random }: { G: GameState; random: any }) => {
        const initialState = createInitialState(settings, random);

        Object.assign(G, initialState);
      },
    },

    turn: {
      order: {
        first: ({ G }: { G: GameState }) => G.firstPlayer,
        next: ({ ctx }: { ctx: any }) => {
          return (Number(ctx.currentPlayer) + 1) % 2;
        },
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
        if (ctx.turn === 1) {
          return;
        }

        const player = ctx.currentPlayer;

        if (drawRandom(G.deck[player], G.hand[player], random)) {
          G.animLog.draw[player] = true;
          G.faceDown[player].push(false);
        }
      },
    },
  };
}

function createInitialState(settings: Settings, random: any): GameState {
  let firstPlayer = settings.game.firstPlayer;

  if (firstPlayer === 2) {
    firstPlayer = random.Die(2) - 1;
  }

  const deckP0 = settings.game.selectedDeckP[0];
  const deckP1 = settings.game.selectedDeckP[1];

  let deck0 = [...settings.game[`deck${deckP0}` as DeckKey]];

  let deck1 = [...settings.game[`deck${deckP1}` as DeckKey]];

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

  for (let i = 0; i < initialHandCount; i++) {
    drawRandom(deck0, hand0, random);
    drawRandom(deck1, hand1, random);
  }

  return {
    phase: "idle",
    isPaused: false,
    firstPlayer,

    board: Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Array(3).fill(0)),
    ),

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

    animLog: {
      draw: [false, false],
      discardFlags: [[], []],
      flipFlags: [[], []],
      unflipFlags: [[], []],
      place: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => Array(3).fill(false)),
      ),
      remove: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => Array(3).fill(false)),
      ),
    },
  };
}

function drawRandom(deck: CardID[], hand: CardID[], random: any) {
  if (hand.length >= 10) {
    return false;
  }

  const idx = random.Die(deck.length) - 1;
  const card = deck.splice(idx, 1)[0];

  hand.push(card);
  return true;
}

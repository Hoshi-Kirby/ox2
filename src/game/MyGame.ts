// src/game/MyGame.ts
import * as basic from "./moves/basic";
import type { CardID, Settings } from "../types";
type DeckKey = "deck0" | "deck1" | "deck2" | "deck3";

export interface GameState {
  phase: "idle" | "selectCard" | "payCost" | "selectTarget" | "resolve";
  board: number[][][];
  deck: [CardID[], CardID[]];
  hand: [CardID[], CardID[]];
  faceDown: [boolean[], boolean[]];

  activeCard: number | null; // 今使おうとしている手札の index
  activeCardID: CardID | null; //  activeCardの中身
  costCards: number[]; // コストとして選んだ手札 index（最大9枚）
  targets: Array<{
    row?: number; // 駒 or マス選択用
    col?: number; // 駒 or マス選択用
    index?: number; // カード選択用（相手の手札）
  }>;
}

export function createMyGame(settings: Settings) {
  return {
    setup: (): GameState => {
      const deckP0 = settings.game.selectedDeckP[0];
      const deckP1 = settings.game.selectedDeckP[1];
      const deck0 = [...settings.game[`deck${deckP0}` as DeckKey]];
      const deck1 = [...settings.game[`deck${deckP1}` as DeckKey]];
      const initialHandCount = settings.game.initialHand;
      const hand0: CardID[] = [];
      const hand1: CardID[] = [];
      for (let i = 0; i < initialHandCount; i++) {
        drawRandom(deck0, hand0);
        drawRandom(deck1, hand1);
      }
      return {
        phase: "idle",
        board: [
          [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ],
          [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ],
        ],
        deck: [deck0, deck1],
        hand: [hand0, hand1],
        faceDown: [
          Array(hand0.length).fill(false),
          Array(hand0.length).fill(false),
        ],

        activeCard: null,
        activeCardID: null,
        costCards: [],
        targets: [],
      };
    },

    moves: {
      ...basic,
    },
    turn: {
      onBegin: ({ G, ctx }: { G: GameState; ctx: any }) => {
        if (ctx.turn === 1) {
          return;
        }
        const player = ctx.currentPlayer;

        drawRandom(G.deck[player], G.hand[player]);
        G.faceDown[player].push(false);
      },
    },
  };
}
function drawRandom(deck: CardID[], hand: CardID[]) {
  if (hand.length >= 10) return; // 手札上限

  const idx = Math.floor(Math.random() * deck.length);
  const card = deck.splice(idx, 1)[0]; // 山札から抜く
  hand.push(card); // 手札に加える
}

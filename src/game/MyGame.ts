// src/game/MyGame.ts
import * as basic from "./moves/basic";
import type { CardID, Settings } from "../types";
type DeckKey = "deck0" | "deck1" | "deck2" | "deck3";

export interface GameState {
  board: number[][][];
  deck: [CardID[], CardID[]];
  hand: [CardID[], CardID[]];
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
      };
    },

    moves: {
      ...basic,
    },
  };
}
function drawRandom(deck: CardID[], hand: CardID[]) {
  if (hand.length >= 10) return; // 手札上限

  const idx = Math.floor(Math.random() * deck.length);
  const card = deck.splice(idx, 1)[0]; // 山札から抜く
  hand.push(card); // 手札に加える
}

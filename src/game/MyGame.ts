// src/game/MyGame.ts
import * as basic from "./moves/basic";
export interface GameState {
  board: number[][][];
}

export const MyGame = {
  setup: (): GameState => ({
    board: [
      [
        [2, 0, 0, 0, 1],
        [2, 0, 1, 0, 1],
        [2, 0, 1, 0, 1],
        [2, 2, 0, 0, 1],
        [2, 0, 0, 0, 1],
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
  }),

  moves: {
    ...basic,
  },
};

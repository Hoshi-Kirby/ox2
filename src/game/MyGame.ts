// src/game/MyGame.ts

export interface GameState {
  board: number[][];
  pieces: { x: number; y: number }[];
}

export const MyGame = {
  setup: (): GameState => ({
    board: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    pieces: [],
  }),

  moves: {
    placePiece(
      { G, ctx }: { G: GameState; ctx: any },
      pos: { x: number; y: number },
    ) {
      G.pieces.push(pos);
    },
  },
};

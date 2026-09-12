import type { GameState } from "../MyGame";
import { countPieces, findReach, checkWin } from "../moves/check.ts";

export function evaluateState(
  G: GameState,
  _ctx: any,
  playerID: string,
): number {
  const me = Number(playerID);
  const opponent = me === 0 ? 1 : 0;

  const myPieces = countPieces(G, me);
  const opponentPieces = countPieces(G, opponent);

  const myReach = findReach(G, me).length;
  const opponentReach = findReach(G, opponent).length;

  const myLines = checkWin(G, me).length;
  const opponentLines = checkWin(G, opponent).length;

  const myHand = getHandScore(G.hand[me].length);
  const opponentHand = getHandScore(G.hand[opponent].length);

  return (
    myPieces * 3 -
    opponentPieces * 2 +
    (myReach - opponentReach * 2) * 10 +
    (myLines - opponentLines) * 100 +
    (myHand - opponentHand)
  );
}

function getHandScore(handCount: number): number {
  if (handCount <= 8) {
    return handCount;
  }
  if (handCount === 9) {
    return 7;
  }
  return 5;
}

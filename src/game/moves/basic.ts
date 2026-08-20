import type { GameState } from "../MyGame";

// ターンエンド
export function endTurn({ events }: { events: any }) {
  events.endTurn();
}

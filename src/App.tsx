// import GameCanvas from "./GameCanvas";
// import { MyGame } from "./game/MyGame";

// export default function App() {
//   const gameState = MyGame.setup();
//   return <GameCanvas G={gameState} />;
// }
// App.tsx
import { Client } from "boardgame.io/react";
import { MyGame } from "./game/MyGame";
import GameCanvas from "./GameCanvas";

const GameClient = Client({
  game: MyGame,
  board: GameCanvas,
  debug: true, // ← 右側のデバッグタブを消す
  numPlayers: 2,
});

export default function App() {
  return <GameClient />;
}

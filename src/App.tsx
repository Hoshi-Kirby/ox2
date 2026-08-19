import GameCanvas from "./GameCanvas";
import { MyGame } from "./game/MyGame";

export default function App() {
  const gameState = MyGame.setup();
  return <GameCanvas G={gameState} />;
}

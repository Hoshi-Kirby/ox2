import { Client } from "boardgame.io/react";
import { MyGame } from "./game/MyGame";

export const GameClient = Client({
  game: MyGame,
});

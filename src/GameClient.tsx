import { useMemo } from "react";
import { Client } from "boardgame.io/react";
import type { Settings, Screen } from "./types";
import GameCanvas from "./GameCanvas";
import { createMyGame } from "./game/MyGame";

type GameClientProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  settings: Settings;
  frameRef: React.RefObject<HTMLCanvasElement | null>;
  uiRef: React.RefObject<HTMLCanvasElement | null>;
  worldRef: React.RefObject<HTMLCanvasElement | null>;
  effectRef: React.RefObject<HTMLCanvasElement | null>;
  emphaRef: React.RefObject<HTMLCanvasElement | null>;
  ratio: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  effectTimers: React.MutableRefObject<Record<string, number>>;
  animStateRef: React.MutableRefObject<{
    active: boolean;
    frame: number;
    maxFrames: number;
  }>;
};

export default function GameClient({
  setScreen,
  settings,
  frameRef,
  uiRef,
  worldRef,
  effectRef,
  emphaRef,
  ratio,
  mouseRef,
  effectTimers,
  animStateRef,
}: GameClientProps) {
  const ClientComponent = useMemo(() => {
    const Board = (boardProps: any) => (
      <GameCanvas
        {...boardProps}
        settings={settings}
        setScreen={setScreen}
        frameRef={frameRef}
        uiRef={uiRef}
        worldRef={worldRef}
        effectRef={effectRef}
        emphaRef={emphaRef}
        ratio={ratio}
        mouseRef={mouseRef}
        effectTimers={effectTimers}
        animStateRef={animStateRef}
      />
    );

    return Client({
      game: createMyGame(settings),
      board: Board,
      numPlayers: 2,
      debug: true,
    });
  }, [settings]);

  return <ClientComponent />;
}

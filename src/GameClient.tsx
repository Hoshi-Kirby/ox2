import { useMemo, useRef } from "react";
import { Client } from "boardgame.io/react";
import type { Settings, Screen, HoverUI, PressTimers } from "./types";
import GameCanvas from "./GameCanvas";
import { createMyGame } from "./game/MyGame";

type GameClientProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  settings: Settings;
  hoverStates: HoverUI;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  pressTimers: React.MutableRefObject<PressTimers>;
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
  hoverStates,
  setHoverStates,
  pressTimers,
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
  const hoverStatesRef = useRef(hoverStates);
  const ratioRef = useRef(ratio);

  hoverStatesRef.current = hoverStates;
  ratioRef.current = ratio;
  const ClientComponent = useMemo(() => {
    const Board = (boardProps: any) => (
      <GameCanvas
        {...boardProps}
        settings={settings}
        hoverStates={hoverStatesRef.current}
        setHoverStates={setHoverStates}
        pressTimers={pressTimers}
        setScreen={setScreen}
        frameRef={frameRef}
        uiRef={uiRef}
        worldRef={worldRef}
        effectRef={effectRef}
        emphaRef={emphaRef}
        ratio={ratioRef.current}
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

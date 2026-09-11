import { useMemo, useRef } from "react";
import { Client } from "boardgame.io/react";
import type { Settings, Help, Screen, HoverUI, PressTimers } from "./types";
import GameCanvas from "./GameCanvas";
import { createMyGame } from "./game/MyGame";
import { MyBot } from "./game/ai/bot";
import { Local } from "boardgame.io/multiplayer";

type GameClientProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  helpRef: React.MutableRefObject<Help>;
  settings: Settings;
  hoverStates: HoverUI;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  isTouching: React.MutableRefObject<boolean>;
  pressTimers: React.MutableRefObject<PressTimers>;
  frameRef: React.RefObject<HTMLCanvasElement | null>;
  uiRef: React.RefObject<HTMLCanvasElement | null>;
  worldRef: React.RefObject<HTMLCanvasElement | null>;
  worldEffectRef: React.RefObject<HTMLCanvasElement | null>;
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
  helpRef,
  settings,
  hoverStates,
  setHoverStates,
  isTouching,
  pressTimers,
  frameRef,
  uiRef,
  worldRef,
  worldEffectRef,
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
        helpRef={helpRef}
        settings={settings}
        hoverStates={hoverStatesRef.current}
        setHoverStates={setHoverStates}
        isTouching={isTouching}
        pressTimers={pressTimers}
        setScreen={setScreen}
        frameRef={frameRef}
        uiRef={uiRef}
        worldRef={worldRef}
        worldEffectRef={worldEffectRef}
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
      debug: false,
      multiplayer: settings.game.isCPU
        ? Local({
            bots: {
              1: MyBot,
            },
          })
        : Local(),
    });
  }, [settings]);

  return <ClientComponent playerID="0" />;
}

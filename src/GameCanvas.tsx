// src/GameCanvas.tsx
import { useRef, useEffect, useState } from "react";
import { renderFrame } from "./canvas/rendererFrame";
import { renderEffect } from "./canvas/rendererEffects";
import { renderEmpha } from "./canvas/rendererEmpha";
import { renderUI } from "./canvas/rendererUI";
import { renderGame } from "./canvas/rendererGame";
import { renderGameEffect } from "./canvas/rendererGameEffects";
import { audioAssets } from "./audio/assets";
import { playBgm, startBgm, stopBgm } from "./audio/audioManager";
import { createGameClickHandler } from "./hitTest/gameClickHandler";
import { createGameHoverHandler } from "./hitTest/gameHoverHandler";
import type { Settings, CardID, HoverUI, PressTimers, Screen } from "./types";
import type { GameState } from "./game/MyGame";

import "./MenuScreen.css";

export default function GameCanvas({
  G,
  ctx,
  moves,
  playerID,
  settings,
  hoverStates,
  setHoverStates,
  pressTimers,
  setScreen,
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
}: {
  G: GameState;
  ctx: any;
  moves: any;
  playerID: string;
  settings: Settings;
  hoverStates: HoverUI;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  pressTimers: React.MutableRefObject<PressTimers>;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  frameRef: React.MutableRefObject<HTMLCanvasElement | null>;
  uiRef: React.MutableRefObject<HTMLCanvasElement | null>;
  worldRef: React.MutableRefObject<HTMLCanvasElement | null>;
  worldEffectRef: React.MutableRefObject<HTMLCanvasElement | null>;
  effectRef: React.MutableRefObject<HTMLCanvasElement | null>;
  emphaRef: React.MutableRefObject<HTMLCanvasElement | null>;
  ratio: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  effectTimers: React.MutableRefObject<Record<string, number>>;
  animStateRef: React.MutableRefObject<{
    active: boolean;
    frame: number;
    maxFrames: number;
  }>;
}) {
  const [ready, setReady] = useState(false);
  const screen: Screen = "game";
  const hoverStatesRef = useRef(hoverStates);

  useEffect(() => {
    hoverStatesRef.current = hoverStates;
  }, [hoverStates]);

  // frame：screen が変わったときだけ描く
  useEffect(() => {
    const canvas = frameRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    renderFrame(ctx, screen);
  }, [screen]);
  // game Gが変わったときにアニメーションを描く
  useEffect(() => {
    animStateRef.current.active = true;
    animStateRef.current.frame = 0;
  }, [G, ctx.turn, ctx.phase, ctx.currentPlayer, ratio, screen]);
  // ui：screen、ホバーステータスが変わったときだけ描く
  useEffect(() => {
    const canvas = uiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    renderUI(ctx, ratio, screen, effectTimers.current, hoverStatesRef.current);
  }, [screen, ratio, hoverStates]);
  // effect,empha：毎フレーム描く（アニメーション）
  useEffect(() => {
    const effectCanvas = effectRef.current;
    const emphaCanvas = emphaRef.current;
    const gameCanvas = worldRef.current;
    const gameEffectCanvas = worldEffectRef.current;

    if (!effectCanvas || !emphaCanvas || !gameCanvas || !gameEffectCanvas)
      return;

    const effectCtx = effectCanvas.getContext("2d")!;
    const emphaCtx = emphaCanvas.getContext("2d")!;
    const gameCtx = gameCanvas.getContext("2d")!;
    const gameEffectCtx = gameEffectCanvas.getContext("2d")!;

    let running = true;
    let lastTime = performance.now();

    function loop(now: number) {
      if (!running) return;

      const dt = now - lastTime;
      lastTime = now;

      const gameAnim = animStateRef.current;

      if (gameAnim.active) {
        renderGame(
          gameCtx,
          ratio,
          screen,
          effectTimers.current,
          dt,
          hoverStatesRef.current,
          settings,
          G,
          ctx,
          playerID,
        );

        gameAnim.frame++;
        if (
          gameAnim.frame >= gameAnim.maxFrames &&
          effectTimers.current.gameStartCount == 0
        ) {
          gameAnim.active = false;
        }
      }

      // empha レイヤーの描画
      renderEmpha(
        emphaCtx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
        settings,
      );

      // effect レイヤーの描画
      renderEffect(
        effectCtx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
        settings,
      );
      renderGameEffect(
        gameEffectCtx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
        settings,
        G,
        ctx,
        playerID,
      );
      if (!ready) {
        const canvas = frameRef.current;
        const canvas2 = uiRef.current;
        if (!canvas || !canvas2) return;
        const ctx = canvas.getContext("2d")!;
        const ctx2 = canvas2.getContext("2d")!;
        renderFrame(ctx, screen);
        renderUI(
          ctx2,
          ratio,
          screen,
          effectTimers.current,
          hoverStatesRef.current,
        );
        setReady(true);
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      running = false;
    };
  }, [G, ctx.turn, ctx.phase, ctx.currentPlayer, ratio, screen]);

  // クリック判定
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const onClickBoard = createGameClickHandler({
      ratio,
      screen,
      setScreen,
      effectTimers: effectTimers.current,
      settings,
      G,
      ctx,
      moves,
      playerID,
    });

    const listener = (e: MouseEvent) => {
      onClickBoard(e, canvas);
    };

    canvas.addEventListener("click", listener);
    return () => canvas.removeEventListener("click", listener);
  }, [ratio, screen]);

  // ホバー判定
  useEffect(() => {
    const stopGameHover = createGameHoverHandler({
      ratio,
      screen,
      mouseRef,
      hoverStatesRef,
      setHoverStates,
      settings,
      pressTimers: pressTimers.current,
      effectTimers: effectTimers.current,
      G,
      ctx,
      playerID,
    });

    return () => {
      stopGameHover();
    };
  }, [ratio, screen, settings.ui.deviceMode]);

  // マウス座標
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const updatePos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    canvas.addEventListener("pointerdown", updatePos);
    canvas.addEventListener("pointermove", updatePos);

    return () => {
      canvas.removeEventListener("pointerdown", updatePos);
      canvas.removeEventListener("pointermove", updatePos);
    };
  }, []);

  // BGM
  useEffect(() => {
    let bgm = audioAssets.bgmMenu;
    switch (screen) {
      case "game":
        bgm = audioAssets.bgmGame;
        break;
    }

    playBgm(bgm);

    if (settings.ui.bgmEnabled) {
      startBgm();
    } else {
      stopBgm();
    }
  }, [screen]);

  return (
    <div className="canvas-container">
      <canvas
        ref={frameRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
      <canvas
        ref={emphaRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
      <canvas
        ref={worldRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
      <canvas
        ref={worldEffectRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
      <canvas
        ref={uiRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
      <canvas
        ref={effectRef}
        width={1280}
        height={720}
        className="layer"
        style={{
          width: ratio < 1280 / 720 ? "auto" : "100vw",
          height: ratio < 1280 / 720 ? "100vh" : "auto",
        }}
      />
    </div>
  );
}

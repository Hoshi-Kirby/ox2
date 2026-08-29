// src/MenuScreen.tsx
import { useRef, useEffect, useState } from "react";
import { renderFrame } from "./canvas/rendererFrame";
import { renderEffect } from "./canvas/rendererEffects";
import { renderEmpha } from "./canvas/rendererEmpha";
import { renderUI } from "./canvas/rendererUI";
import { audioAssets } from "./audio/assets";
import { playBgm, startBgm, stopBgm } from "./audio/audioManager";
import { createClickHandler } from "./hitTest/clickHandler";
import { createHoverHandler } from "./hitTest/hoverHandler";
import { createScrollHandler } from "./hitTest/scrollHandler";
import type {
  Screen,
  Settings,
  HoverUI,
  PressTimers,
  DeckColor,
} from "./types";

import "./MenuScreen.css";

export default function MenuScreen({
  screen,
  setScreen,
  settingsRef,
  hoverStates,
  setHoverStates,
  pressTimers,
  ratio,
  mouseRef,
  frameRef,
  uiRef,
  worldRef,
  effectRef,
  emphaRef,
  effectTimers,
  bgmEnabled,
  setBgmEnabled,
}: {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  settingsRef: React.MutableRefObject<Settings>;
  hoverStates: HoverUI;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  pressTimers: React.MutableRefObject<PressTimers>;
  ratio: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  frameRef: React.MutableRefObject<HTMLCanvasElement | null>;
  uiRef: React.MutableRefObject<HTMLCanvasElement | null>;
  worldRef: React.MutableRefObject<HTMLCanvasElement | null>;
  effectRef: React.MutableRefObject<HTMLCanvasElement | null>;
  emphaRef: React.MutableRefObject<HTMLCanvasElement | null>;
  effectTimers: React.MutableRefObject<Record<string, number>>;
  bgmEnabled: boolean;
  setBgmEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [ready, setReady] = useState(false);
  const [deckName, setDeckName] = useState(
    settingsRef.current.game.editDeckName,
  );

  const [openDeckList, setOpenDeckList] = useState(
    settingsRef.current.ui.openDeckList,
  );

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

    if (!effectCanvas || !emphaCanvas || !gameCanvas) return;

    const effectCtx = effectCanvas.getContext("2d")!;
    const emphaCtx = emphaCanvas.getContext("2d")!;

    let running = true;
    let lastTime = performance.now();

    function loop(now: number) {
      if (!running) return;

      const dt = now - lastTime;
      lastTime = now;

      // empha レイヤーの描画
      renderEmpha(
        emphaCtx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
        settingsRef.current,
      );

      // effect レイヤーの描画
      renderEffect(
        effectCtx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
        settingsRef.current,
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
  }, [ratio, screen]);

  // クリック判定
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const onClick = createClickHandler({
      ratio,
      screen,
      setScreen,
      effectTimers: effectTimers.current,
      settingsRef,
      setBgmEnabled,
      setDeckName,
      setOpenDeckList,
    });

    const listener = (e: MouseEvent) => {
      onClick(e, canvas);
    };

    canvas.addEventListener("click", listener);
    return () => canvas.removeEventListener("click", listener);
  }, [ratio, screen]);

  // ホバー判定
  useEffect(() => {
    const stopUIHover = createHoverHandler({
      ratio,
      screen,
      mouseRef,
      hoverStatesRef,
      setHoverStates,
      settingsRef,
      pressTimers: pressTimers.current,
    });

    return () => {
      stopUIHover();
    };
  }, [ratio, screen, settingsRef.current.ui.deviceMode]);

  // スクロール判定
  useEffect(() => {
    if (!effectRef.current) return;

    const cleanup = createScrollHandler({
      canvas: effectRef.current,
      settingsRef: settingsRef.current,
    });

    return cleanup;
  }, []);

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
      case "title":
        bgm = audioAssets.bgmTitle;
        break;
      case "menu":
        bgm = audioAssets.bgmMenu;
        break;
      case "make":
        bgm = audioAssets.bgmMake;
        break;

      case "game":
        bgm = audioAssets.bgmGame;
        break;
    }

    playBgm(bgm);

    if (settingsRef.current.ui.bgmEnabled) {
      startBgm();
    } else {
      stopBgm();
    }
  }, [screen, bgmEnabled]);

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
      {screen === "make" && (ratio > 1.2 || openDeckList) && (
        <input
          type="text"
          className="game-text-input"
          value={deckName}
          maxLength={5}
          onFocus={(e) => {
            settingsRef.current.ui.isInputActive = true;
            settingsRef.current.ui.inputCursorPosition =
              e.currentTarget.selectionStart ?? 0;
          }}
          onBlur={() => {
            settingsRef.current.ui.isInputActive = false;
          }}
          onChange={(e) => {
            const value = e.target.value;

            setDeckName(value);
            settingsRef.current.game.editDeckName = value;
            settingsRef.current.ui.inputCursorPosition =
              e.currentTarget.selectionStart ?? value.length;
          }}
          onSelect={(e) => {
            settingsRef.current.ui.inputCursorPosition =
              e.currentTarget.selectionStart ?? 0;
          }}
        />
      )}
    </div>
  );
}

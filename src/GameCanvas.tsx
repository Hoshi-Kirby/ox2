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
import type { Help, Settings, HoverUI, PressTimers, Screen } from "./types";
import type { GameState } from "./game/MyGame";
import { playSe as playAudioSe } from "./audio/audioManager";

import "./MenuScreen.css";

export default function GameCanvas({
  G,
  ctx,
  moves,
  playerID,
  matchData,
  helpRef,
  settings,
  hoverStates,
  setHoverStates,
  isTouching,
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
  onlineMatch,
  selectedOnlineDeckRef,
}: {
  G: GameState;
  ctx: any;
  moves: any;
  playerID: string;
  matchData: {
    id: number;
    name?: string;
    isConnected?: boolean;
  }[];
  helpRef: React.MutableRefObject<Help>;
  settings: Settings;
  hoverStates: HoverUI;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  isTouching: React.MutableRefObject<boolean>;
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
  onlineMatch: any;
  selectedOnlineDeckRef: React.MutableRefObject<number>;
}) {
  const [ready, setReady] = useState(false);
  const screen: Screen = "game";
  const hoverStatesRef = useRef(hoverStates);
  const lastSeCountRef = useRef(0);
  const opponentConnectedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    hoverStatesRef.current = hoverStates;
  }, [hoverStates]);
  useEffect(() => {
    if (!settings.game.isCPU) return;
    if (!G.cpuMove) return;
    if (G.cpuGameStart) return;

    effectTimers.current.Gchange = 400;
    const timer = setTimeout(() => {
      effectTimers.current.cpuG = 500;
      moves.cpuCanMove();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [G.cpuMove]);
  // オンラインアニメ
  useEffect(() => {
    if (settings.game.isOnline && ctx.currentPlayer != Number(playerID)) {
      effectTimers.current.Gchange = 400;
    }
  }, [G, ctx.currentPlayer]);
  useEffect(() => {
    if (settings.game.isOnline) {
      effectTimers.current.turnStart = 400;
    }
  }, [ctx.currentPlayer]);
  useEffect(() => {
    if (settings.game.isOnline && G.gameStarted) {
      if (settings.ui.seEnabled) {
        playAudioSe("seStart"); //se
      }
      effectTimers.current.fadeIn = 300;
      effectTimers.current.fadeInG = 300;
      effectTimers.current.fadeOut = 600;
      setTimeout(() => {
        effectTimers.current.fadeOut = 400;
        effectTimers.current.gameStartAnim = 300;
        effectTimers.current.gameStartCount = 4800;
      }, 300);
    }
  }, [G.gameStarted]);

  // リスタート
  useEffect(() => {
    if (G.pausedPlayer != Number(playerID)) {
      if (G.gameRestart) {
        effectTimers.current.fadeIn = 300;
        effectTimers.current.fadeOut = 600;
        if (settings.ui.seEnabled) {
          playAudioSe("seStart");
        }

        setTimeout(() => {
          effectTimers.current.fadeOut = 300;
          effectTimers.current.gameStartAnim = 300;
          effectTimers.current.gameStartCount = 4500;
          effectTimers.current.Gchange = 0;
        }, 300);
      }
    }
  }, [G.gameRestart]);
  // おわる
  useEffect(() => {
    if (G.pausedPlayer != Number(playerID)) {
      if (G.roomEnded) {
        effectTimers.current.fadeIn = 300;
        effectTimers.current.fadeOut = 600;
        if (settings.ui.seEnabled) {
          playAudioSe("seBack");
        }

        setTimeout(() => {
          if (settings.game.isOnline) {
            setScreen("menuOnline");
          } else {
            setScreen("menuOffline");
          }
          effectTimers.current.fadeOut = 300;
          effectTimers.current.gameStartAnim = 300;
          effectTimers.current.gameStartCount = 4500;
        }, 300);
      }
    }
  }, [G.roomEnded]);
  // アラート
  useEffect(() => {
    const opponent = matchData.find((player) => String(player.id) !== playerID);

    if (!opponent?.name) return;

    const connected = opponent.isConnected;

    if (opponentConnectedRef.current !== undefined) {
      if (opponentConnectedRef.current === true && connected === false) {
        alert("相手が離席しました。");
      }

      if (opponentConnectedRef.current === false && connected === true) {
        alert("相手が再接続しました。");
      }
    }

    opponentConnectedRef.current = connected;
  }, [matchData, playerID]);
  // 勝利
  useEffect(() => {
    if (G.winner !== null) {
      effectTimers.current.finish = 1000;
      effectTimers.current.result = 2000;
      if (settings.ui.seEnabled) {
        playAudioSe("seKO");
        const timer1 = setTimeout(() => {
          playAudioSe("seDon");
        }, 1400);

        const timer2 = setTimeout(() => {
          playAudioSe("seDon");
        }, 1900);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [G.winner]);

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

      let dt = now - lastTime;
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
          onlineMatch?.matchID,
        );

        gameAnim.frame++;
        if (
          gameAnim.frame >= gameAnim.maxFrames &&
          effectTimers.current.gameStartCount == 0
        ) {
          gameAnim.active = false;
        }
      }

      // 開始時CPU動かないよ
      if (
        G.cpuMove &&
        G.cpuGameStart &&
        effectTimers.current.gameStartCount == 0
      ) {
        moves.cpuCanMove();
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
        helpRef.current,
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
        helpRef.current,
        selectedOnlineDeckRef.current,
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
      helpRef,
      G,
      ctx,
      moves,
      playerID,
      matchID: onlineMatch?.matchID,
      selectedOnlineDeckRef,
    });

    const onPointerDown = () => {
      isTouching.current = true;
    };

    const onPointerUp = () => {
      isTouching.current = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);

    const listener = (e: MouseEvent) => {
      onClickBoard(e, canvas);
    };

    canvas.addEventListener("click", listener);
    return () => {
      canvas.removeEventListener("click", listener);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, [ratio, screen, G, ctx.turn, ctx.phase, ctx.currentPlayer]);

  // ホバー判定
  useEffect(() => {
    const stopGameHover = createGameHoverHandler({
      ratio,
      screen,
      mouseRef,
      hoverStatesRef,
      setHoverStates,
      settings,
      helpRef: helpRef.current,
      isTouching,
      pressTimers: pressTimers.current,
      effectTimers: effectTimers.current,
      G,
      playerID,
    });

    return () => {
      stopGameHover();
    };
  }, [
    ratio,
    screen,
    settings.ui.deviceMode,
    G,
    ctx.turn,
    ctx.phase,
    ctx.currentPlayer,
  ]);

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
        if (G.gameStarted) {
          bgm = audioAssets.bgmGame;
        }
        break;
    }

    playBgm(bgm);

    if (settings.ui.bgmEnabled) {
      startBgm();
    } else {
      stopBgm();
    }
  }, [screen, G.gameStarted]);

  // se
  useEffect(() => {
    const events = G.seEvents;
    for (let i = lastSeCountRef.current; i < events.length; i++) {
      playAudioSe(events[i]);
    }
    lastSeCountRef.current = events.length;
  }, [G.seEvents]);

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

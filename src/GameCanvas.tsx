// src/GameCanvas.tsx
import { useRef, useEffect, useState } from "react";
import { renderFrame } from "./canvas/rendererFrame";
import { renderEffect } from "./canvas/rendererEffects";
import { renderUI } from "./canvas/rendererUI";
import "./GameCanvas.css";
export default function GameCanvas() {
  const frameRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<HTMLCanvasElement>(null);
  const effectTimers = useRef<Record<string, number>>({
    fadeOut: 0,
    fadeIn: 0,
    leftWhiteSlide: 0,
  });
  const hoverStates = useRef<Record<string, boolean>>({
    startButton: false,
  });

  const pressTimers = useRef<Record<string, number>>({
    startButton: 0,
  });

  const [screen, setScreen] = useState<
    "title" | "menu" | "menu2" | "help" | "game" | "make" | "result"
  >("title");

  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [deviceMode, setDeviceMode] = useState<"mouse" | "touch">("touch");

  useEffect(() => {
    const onResize = () => {
      setRatio(window.innerWidth / window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const block = (e: Event) => e.preventDefault();

    canvas.addEventListener("contextmenu", block);
    canvas.addEventListener("selectstart", block); // テキスト選択開始も潰す

    return () => {
      canvas.removeEventListener("contextmenu", block);
      canvas.removeEventListener("selectstart", block);
    };
  }, []);

  // frame：screen が変わったときだけ描く
  useEffect(() => {
    const canvas = frameRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    renderFrame(ctx, screen);
  }, [screen]);

  // ui：screen が変わったとき最初だけマイフレーム描く
  useEffect(() => {
    const canvas = uiRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    renderUI(ctx, ratio, screen, effectTimers.current, hoverStates.current);
  }, [ratio, screen, mouse]);

  // effect：毎フレーム描く（アニメーション）
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let running = true;
    let lastTime = performance.now();

    function loop(now: number) {
      if (!running) return;

      const dt = now - lastTime;
      lastTime = now;
      updateEffectsTimer(dt, effectTimers.current);
      detectHover(
        dt,
        mouse,
        ratio,
        deviceMode,
        pressTimers.current,
        hoverStates.current,
      );

      renderEffect(ctx, ratio, screen, effectTimers.current, dt);

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      running = false;
    };
  }, [ratio, screen, mouse]);

  // クリック判定
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (isInsideStartButton(x, y, ratio)) {
        effectTimers.current.fadeIn = 300;
        effectTimers.current.fadeOut = 600;

        setTimeout(() => {
          setScreen("menu");
          effectTimers.current.fadeOut = 300;
        }, 300);
      }
    };

    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [ratio]);

  // ホバー判定
  function detectHover(
    dt: number,
    mouse: { x: number; y: number },
    ratio: number,
    deviceMode: "mouse" | "touch",
    pressTimers: Record<string, number>,
    hoverStates: Record<string, boolean>,
  ) {
    const x = mouse.x;
    const y = mouse.y;
    // PC（マウス）
    if (deviceMode === "mouse") {
      hoverStates.startButton = isInsideStartButton(x, y, ratio);
    }
    // スマホ（タッチ）
    if (deviceMode === "touch") {
      if (isInsideStartButton(x, y, ratio)) {
        pressTimers.startButton += dt;
        if (pressTimers.startButton > 300) {
          hoverStates.startButton = true;
        }
      } else {
        pressTimers.startButton = 0;
        hoverStates.startButton = false;
      }
    }
  }

  // マウス座標
  useEffect(() => {
    const canvas = effectRef.current;
    if (!canvas) return;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      setMouse({
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      });
    };

    canvas.addEventListener("pointermove", onMove);
    return () => canvas.removeEventListener("pointermove", onMove);
  }, []);

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
    </div>
  );
}
function updateEffectsTimer(dt: number, timers: Record<string, number>) {
  for (const key in timers) {
    if (timers[key] > 0) {
      timers[key] -= dt;
      if (timers[key] < 0) timers[key] = 0;
    }
  }
}
function isInsideStartButton(x: number, y: number, ratio: number): boolean {
  const canvasW = 1280;
  const canvasH = 720;
  const canvasRatio = canvasW / canvasH;

  let W, H, dx, dy;
  if (ratio > canvasRatio) {
    W = 1280;
    H = W / ratio;
    dy = (720 - H) / 2;
    dx = 0;
  } else {
    H = 720;
    W = H * ratio;
    dx = (1280 - W) / 2;
    dy = 0;
  }

  const layoutIsWide = ratio > 1.2;
  let btnW, btnH;
  if (layoutIsWide) {
    btnH = H * 0.06;
    btnW = btnH / 0.23;
  } else {
    btnW = W * 0.4;
    btnH = btnW * 0.23;
  }

  const btnX = dx + W * 0.5 - btnW / 2;
  const btnY = dy + H * 0.65;

  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}

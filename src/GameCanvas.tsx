// src/GameCanvas.tsx
import { useRef, useEffect, useState } from "react";
import { renderFrame } from "./canvas/rendererFrame";
import { renderEffect } from "./canvas/rendererEffects";
import { renderUI } from "./canvas/rendererUI";
import { assets } from "./canvas/assets";
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

  type HoverUI = {
    startButton: boolean;
    back: boolean;
    menu: boolean[];
  };

  const [hoverStates, setHoverStates] = useState<HoverUI>({
    startButton: false,
    back: false,
    menu: Array(5).fill(false),
  });

  type PressTimers = {
    startButton: number;
  };

  const pressTimers = useRef<PressTimers>({
    startButton: 0,
  });

  const hoverStatesRef = useRef(hoverStates);

  const [screen, setScreen] = useState<
    "title" | "menu" | "menu2" | "help" | "game" | "make" | "result"
  >("title");

  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [deviceMode, setDeviceMode] = useState<"mouse" | "touch">("mouse");

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

  // ui：screen が変わったとき最初だけマイフレーム描く
  useEffect(() => {
    const canvas = uiRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    renderUI(ctx, ratio, screen, effectTimers.current, hoverStates);
  }, [ratio, screen, hoverStates]);

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

      renderEffect(
        ctx,
        ratio,
        screen,
        effectTimers.current,
        dt,
        hoverStatesRef.current,
      );

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

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (isInsideStartButton(x, y, ratio)) {
        if (screen === "title") {
          effectTimers.current.fadeIn = 300;
          effectTimers.current.fadeOut = 600;

          setTimeout(() => {
            setScreen("menu");
            effectTimers.current.fadeOut = 300;
          }, 300);
        }
      }
    };

    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [ratio, screen]);

  // ホバー判定
  useEffect(() => {
    let running = true;
    let lastTime = performance.now();
    let dt = 0;
    function hoverLoop(now: number) {
      if (!running) return;
      dt = now - lastTime;
      lastTime = now;
      const { x, y } = mouseRef.current;

      // start
      const insideStart = isInsideStartButton(x, y, ratio);
      if (deviceMode === "mouse") {
        if (hoverStatesRef.current.startButton !== insideStart) {
          setHoverStates((prev) => ({ ...prev, startButton: insideStart }));
        }
      } else {
        if (insideStart) {
          if (typeof pressTimers.current.startButton === "number") {
            pressTimers.current.startButton += dt;
            if (
              pressTimers.current.startButton > 300 &&
              !hoverStatesRef.current.startButton
            ) {
              setHoverStates((prev) => ({ ...prev, startButton: true }));
            }
          }
        } else {
          pressTimers.current.startButton = 0;
          if (hoverStatesRef.current.startButton) {
            setHoverStates((prev) => ({ ...prev, startButton: false }));
          }
        }
      }
      // menu
      for (let i = 0; i < hoverStates.menu.length; i++) {
        const insideMenu = isInsideMenuButton(i, x, y, ratio);

        if (deviceMode === "mouse") {
          if (hoverStatesRef.current.menu[i] !== insideMenu) {
            setHoverStates((prev) => ({
              ...prev,
              menu: prev.menu.map((v, idx) => (idx === i ? insideMenu : v)),
            }));
          }
        }
      }
      // back
      const insideBack = isInsideBackButton(x, y, ratio);
      if (deviceMode === "mouse") {
        if (hoverStatesRef.current.back !== insideBack) {
          setHoverStates((prev) => ({ ...prev, back: insideBack }));
        }
      }

      requestAnimationFrame(hoverLoop);
    }

    requestAnimationFrame(hoverLoop);

    return () => {
      running = false;
    };
  }, [ratio, deviceMode]);

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
function isInsideMenuButton(
  index: number,
  x: number,
  y: number,
  ratio: number,
): boolean {
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
  let baseX = dx + W * 0.01;
  const baseY = dy + H * 0.1;
  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);
  let offsetX = H * 0.053;
  if (!layoutIsWide) {
    btnW = H * 0.4;
    baseX = dx + W * 0.5 - btnW / 2;
    offsetX = 0;
  }
  const offsetY = H * 0.15;
  const btnX = baseX + offsetX * index;
  const btnY = baseY + offsetY * index;
  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}
function isInsideBackButton(x: number, y: number, ratio: number): boolean {
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
  let baseX = dx + W * 0.01;
  const baseY = dy + H * 0.1;
  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);
  const offsetY = H * 0.15;
  const backX = baseX - H * 0.15;
  const backY = baseY + offsetY * 5 - H * 0.03;
  return x >= backX && x <= backX + btnW && y >= backY && y <= backY + btnH;
}

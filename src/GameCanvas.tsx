// src/GameCanvas.tsx
import { useRef, useEffect, useState } from "react";
import { renderFrame } from "./canvas/rendererFrame";
import "./GameCanvas.css";
export default function GameCanvas() {
  const frameRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<HTMLCanvasElement>(null);

  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setRatio(window.innerWidth / window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = frameRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderFrame(ctx);
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

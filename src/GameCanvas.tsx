// src/GameCanvas.tsx
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
import "./GameCanvas.css";
export type Screen =
  | "title"
  | "menu"
  | "menuOffline"
  | "menuHelp"
  | "menuDeck"
  | "menuSetting"
  | "help"
  | "game"
  | "make"
  | "result";
export type DeckColor =
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "rainbow"
  | "white";

export type CardID = {
  attr: "des" | "gen" | "dis" | "sup";
  index: number;
};

export type Settings = {
  ui: {
    bgmEnabled: boolean;
    seEnabled: boolean;
    deviceMode: "mouse" | "touch";
    deckSelected: number;
    inputLocked: boolean;
    inputLockedSub: boolean;
    scrollY: number;
    openDeckList: boolean;
    isShift: boolean;
  };

  game: {
    gameMode: "pvc" | "pvp" | "online";
    initialHand: number;
    firstPlayer: number;
    eventEnabled: boolean;
    shiftCardEnabled: boolean;

    deck0: CardID[];
    deck1: CardID[];
    deck2: CardID[];
    deck3: CardID[];
    editDeck: CardID[];
    deckColor0: DeckColor;
    deckColor1: DeckColor;
    deckColor2: DeckColor;
    deckColor3: DeckColor;
    editDeckColor: DeckColor;
    deckName0: string;
    deckName1: string;
    deckName2: string;
    deckName3: string;
    editDeckName: string;

    selectedDeckP1: number;
    selectedDeckP2: number;
  };
};
export type HoverUI = {
  startButton: boolean;
  back: boolean;
  menu: boolean[];
  menuDeck: boolean[];
  org: boolean;
  hoverCards: {
    des: boolean[];
    gen: boolean[];
    dis: boolean[];
    sup: boolean[];
  };
  hoverDeckIndex: number;
  shift: boolean;
  save: boolean;
};
export type PressTimers = {
  startButton: number;
  cardPool: number;
  deckBar: number;
};

export default function GameCanvas() {
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLCanvasElement>(null);
  const emphaRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<HTMLCanvasElement>(null);
  const effectTimers = useRef<Record<string, number>>({
    fadeOut: 0,
    fadeIn: 0,
    leftWhiteSlide: 0,
    screenTransition: 0,
    menu2Transition: 0,
    deckListOpen: 0,
    deckListClose: 0,
  });

  const [hoverStates, setHoverStates] = useState<HoverUI>({
    startButton: false,
    back: false,
    menu: Array(5).fill(false),
    menuDeck: Array(3).fill(false),
    org: false,
    hoverCards: {
      des: Array(5).fill(false),
      gen: Array(5).fill(false),
      dis: Array(5).fill(false),
      sup: Array(5).fill(false),
    },
    hoverDeckIndex: -1,
    shift: false,
    save: false,
  });

  const pressTimers = useRef<PressTimers>({
    startButton: 0,
    cardPool: 0,
    deckBar: 0,
  });

  const hoverStatesRef = useRef(hoverStates);

  const [screen, setScreen] = useState<Screen>("title");

  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);
  const mouseRef = useRef({ x: 0, y: 0 });
  const settingsRef = useRef<Settings>({
    ui: {
      bgmEnabled: true,
      seEnabled: true,
      deviceMode: "mouse",
      deckSelected: 0,
      inputLocked: false,
      inputLockedSub: false,
      scrollY: 0,
      openDeckList: false,
      isShift: false,
    },

    game: {
      gameMode: "pvc",
      initialHand: 5,
      firstPlayer: 1,
      eventEnabled: true,
      shiftCardEnabled: false,

      deck0: [],
      deck1: [],
      deck2: [],
      deck3: [],
      editDeck: [],
      deckColor0: "rainbow",
      deckColor1: "white",
      deckColor2: "white",
      deckColor3: "white",
      editDeckColor: "white",
      deckName0: "デフォルト",
      deckName1: "デッキ1",
      deckName2: "デッキ2",
      deckName3: "デッキ3",
      editDeckName: "",

      selectedDeckP1: 0,
      selectedDeckP2: 0,
    },
  });

  const [bgmEnabled, setBgmEnabled] = useState(
    settingsRef.current.ui.bgmEnabled,
  );

  useEffect(() => {
    if (window.innerWidth >= 900) {
      settingsRef.current.ui.deviceMode = "mouse";
    } else {
      settingsRef.current.ui.deviceMode = "touch";
    }
    loadDecks(settingsRef);
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
    canvas.addEventListener("selectstart", block);

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
  }, [screen, ratio, hoverStates]);
  // effect,empha：毎フレーム描く（アニメーション）
  useEffect(() => {
    const effectCanvas = effectRef.current;
    const emphaCanvas = emphaRef.current;
    if (!effectCanvas || !emphaCanvas) return;

    const effectCtx = effectCanvas.getContext("2d")!;
    const emphaCtx = emphaCanvas.getContext("2d")!;

    let running = true;
    let lastTime = performance.now();

    function loop(now: number) {
      if (!running) return;

      const dt = now - lastTime;
      lastTime = now;

      updateEffectsTimer(dt, effectTimers.current);

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
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        renderFrame(ctx, screen);
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
    });

    const listener = (e: MouseEvent) => onClick(e, canvas);

    canvas.addEventListener("click", listener);
    return () => canvas.removeEventListener("click", listener);
  }, [ratio, screen]);

  // ホバー判定
  useEffect(() => {
    const stop = createHoverHandler({
      ratio,
      screen,
      mouseRef,
      hoverStatesRef,
      setHoverStates,
      settingsRef,
      pressTimers: pressTimers.current,
    });

    return stop;
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
        break;
    }

    playBgm(bgm);

    if (settingsRef.current.ui.bgmEnabled) {
      startBgm();
    } else {
      stopBgm();
    }
    console.log("screen:", screen);
    console.log("bgmEnabled:", settingsRef.current.ui.bgmEnabled);
    console.log("bgm:", bgm.src);
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
function loadCookie(name: string) {
  const match = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

type DeckKey = "deck0" | "deck1" | "deck2" | "deck3";
type DeckNameKey = "deckName0" | "deckName1" | "deckName2" | "deckName3";
type DeckColorKey = "deckColor0" | "deckColor1" | "deckColor2" | "deckColor3";

function loadDecks(settingsRef: React.MutableRefObject<Settings>) {
  for (let i = 1; i <= 3; i++) {
    const deckKey: DeckKey = `deck${i}` as DeckKey;
    const nameKey: DeckNameKey = `deckName${i}` as DeckNameKey;
    const colorKey: DeckColorKey = `deckColor${i}` as DeckColorKey;

    const deckStr = loadCookie(deckKey);
    const nameStr = loadCookie(nameKey);
    const colorStr = loadCookie(colorKey);

    settingsRef.current.game[deckKey] = deckStr
      ? JSON.parse(decodeURIComponent(deckStr))
      : [];

    settingsRef.current.game[nameKey] = nameStr
      ? decodeURIComponent(nameStr)
      : `デッキ${i}`;

    settingsRef.current.game[colorKey] = (
      colorStr ? decodeURIComponent(colorStr) : "white"
    ) as DeckColor;
  }
}

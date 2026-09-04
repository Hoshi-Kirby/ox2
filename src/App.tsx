import { useState, useRef, useEffect } from "react";
import type {
  Screen,
  Settings,
  DeckColor,
  HoverUI,
  PressTimers,
} from "./types";
import MenuScreen from "./MenuScreen";
import GameClient from "./GameClient";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");

  const isGameStarted = screen === "game";

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
      initialHandId: 2,
      changingDeck: [false, false],
      isInputActive: false,
      inputCursorPosition: 0,
    },
    game: {
      gameMode: "pvc",
      initialHand: 6,
      firstPlayer: 2,
      eventEnabled: true,
      shiftCardEnabled: false,

      deck0: [
        { attr: "des", index: 1 },
        { attr: "des", index: 1 },
        { attr: "des", index: 2 },
        { attr: "des", index: 3 },
        { attr: "gen", index: 1 },
        { attr: "gen", index: 1 },
        { attr: "gen", index: 2 },
        { attr: "gen", index: 3 },
        { attr: "gen", index: 4 },
        { attr: "gen", index: 4 },
        { attr: "gen", index: 4 },
        { attr: "dis", index: 1 },
        { attr: "dis", index: 1 },
        { attr: "dis", index: 5 },
        { attr: "dis", index: 5 },
        { attr: "sup", index: 1 },
        { attr: "sup", index: 1 },
        { attr: "sup", index: 2 },
        { attr: "sup", index: 3 },
        { attr: "sup", index: 4 },
      ],
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
      selectedDeckP: [0, 0],
    },
  });

  const frameRef = useRef<HTMLCanvasElement>(null);
  const emphaRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLCanvasElement>(null);
  const worldEffectRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<HTMLCanvasElement>(null);

  const effectTimers = useRef<Record<string, number>>({
    fadeOut: 0,
    fadeIn: 0,
    leftWhiteSlide: 0,
    screenTransition: 0,
    menu2Transition: 0,
    deckListOpen: 0,
    deckListClose: 0,
    gameStartAnim: 0,
    gameStartCount: 0,
    turnStart: 0,
    Gchange: 0,
    finish: 0,
    result: 0,
  });

  const [hoverStates, setHoverStates] = useState<HoverUI>({
    startButton: false,
    back: false,
    menu: Array(5).fill(false),
    gameSettingArrow: Array.from({ length: 2 }, () => Array(2).fill(false)),
    gameDeck: Array(2).fill(false),
    selectDeck: Array(4).fill(false),
    menuDeck: Array(3).fill(false),
    org: false,
    hoverCards: {
      des: Array(5).fill(false),
      gen: Array(5).fill(false),
      dis: Array(5).fill(false),
      sup: Array(5).fill(false),
    },
    hoverDeckIndex: -1,
    deckIcon: false,
    shift: false,
    save: false,
    gameStart: false,
    turnEnd: false,
    hoverHands: [-1, -1],
    pauseContinue: false,
    pauseRestart: false,
    pauseEnd: false,
  });

  const pressTimers = useRef<PressTimers>({
    startButton: 0,
    cardPool: 0,
    deckBar: 0,
    hands: [0, 0],
  });

  const hoverStatesRef = useRef(hoverStates);

  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);

  const mouseRef = useRef({ x: 0, y: 0 });

  const animStateRef = useRef({
    active: false,
    frame: 0,
    maxFrames: 400,
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

    let lastTime = performance.now();
    let animationFrameId: number;
    function loop(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      updateEffectsTimer(dt, effectTimers.current);
      animationFrameId = requestAnimationFrame(loop);
    }
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
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

  // -----------------------------
  // 画面切り替え
  // -----------------------------
  if (!isGameStarted) {
    return (
      <MenuScreen
        screen={screen}
        setScreen={setScreen}
        settingsRef={settingsRef}
        hoverStates={hoverStates}
        setHoverStates={setHoverStates}
        pressTimers={pressTimers}
        ratio={ratio}
        mouseRef={mouseRef}
        frameRef={frameRef}
        uiRef={uiRef}
        worldRef={worldRef}
        effectRef={effectRef}
        emphaRef={emphaRef}
        effectTimers={effectTimers}
        bgmEnabled={bgmEnabled}
        setBgmEnabled={setBgmEnabled}
      />
    );
  }

  return (
    <GameClient
      setScreen={setScreen}
      settings={settingsRef.current}
      hoverStates={hoverStates}
      setHoverStates={setHoverStates}
      pressTimers={pressTimers}
      frameRef={frameRef}
      uiRef={uiRef}
      worldRef={worldRef}
      worldEffectRef={worldEffectRef}
      effectRef={effectRef}
      emphaRef={emphaRef}
      ratio={ratio}
      mouseRef={mouseRef}
      effectTimers={effectTimers}
      animStateRef={animStateRef}
    />
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
// let lastLog = performance.now();
// let count = 0;

// function updateEffectsTimer(dt: number, timers: Record<string, number>) {
//   count++;

//   const now = performance.now();

//   if (now - lastLog >= 1000) {
//     console.log("calls/sec:", count);
//     count = 0;
//     lastLog = now;
//   }

//   for (const key in timers) {
//     if (timers[key] > 0) {
//       timers[key] -= dt;
//       if (timers[key] < 0) timers[key] = 0;
//     }
//   }
// }

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

import {
  isInsideStartButton,
  isInsideMenuButton,
  isInsideBackButton,
  isInsideMenu2DeckButton,
} from "./hitTest";
import type { Screen } from "../GameCanvas";

type HoverParams = {
  ratio: number;
  screen: Screen;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverStatesRef: React.MutableRefObject<{
    startButton: boolean;
    back: boolean;
    menu: boolean[];
    menuDeck: boolean[];
  }>;
  setHoverStates: React.Dispatch<
    React.SetStateAction<{
      startButton: boolean;
      back: boolean;
      menu: boolean[];
      menuDeck: boolean[];
    }>
  >;
  settingsRef: any;
  pressTimers: React.MutableRefObject<{ startButton: number }>;
};

export function createHoverHandler({
  ratio,
  screen,
  mouseRef,
  hoverStatesRef,
  setHoverStates,
  settingsRef,
  pressTimers,
}: HoverParams) {
  let running = true;
  let lastTime = performance.now();

  function loop(now: number) {
    if (!running) return;

    const dt = now - lastTime;
    lastTime = now;

    const { x, y } = mouseRef.current;

    // ------------------------------
    // START BUTTON
    // ------------------------------
    const insideStart = isInsideStartButton(x, y, ratio);

    if (settingsRef.current.ui.deviceMode === "mouse") {
      // マウス → 即時 hover
      if (hoverStatesRef.current.startButton !== insideStart) {
        setHoverStates((prev) => ({ ...prev, startButton: insideStart }));
      }
    } else {
      // タッチ → 長押し判定
      if (insideStart) {
        pressTimers.current.startButton += dt;

        if (
          pressTimers.current.startButton > 300 &&
          !hoverStatesRef.current.startButton
        ) {
          setHoverStates((prev) => ({ ...prev, startButton: true }));
        }
      } else {
        pressTimers.current.startButton = 0;

        if (hoverStatesRef.current.startButton) {
          setHoverStates((prev) => ({ ...prev, startButton: false }));
        }
      }
    }

    // ------------------------------
    // MENU BUTTONS
    // ------------------------------
    if (screen === "menu") {
      for (let i = 0; i < hoverStatesRef.current.menu.length; i++) {
        const insideMenu = isInsideMenuButton(i, x, y, ratio);

        if (hoverStatesRef.current.menu[i] !== insideMenu) {
          setHoverStates((prev) => ({
            ...prev,
            menu: prev.menu.map((v, idx) => (idx === i ? insideMenu : v)),
          }));
        }
      }
    }

    // ------------------------------
    // BACK BUTTON
    // ------------------------------
    const insideBack = isInsideBackButton(x, y, ratio);

    if (hoverStatesRef.current.back !== insideBack) {
      setHoverStates((prev) => ({ ...prev, back: insideBack }));
    }

    // ------------------------------
    // DECK BUTTON
    // ------------------------------
    if (screen === "menuDeck") {
      for (let i = 0; i < hoverStatesRef.current.menuDeck.length; i++) {
        const insideDeck = isInsideMenu2DeckButton(i, x, y, ratio);

        if (hoverStatesRef.current.menuDeck[i] !== insideDeck) {
          setHoverStates((prev) => ({
            ...prev,
            menuDeck: prev.menuDeck.map((v, idx) =>
              idx === i ? insideDeck : v,
            ),
          }));
        }
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  return () => {
    running = false;
  };
}

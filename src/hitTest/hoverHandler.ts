import {
  isInsideStartButton,
  isInsideMenuButton,
  isInsideBackButton,
  isInsideMenu2DeckButton,
  isInsideOrgButton,
  detectCardHoverSingle,
  isInsideDeckBar,
  isInsideShiftButton,
  isInsideSaveButton,
  isInsideArrowButton,
  isInsideGameSettingDeckButton,
  isInsideGameSTartButton,
} from "./hitTest";
import type { Screen, HoverUI, PressTimers } from "../GameCanvas";
let lastCardPoolTarget: string | null = null;
let lastDeckBarTarget = -1;

type HoverParams = {
  ratio: number;
  screen: Screen;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverStatesRef: React.MutableRefObject<HoverUI>;
  setHoverStates: React.Dispatch<React.SetStateAction<HoverUI>>;
  settingsRef: any;
  pressTimers: PressTimers;
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
        pressTimers.startButton += dt;

        if (
          pressTimers.startButton > 300 &&
          !hoverStatesRef.current.startButton
        ) {
          setHoverStates((prev) => ({ ...prev, startButton: true }));
        }
      } else {
        pressTimers.startButton = 0;

        if (hoverStatesRef.current.startButton) {
          setHoverStates((prev) => ({ ...prev, startButton: false }));
        }
      }
    }

    // ------------------------------
    // MENU BUTTONS
    // ------------------------------
    if (screen === "menu") {
      const currentMenu = hoverStatesRef.current.menu;
      const nextMenu = currentMenu.map((_, i) =>
        isInsideMenuButton(i, x, y, ratio),
      );
      const changed = nextMenu.some((value, i) => value !== currentMenu[i]);
      if (changed) {
        setHoverStates((prev) => ({
          ...prev,
          menu: nextMenu,
        }));
      }
    }
    if (
      ratio > 1.2 &&
      (screen === "menuOffline" ||
        screen === "menuHelp" ||
        screen === "menuDeck" ||
        screen === "menuSetting")
    ) {
      const currentMenu = hoverStatesRef.current.menu;
      const nextMenu = currentMenu.map((_, i) =>
        isInsideMenuButton(i, x + 200, y, ratio),
      );
      const changed = nextMenu.some((value, i) => value !== currentMenu[i]);
      if (changed) {
        setHoverStates((prev) => ({
          ...prev,
          menu: nextMenu,
        }));
      }
    }

    // ------------------------------
    // BACK BUTTON
    // ------------------------------
    if (
      screen === "menu" ||
      screen === "menuOffline" ||
      screen === "menuHelp" ||
      screen === "menuDeck" ||
      screen === "menuSetting" ||
      screen === "make"
    ) {
      const insideBack = isInsideBackButton(x, y, ratio);

      if (hoverStatesRef.current.back !== insideBack) {
        setHoverStates((prev) => ({ ...prev, back: insideBack }));
      }
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

      // ------------------------------
      // ORG BUTTON
      // ------------------------------
      const insideOrg = isInsideOrgButton(x, y, ratio);

      if (hoverStatesRef.current.org !== insideOrg) {
        setHoverStates((prev) => ({ ...prev, org: insideOrg }));
      }
    }

    // ------------------------------
    // MAKE CARD
    // ------------------------------
    if (screen === "make") {
      const { deviceMode } = settingsRef.current.ui;

      // カードプール hover
      if (!settingsRef.current.ui.openDeckList) {
        const attrs = ["des", "gen", "dis", "sup"] as const;
        const nextHoverCards = {
          des: [...hoverStatesRef.current.hoverCards.des],
          gen: [...hoverStatesRef.current.hoverCards.gen],
          dis: [...hoverStatesRef.current.hoverCards.dis],
          sup: [...hoverStatesRef.current.hoverCards.sup],
        };
        let changedPool = false;
        let currentCardTarget: string | null = null;
        for (const attr of attrs) {
          for (let i = 0; i < 5; i++) {
            const inside = detectCardHoverSingle(
              x,
              y,
              ratio,
              attr,
              i + 1,
              settingsRef.current.ui.scrollY,
              deviceMode,
            );
            if (inside) {
              currentCardTarget = `${attr}-${i}`;
              break;
            }
          }
          if (currentCardTarget !== null) {
            break;
          }
        }
        if (deviceMode === "mouse") {
          // マウス → 即時 hover
          for (const attr of attrs) {
            for (let i = 0; i < 5; i++) {
              const inside = detectCardHoverSingle(
                x,
                y,
                ratio,
                attr,
                i + 1,
                settingsRef.current.ui.scrollY,
                deviceMode,
              );

              if (nextHoverCards[attr][i] !== inside) {
                nextHoverCards[attr][i] = inside;
                changedPool = true;
              }
            }
          }
          pressTimers.cardPool = 0;
          lastCardPoolTarget = null;
        } else {
          // タッチ → 長押し hover
          if (currentCardTarget !== lastCardPoolTarget) {
            pressTimers.cardPool = 0;
            lastCardPoolTarget = currentCardTarget;
          }
          if (currentCardTarget !== null) {
            pressTimers.cardPool += dt;
            if (pressTimers.cardPool > 300) {
              const [attr, indexString] = currentCardTarget.split("-");
              const index = Number(indexString);
              if (
                attr === "des" ||
                attr === "gen" ||
                attr === "dis" ||
                attr === "sup"
              ) {
                for (const a of attrs) {
                  for (let i = 0; i < 5; i++) {
                    const shouldHover = a === attr && i === index;

                    if (nextHoverCards[a][i] !== shouldHover) {
                      nextHoverCards[a][i] = shouldHover;
                      changedPool = true;
                    }
                  }
                }
              }
            }
          } else {
            pressTimers.cardPool = 0;
            for (const attr of attrs) {
              for (let i = 0; i < 5; i++) {
                if (nextHoverCards[attr][i]) {
                  nextHoverCards[attr][i] = false;
                  changedPool = true;
                }
              }
            }
          }
        }
        if (changedPool) {
          setHoverStates((prev) => ({
            ...prev,
            hoverCards: nextHoverCards,
          }));
        }
      }
      // カードバー hover
      if (!isInsideBackButton(x, y, ratio)) {
        const deck = settingsRef.current.game.editDeck;
        let currentDeckTarget = -1;
        for (let i = deck.length - 1; i >= 0; i--) {
          if (isInsideDeckBar(i, x, y, ratio)) {
            currentDeckTarget = i;
            break;
          }
        }
        let newHoverIndex = -1;
        if (deviceMode === "mouse") {
          // マウス → 即時 hover
          newHoverIndex = currentDeckTarget;
          pressTimers.deckBar = 0;
          lastDeckBarTarget = -1;
        } else {
          // タッチ → 長押し hover
          if (currentDeckTarget !== lastDeckBarTarget) {
            pressTimers.deckBar = 0;
            lastDeckBarTarget = currentDeckTarget;
          }
          if (currentDeckTarget !== -1) {
            pressTimers.deckBar += dt;
            if (pressTimers.deckBar > 300) {
              newHoverIndex = currentDeckTarget;
            }
          } else {
            pressTimers.deckBar = 0;
            lastDeckBarTarget = -1;
          }
        }
        if (hoverStatesRef.current.hoverDeckIndex !== newHoverIndex) {
          setHoverStates((prev) => ({
            ...prev,
            hoverDeckIndex: newHoverIndex,
          }));
        }
      }
      // シフト
      const insideShift = isInsideShiftButton(x, y, ratio);

      if (hoverStatesRef.current.shift !== insideShift) {
        setHoverStates((prev) => ({ ...prev, shift: insideShift }));
      }
      // 保存
      const insideSave = isInsideSaveButton(x, y, ratio);

      if (hoverStatesRef.current.save !== insideSave) {
        setHoverStates((prev) => ({ ...prev, save: insideSave }));
      }
    }

    // オフラインメニュー前設定
    if (
      screen === "menuOffline" &&
      settingsRef.current.ui.changingDeck[0] == false &&
      settingsRef.current.ui.changingDeck[1] == false
    ) {
      // 矢印
      const newHover = [
        [false, false],
        [false, false],
      ];

      for (let i1 = 0; i1 < 2; i1++) {
        for (let i2 = 0; i2 < 2; i2++) {
          if (isInsideArrowButton(x, y, ratio, i1, i2)) {
            newHover[i1][i2] = true;
          }
        }
      }

      const oldHover = hoverStatesRef.current.gameSettingArrow;

      let changed = false;
      for (let i1 = 0; i1 < 2; i1++) {
        for (let i2 = 0; i2 < 2; i2++) {
          if (oldHover[i1][i2] !== newHover[i1][i2]) {
            changed = true;
            break;
          }
        }
      }

      if (changed) {
        setHoverStates((prev) => ({
          ...prev,
          gameSettingArrow: newHover,
        }));
      }

      // デッキ
      for (let i = 0; i < 2; i++) {
        const insideDeck = isInsideGameSettingDeckButton(i, x, y, ratio);

        if (hoverStatesRef.current.menuDeck[i] !== insideDeck) {
          setHoverStates((prev) => ({
            ...prev,
            menuDeck: prev.menuDeck.map((v, idx) =>
              idx === i ? insideDeck : v,
            ),
          }));
        }
      }
      // ゲームスタート
      const insideGameStart = isInsideGameSTartButton(x, y, ratio);

      if (hoverStatesRef.current.gameStart !== insideGameStart) {
        setHoverStates((prev) => ({ ...prev, gameStart: insideGameStart }));
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  return () => {
    running = false;
  };
}

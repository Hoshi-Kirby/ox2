import {
  isInsideStartButton,
  isInsideMenuButton,
  isInsideQuickMenuButton,
  isInsideBackButton,
  isInsideBgmTrue,
  isInsideBgmFalse,
  isInsideSeTrue,
  isInsideSeFalse,
  isInsideDeviceMouse,
  isInsideDeviceTouch,
  isInsideMenu2DeckButton,
  isInsideOrgButton,
  detectCardHoverSingle,
  isInsideDeckBar,
  isInsideDeckButton,
  isInsideShiftButton,
  isInsideSaveButton,
} from "./hitTest";
import type { Screen, CardID } from "../GameCanvas";
import { playSe } from "../audio/audioManager";
import { assets } from "../canvas/assets";

type ClickHandlerParams = {
  ratio: number;
  screen: Screen;
  setScreen: (s: Screen) => void;
  effectTimers: Record<string, number>;
  settingsRef: any;
  setBgmEnabled: (v: boolean) => void;
};

export function createClickHandler({
  ratio,
  screen,
  setScreen,
  effectTimers,
  settingsRef,
  setBgmEnabled,
}: ClickHandlerParams) {
  return function onClick(e: MouseEvent, canvas: HTMLCanvasElement) {
    if (settingsRef.current.ui.inputLocked) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (settingsRef.current.ui.inputLockedSub) {
      if (
        (screen === "menuOffline" ||
          screen === "menuHelp" ||
          screen === "menuDeck" ||
          screen === "menuSetting") &&
        isInsideBackButton(x, y, ratio)
      ) {
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;
        settingsRef.current.ui.inputLocked = true;
        setTimeout(() => {
          setScreen("title");
          effectTimers.fadeOut = 300;
          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
      return;
    }

    // ------------------------------
    // TITLE
    // ------------------------------
    if (screen === "title") {
      if (isInsideStartButton(x, y, ratio)) {
        settingsRef.current.ui.inputLocked = true;
        if (settingsRef.current.ui.seEnabled) {
          playSe("seStart"); //se
        }
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;

        setTimeout(() => {
          setScreen("menu");
          settingsRef.current.ui.inputLocked = false;
          effectTimers.fadeOut = 300;
        }, 300);
      }
    }

    // ------------------------------
    // MENU
    // ------------------------------
    if (screen === "menu") {
      for (let i = 0; i < 5; i++) {
        if (isInsideMenuButton(i, x, y, ratio)) {
          settingsRef.current.ui.inputLocked = true;

          switch (i) {
            case 0:
              setScreen("menuOffline");
              break;
            case 2:
              setScreen("menuHelp");
              break;
            case 3:
              setScreen("menuDeck");
              break;
            case 4:
              setScreen("menuSetting");
              break;
          }
          effectTimers.screenTransition = 200;

          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 200);
        }
      }

      if (isInsideBackButton(x, y, ratio)) {
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;

        settingsRef.current.ui.inputLocked = true;
        setTimeout(() => {
          setScreen("title");
          effectTimers.fadeOut = 300;

          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
    }

    // ------------------------------
    // MENU 2 (Offline / Help / Deck / Setting)
    // ------------------------------
    if (
      screen === "menuOffline" ||
      screen === "menuHelp" ||
      screen === "menuDeck" ||
      screen === "menuSetting"
    ) {
      for (let i = 0; i < 5; i++) {
        const inside =
          (ratio > 1.2 && isInsideMenuButton(i, x + 200, y, ratio)) ||
          (ratio <= 1.2 && isInsideQuickMenuButton(i, x, y, ratio));

        if (inside) {
          effectTimers.menu2Transition = 300;

          settingsRef.current.ui.inputLocked = true;
          setTimeout(() => {
            switch (i) {
              case 0:
                setScreen("menuOffline");
                break;
              case 2:
                setScreen("menuHelp");
                break;
              case 3:
                setScreen("menuDeck");
                break;
              case 4:
                setScreen("menuSetting");
                break;
            }
            effectTimers.screenTransition = 200;

            setTimeout(() => {
              settingsRef.current.ui.inputLocked = false;
            }, 200);
          }, 200);
        }
      }

      if (isInsideBackButton(x, y, ratio)) {
        effectTimers.menu2Transition = 300;
        settingsRef.current.ui.inputLockedSub = true;
        setTimeout(() => {
          setScreen("menu");
          settingsRef.current.ui.inputLockedSub = false;
        }, 180);
      }
    }

    // ------------------------------
    // MENU SETTING
    // ------------------------------
    if (screen === "menuSetting") {
      if (isInsideBgmTrue(x, y, ratio)) {
        settingsRef.current.ui.bgmEnabled = true;
        setBgmEnabled(true);
      }
      if (isInsideBgmFalse(x, y, ratio)) {
        settingsRef.current.ui.bgmEnabled = false;
        setBgmEnabled(false);
      }
      if (isInsideSeTrue(x, y, ratio)) {
        settingsRef.current.ui.seEnabled = true;
      }
      if (isInsideSeFalse(x, y, ratio)) {
        settingsRef.current.ui.seEnabled = false;
      }
      if (isInsideDeviceMouse(x, y, ratio)) {
        settingsRef.current.ui.deviceMode = "mouse";
      }
      if (isInsideDeviceTouch(x, y, ratio)) {
        settingsRef.current.ui.deviceMode = "touch";
      }
    }

    // ------------------------------
    // MENU DECK
    // ------------------------------
    if (screen === "menuDeck") {
      for (let i = 0; i < 3; i++) {
        if (isInsideMenu2DeckButton(i, x, y, ratio)) {
          settingsRef.current.ui.deckSelected = i;
        }
      }

      if (isInsideOrgButton(x, y, ratio)) {
        if (settingsRef.current.ui.seEnabled) {
          playSe("seStart");
        }
        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;
        settingsRef.current.ui.inputLocked = true;
        const deckIndex = settingsRef.current.ui.deckSelected + 1;
        settingsRef.current.game.editDeck = [
          ...settingsRef.current.game[`deck${deckIndex}`],
        ];
        settingsRef.current.game.editDeckColor = [
          settingsRef.current.game[`deckColor${deckIndex}`],
        ];
        settingsRef.current.game.editDeckName = [
          settingsRef.current.game[`deckName${deckIndex}`],
        ];
        if (settingsRef.current.game.editDeckColor == "white") {
          settingsRef.current.game.editDeckColor = "rainbow";
        }

        setTimeout(() => {
          setScreen("make");
          settingsRef.current.ui.scrollY = 0;
          settingsRef.current.ui.openDeckList = false;
          settingsRef.current.ui.isShift = false;
          effectTimers.fadeOut = 300;
          effectTimers.screenTransition = 200;
          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
    }

    // ------------------------------
    // Make
    // ------------------------------
    if (screen === "make") {
      if (isInsideBackButton(x, y, ratio)) {
        if (settingsRef.current.ui.openDeckList && ratio < 1.2) {
          effectTimers.deckListClose = 200;
          settingsRef.current.ui.inputLocked = true;
          setTimeout(() => {
            settingsRef.current.ui.openDeckList = false;
            settingsRef.current.ui.inputLocked = false;
          }, 100);
        } else {
          effectTimers.fadeIn = 300;
          effectTimers.fadeOut = 600;
          settingsRef.current.ui.inputLocked = true;

          setTimeout(() => {
            setScreen("menuDeck");
            effectTimers.fadeOut = 300;
            setTimeout(() => {
              settingsRef.current.ui.inputLocked = false;
            }, 300);
          }, 300);
        }
      }
      // 削除
      if (settingsRef.current.ui.openDeckList || ratio > 1.2) {
        if (!isInsideBackButton(x, y, ratio)) {
          const deck = settingsRef.current.game.editDeck;

          for (let i = deck.length - 1; i >= 0; i--) {
            if (isInsideDeckBar(i, x, y, ratio)) {
              deck.splice(i, 1);

              return;
            }
          }
        }
      }
      // 追加
      if (!settingsRef.current.ui.openDeckList || ratio > 1.2) {
        if (!isInsideDeckButton(x, y, ratio)) {
          const attrs = [
            "des",
            "gen",
            "dis",
            "sup",
          ] as (keyof typeof assets.cardAssets)[];

          for (const attr of attrs) {
            for (let i = 1; i <= 5; i++) {
              if (
                detectCardHoverSingle(
                  x,
                  y,
                  ratio,
                  attr,
                  i,
                  settingsRef.current.ui.scrollY,
                  settingsRef.current.ui.deviceMode,
                )
              ) {
                let shiftCard = 0;
                if (settingsRef.current.ui.isShift && i > 3) {
                  shiftCard = 2;
                }
                const deck = settingsRef.current.game.editDeck;

                let count = deck.filter(
                  (c: CardID) => c.attr === attr && c.index === i,
                ).length;
                if (i > 3) {
                  count += deck.filter(
                    (c: CardID) => c.attr === attr && c.index === i + 2,
                  ).length;
                }

                if (count < 4 && deck.length < 20) {
                  settingsRef.current.game.editDeck.push({
                    attr,
                    index: i + shiftCard,
                  });

                  settingsRef.current.game.editDeck.sort(
                    (a: CardID, b: CardID) => {
                      const order = ["des", "gen", "dis", "sup"];
                      const ai = order.indexOf(a.attr);
                      const bi = order.indexOf(b.attr);

                      if (ai !== bi) return ai - bi;
                      return a.index - b.index;
                    },
                  );
                }
              }
            }
          }
        }
      }
      // デッキボタン
      if (!settingsRef.current.ui.openDeckList) {
        if (ratio < 1.2) {
          if (isInsideDeckButton(x, y, ratio)) {
            effectTimers.deckListOpen = 100;
            settingsRef.current.ui.openDeckList = true;
            settingsRef.current.ui.inputLocked = true;
            setTimeout(() => {
              settingsRef.current.ui.inputLocked = false;
            }, 100);
          }
        }
      }
      // シフトボタン
      if (isInsideShiftButton(x, y, ratio)) {
        settingsRef.current.ui.isShift = !settingsRef.current.ui.isShift;
      }
      // ほぞん
      if (isInsideSaveButton(x, y, ratio)) {
        const deckIndex = settingsRef.current.ui.deckSelected + 1;
        if (deckIndex === 0) return;

        settingsRef.current.game[`deck${deckIndex}`] = [
          ...settingsRef.current.game.editDeck,
        ];
        settingsRef.current.game[`deckName${deckIndex}`] =
          settingsRef.current.game.editDeckName;

        settingsRef.current.game[`deckColor${deckIndex}`] =
          settingsRef.current.game.editDeckColor;

        document.cookie = `deck${deckIndex}=${encodeURIComponent(
          JSON.stringify(settingsRef.current.game[`deck${deckIndex}`]),
        )}; path=/; max-age=31536000`;

        document.cookie = `deckName${deckIndex}=${encodeURIComponent(
          settingsRef.current.game[`deckName${deckIndex}`],
        )}; path=/; max-age=31536000`;

        document.cookie = `deckColor${deckIndex}=${encodeURIComponent(
          settingsRef.current.game[`deckColor${deckIndex}`],
        )}; path=/; max-age=31536000`;

        effectTimers.fadeIn = 300;
        effectTimers.fadeOut = 600;
        settingsRef.current.ui.inputLocked = true;

        setTimeout(() => {
          setScreen("menuDeck");
          effectTimers.fadeOut = 300;
          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
    }
  };
}

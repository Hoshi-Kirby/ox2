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
} from "./hitTest";
import type { Screen } from "../GameCanvas";
import { playSe } from "../audio/audioManager";

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

        setTimeout(() => {
          setScreen("make");
          effectTimers.fadeOut = 300;
          effectTimers.screenTransition = 200;
          setTimeout(() => {
            settingsRef.current.ui.inputLocked = false;
          }, 300);
        }, 300);
      }
    }

    // MAKE
    if (screen === "make") {
      if (isInsideBackButton(x, y, ratio)) {
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

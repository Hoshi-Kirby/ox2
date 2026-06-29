// src/canvas/rendererEffect.ts
import { assets } from "./assets";
type HoverUI = {
  startButton: boolean;
  back: boolean;
  menu: boolean[];
};
type Settings = {
  ui: {
    bgmEnabled: boolean;
    seEnabled: boolean;
    deviceMode: "mouse" | "touch";
  };

  game: {
    gameMode: "pvc" | "pvp" | "online";
    initialHand: number;
    firstPlayer: number;
    eventEnabled: boolean;
    shiftCardEnabled: boolean;
    deck1: number[];
    deck2: number[];
    deck3: number[];
    selectedDeckP1: number;
    selectedDeckP2: number;
  };
};
let t = 0;
let menuOffsets = [0, 0, 0, 0, 0];
let backOffset = 0;

export function renderEffect(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen:
    | "title"
    | "menu"
    | "menuOffline"
    | "menuHelp"
    | "menuDeck"
    | "menuSetting"
    | "help"
    | "game"
    | "make"
    | "result",
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
  settingsRef: Settings,
) {
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, 1280, 720);
  const canvasRatio = 1280 / 720;
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
  if (screen === "title") {
    ctx.imageSmoothingEnabled = false;
    const img = assets.title;

    const imgRatio = img.width / img.height;

    let drawW, drawH;

    if (layoutIsWide) {
      drawH = H * 0.23;
      drawW = drawH * imgRatio;
    } else {
      drawW = W * 0.8;
      drawH = drawW / imgRatio;
    }

    const offset = Math.sin(t) * (H * 0.01);
    t += 0.05;

    const x = dx + W * 0.5 - drawW / 2;
    const y = dy + H * 0.26 - drawH / 2 + offset;

    ctx.drawImage(img, x, y, drawW, drawH);
  } else if (
    screen === "menu" ||
    screen === "menuOffline" ||
    screen === "menuHelp" ||
    screen === "menuDeck" ||
    screen === "menuSetting"
  ) {
    let menu2animdx = 0;
    let menu2animdy = 0;
    let menu2animdxMax = 0;

    // menu2
    if (screen !== "menu") {
      let menu2X;
      if (layoutIsWide) {
        menu2animdx = 200 - effectTimers.screenTransition;
        menu2animdy =
          dx + W - 300 - (effectTimers.screenTransition * (dx + W - 300)) / 200;
        menu2animdxMax = 200;
        if (
          effectTimers.screenTransition == 0 &&
          effectTimers.menu2Transition > 0
        ) {
          menu2animdx -= 200 - effectTimers.menu2Transition + 100;
          menu2animdy -=
            dx +
            W -
            300 -
            ((effectTimers.menu2Transition - 100) * (dx + W - 300)) / 200;
        }

        ctx.drawImage(assets.leftWhite, -400 - menu2animdx, 0, 1280 + 400, 720);
        ctx.drawImage(
          assets.rightBlack,
          dx + W - 300 - menu2animdy,
          0,
          1280,
          720,
        );
        menu2X = 500;
      } else {
        menu2animdx =
          (200 - effectTimers.screenTransition) * 3 * (ratio / 1.2) ** 0.4;
        menu2animdy =
          (dx +
            W -
            200 -
            (effectTimers.screenTransition * (dx + W - 200)) / 200) *
          (ratio / 1.2) ** 0.4;
        menu2animdxMax = 200 * 3 * (ratio / 1.2) ** 0.4;
        if (
          effectTimers.screenTransition == 0 &&
          effectTimers.menu2Transition > 0
        ) {
          menu2animdx -=
            (200 - effectTimers.menu2Transition + 100) *
            3 *
            (ratio / 1.2) ** 0.4;
          menu2animdy -=
            (dx +
              W -
              200 -
              ((effectTimers.menu2Transition - 100) * (dx + W - 200)) / 200) *
            (ratio / 1.2) ** 0.4;
        }

        ctx.drawImage(assets.leftWhite, 0 - menu2animdx, 0, 1280 + 400, 720);
        ctx.drawImage(
          assets.rightBlack,
          dx + W - 300 - menu2animdy,
          0,
          1280,
          720,
        );
        menu2X = dx + W + 300 - (dx + W - 200) * (ratio / 1.2) ** 0.4 - 150;
      }
      // ゲーム設定
      let menu2W = 0,
        menu2H = 0,
        menu2Y = 0;
      if (ratio > 1.2) {
        menu2W = dx + W - menu2X - 100;
        menu2H = Math.min(
          H * 0.9,
          menu2W * (assets.gameSettingUI.height / assets.gameSettingUI.width),
        );
        menu2W =
          menu2H / (assets.gameSettingUI.height / assets.gameSettingUI.width);
        menu2Y =
          dy +
          H * 0.05 +
          H * 0.5 -
          menu2W / 2 -
          (1 - menu2animdx / menu2animdxMax) * H;
      } else {
        menu2W = W * 0.9;
        menu2H = Math.min(
          H * 0.7 - W * 0.16,
          menu2W * (assets.gameSettingUI.height / assets.gameSettingUI.width),
        );
        menu2W =
          menu2H / (assets.gameSettingUI.height / assets.gameSettingUI.width);
        menu2X = dx - W * 0.05 + W * 0.5 - menu2H / 2;
        menu2Y =
          dy -
          H * 0.05 +
          H * 0.5 -
          menu2W / 2 -
          (1 - menu2animdx / menu2animdxMax) * H;
      }
      if (screen === "menuOffline") {
        ctx.drawImage(assets.gameSettingUI, menu2X, menu2Y, menu2W, menu2H);
      } else if (screen === "menuSetting") {
        ctx.drawImage(assets.settingText, menu2X, menu2Y, menu2W, menu2H);
      }
    }

    let baseX = dx + W * 0.01;
    let baseY = dy + H * 0.1;

    let btnW = H * 0.45;
    const btnH =
      btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);

    let offsetX = H * 0.053;
    if (!layoutIsWide) {
      btnW = H * 0.4;
      baseX = dx + W * 0.5 - btnW / 2;
      baseY = dy + H * 0.2;
      offsetX = 0;
    }
    const offsetY = H * 0.15; // 縦の間隔
    const menu2IndexMap: Record<string, number> = {
      menuOffline: 0,
      menuHelp: 2,
      menuDeck: 3,
      menuSetting: 4,
    };

    const selectedIndex = menu2IndexMap[screen] ?? null;

    for (let i = 0; i < 5; i++) {
      if (hoverStates.menu[i] || i == selectedIndex) {
        menuOffsets[i] = Math.min(btnW * 0.1, menuOffsets[i] + dt * 0.4);
      } else {
        menuOffsets[i] = Math.max(0, menuOffsets[i] - dt * 0.6);
      }
      const x = baseX + offsetX * i + menuOffsets[i];
      const y = baseY + offsetY * i;

      ctx.drawImage(assets.buttonFrame1, x - menu2animdx, y, btnW, btnH);
      const textImg = assets.menuText[i];
      if (textImg) {
        const textH = btnH * 0.8;
        const textW = textH / (textImg.height / textImg.width);
        const textX = x + btnW * 0.5 - textW * 0.5;
        const textY = y + btnH * 0.1;

        ctx.drawImage(textImg, textX - menu2animdx, textY, textW, textH);
      }
    }
    if (!layoutIsWide && screen !== "menu") {
      const qBtnW = W * 0.16;
      const qBtnH =
        qBtnW * (assets.quickMenu[0].height / assets.quickMenu[0].width);
      const margin = W * 0.02;

      const totalWidth = qBtnW * 5 + margin * 4;
      const qBaseX = dx + (W - totalWidth) / 2;
      const qBaseY = dy + H * 0.9 - qBtnH;

      for (let i = 0; i < 5; i++) {
        const img = assets.quickMenu[i];
        if (!img) continue;
        let y = qBaseY;
        if (i == selectedIndex) {
          y = qBaseY - 0.01 * H;
        }

        const x = qBaseX + i * (qBtnW + margin);

        ctx.drawImage(img, x, y + menu2animdxMax - menu2animdx, qBtnW, qBtnH);
      }
    }

    if (hoverStates.back) {
      backOffset = Math.min(btnW * 0.1, backOffset + dt * 0.4);
    } else {
      backOffset = Math.max(0, backOffset - dt * 0.6);
    }
    let backX = baseX - H * 0.2;
    let backY = baseY + offsetY * 5 - H * 0.03;
    if (!layoutIsWide) {
      backX = dx - btnW / 2;
      backY = baseY = dy + H * 0.05;
    }
    ctx.drawImage(assets.buttonFrame1, backX + backOffset, backY, btnW, btnH);
    const backImg = assets.backText;
    if (backImg) {
      const textH = btnH * 0.8;
      const textW = textH / (backImg.height / backImg.width);
      const textX = backX + btnW * 0.5;
      const textY = backY + btnH * 0.1;

      ctx.drawImage(backImg, textX, textY, textW, textH);
    }
  }
  if (effectTimers.fadeIn > 0) {
    ctx.fillStyle = `rgba(0,0,0,${(300 - effectTimers.fadeIn) / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  } else if (effectTimers.fadeOut > 0) {
    ctx.fillStyle = `rgba(0,0,0,${effectTimers.fadeOut / 300})`;
    ctx.fillRect(0, 0, 1280, 720);
  }
}

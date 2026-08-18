// src/canvas/rendererEffect.ts
import { assets } from "./assets";
import type { Screen, Settings, HoverUI, CardID } from "../GameCanvas";

let t = 0;
let menuOffsets = [0, 0, 0, 0, 0];
let backOffset = 0;
let deckOffset = [0, 0, 0];
let shiftOffset = 0;
let saveOffset = 0;

export function renderEffect(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: Screen,
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
  settingsRef: Settings,
) {
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, 1280, 720);
  const canvasRatio = 1280 / 720;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
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
      if (layoutIsWide) {
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
      // menu2表示
      if (screen === "menuOffline") {
        ctx.drawImage(assets.gameSettingUI, menu2X, menu2Y, menu2W, menu2H);
        let arrow = assets.arrow[0];
        const arrowW = menu2W * 0.05;
        const arrowH = arrowW * (arrow.height / arrow.width);
        for (let i = 0; i < 2; i++) {
          arrow = assets.arrow[0];
          if (hoverStates.gameSettingArrow[i][1]) {
            arrow = assets.arrow[1];
          }
          const y = menu2Y + menu2H * 0.21 + i * menu2H * 0.13;
          ctx.save();
          ctx.translate(menu2X + menu2W * 0.8 - arrowW * 0.5 + arrowW, y);
          ctx.scale(-1, 1);
          ctx.drawImage(arrow, menu2W * 0.3, 0, arrowW, arrowH);
          ctx.restore();

          arrow = assets.arrow[0];
          if (hoverStates.gameSettingArrow[i][0]) {
            arrow = assets.arrow[1];
          }

          ctx.drawImage(arrow, menu2X + menu2W * 0.8, y, arrowW, arrowH);
        }
        // 手札、先攻

        ctx.drawImage(
          assets.initialHandSize[settingsRef.ui.initialHandId],
          menu2X + menu2W * 0.6 - menu2W * 0.01,
          menu2Y + menu2H * 0.21 - menu2H * 0.025,
          (arrowH * 2) /
            (assets.initialHandSize[0].height /
              assets.initialHandSize[0].width),
          arrowH * 2,
        );
        ctx.drawImage(
          assets.firstPlayer[settingsRef.game.firstPlayer],
          menu2X + menu2W * 0.6 - menu2W * 0.09,
          menu2Y + menu2H * 0.21 - menu2H * 0.025 + menu2H * 0.13,
          (arrowH * 2) /
            (assets.firstPlayer[2].height / assets.firstPlayer[2].width),
          arrowH * 2,
        );

        // デッキ選択
        const deckImageMap = {
          blue: assets.deckb,
          red: assets.deckr,
          yellow: assets.decky,
          green: assets.deckg,
          rainbow: assets.deckn,
          white: assets.deckw,
        };
        const colors = [
          settingsRef.game.deckColor0,
          settingsRef.game.deckColor1,
          settingsRef.game.deckColor2,
          settingsRef.game.deckColor3,
        ];
        const decks = [
          settingsRef.game.deck0,
          settingsRef.game.deck1,
          settingsRef.game.deck2,
          settingsRef.game.deck3,
        ];
        const names = [
          settingsRef.game.deckName0,
          settingsRef.game.deckName1,
          settingsRef.game.deckName2,
          settingsRef.game.deckName3,
        ];
        for (let i = 0; i < 2; i++) {
          if (hoverStates.menuDeck[i]) {
            deckOffset[i] = Math.min(Math.PI * 4, deckOffset[i] + dt * 0.05);
          } else {
            deckOffset[i] = 0;
          }
          const shake = Math.sin(deckOffset[i]) * (menu2W * 0.005);
          const deckImg =
            deckImageMap[colors[settingsRef.game.selectedDeckP[i]]];
          ctx.drawImage(
            deckImg,
            menu2X + menu2W * 0.55 + i * menu2W * 0.22 + shake,
            menu2Y + menu2H * 0.47,
            menu2W * 0.1,
            menu2W * 0.1 * (deckImg.height / deckImg.width),
          );
        }
        // シフト
        if (settingsRef.game.shiftCardEnabled) {
          ctx.drawImage(
            assets.trueActive,
            menu2X + menu2W * 0.47,
            menu2Y + menu2H * 0.58,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falsePassive,
            menu2X + menu2W * 0.68,
            menu2Y + menu2H * 0.58,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        } else {
          ctx.drawImage(
            assets.truePassive,
            menu2X + menu2W * 0.47,
            menu2Y + menu2H * 0.58,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falseActive,
            menu2X + menu2W * 0.68,
            menu2Y + menu2H * 0.58,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        }

        // デッキ変更枠
        for (let i = 0; i < 2; i++) {
          if (settingsRef.ui.changingDeck[i]) {
            ctx.drawImage(
              assets.uiframe1,
              menu2X + menu2W * 0.35 + i * menu2W * 0.22,
              menu2Y + menu2H * 0.57,
              menu2W * 0.5,
              menu2W * 0.5 * (assets.uiframe1.height / assets.uiframe1.width),
            );
            for (let j = 0; j < 4; j++) {
              const Img = deckImageMap[colors[j]];
              if (decks[j].length < 20) {
                ctx.filter = "grayscale(100%)";
              }

              ctx.drawImage(
                Img,
                menu2X + menu2W * 0.38 + i * menu2W * 0.22 + j * menu2W * 0.11,
                menu2Y + menu2H * 0.59,
                menu2W * 0.1,
                menu2W * 0.1 * (Img.height / Img.width),
              );
              ctx.filter = "none";
              ctx.font = `${menu2H * 0.02}px Komorebi`;
              ctx.fillText(
                names[j],
                menu2X + menu2W * 0.43 + i * menu2W * 0.22 + j * menu2W * 0.11,
                menu2Y + menu2H * 0.69,
              );
            }
          }
        }
      } else if (screen === "menuDeck") {
        ctx.drawImage(assets.editText, menu2X, menu2Y, menu2W, menu2H);

        const deckImageMap = {
          blue: assets.deckb,
          red: assets.deckr,
          yellow: assets.decky,
          green: assets.deckg,
          rainbow: assets.deckn,
          white: assets.deckw,
        };

        const colors = [
          settingsRef.game.deckColor1,
          settingsRef.game.deckColor2,
          settingsRef.game.deckColor3,
        ];
        const names = [
          settingsRef.game.deckName1,
          settingsRef.game.deckName2,
          settingsRef.game.deckName3,
        ];

        for (let i = 0; i < 3; i++) {
          const color = colors[i];
          const img = deckImageMap[color];

          if (hoverStates.menuDeck[i]) {
            deckOffset[i] = Math.min(Math.PI * 4, deckOffset[i] + dt * 0.05);
          } else {
            deckOffset[i] = 0;
          }

          const shake = Math.sin(deckOffset[i]) * (menu2W * 0.005);
          const lift = settingsRef.ui.deckSelected === i ? -menu2H * 0.02 : 0;

          ctx.drawImage(
            img,
            menu2X + menu2W * (0.2 + i * 0.25) + shake,
            menu2Y + menu2H * 0.4 + lift,
            (menu2H * 0.1) / (assets.deckw.height / assets.deckw.width),
            menu2H * 0.1,
          );
          ctx.font = `${menu2H * 0.05}px Komorebi`;
          ctx.fillText(
            names[i],
            menu2X + menu2W * (0.2 + 0.06 + i * 0.25),
            menu2Y + menu2H * 0.55,
          );
        }
        if (hoverStates.org) {
          ctx.drawImage(
            assets.btnOrgHover,
            menu2X + menu2W * 0.35,
            menu2Y + menu2H * 0.8,
            menu2W * 0.3,
            menu2W * 0.3 * (assets.btnOrg.height / assets.btnOrg.width),
          );
        } else {
          ctx.drawImage(
            assets.btnOrg,
            menu2X + menu2W * 0.35,
            menu2Y + menu2H * 0.8,
            menu2W * 0.3,
            menu2W * 0.3 * (assets.btnOrg.height / assets.btnOrg.width),
          );
        }
      } else if (screen === "menuSetting") {
        ctx.drawImage(assets.settingText, menu2X, menu2Y, menu2W, menu2H);
        if (settingsRef.ui.bgmEnabled) {
          ctx.drawImage(
            assets.trueActive,
            menu2X + menu2W * 0.5,
            menu2Y + menu2H * 0.12,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falsePassive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.12,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        } else {
          ctx.drawImage(
            assets.truePassive,
            menu2X + menu2W * 0.5,
            menu2Y + menu2H * 0.12,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falseActive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.12,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        }
        if (settingsRef.ui.seEnabled) {
          ctx.drawImage(
            assets.trueActive,
            menu2X + menu2W * 0.5,
            menu2Y + menu2H * 0.29,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falsePassive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.29,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        } else {
          ctx.drawImage(
            assets.truePassive,
            menu2X + menu2W * 0.5,
            menu2Y + menu2H * 0.29,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.falseActive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.29,
            (menu2H * 0.13) /
              (assets.truePassive.height / assets.truePassive.width),
            menu2H * 0.13,
          );
        }
        if (settingsRef.ui.deviceMode === "mouse") {
          ctx.drawImage(
            assets.clickActive,
            menu2X + menu2W * 0.4,
            menu2Y + menu2H * 0.47,
            (menu2H * 0.13) /
              (assets.clickPassive.height / assets.clickPassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.tapPassive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.47,
            (menu2H * 0.13) /
              (assets.clickPassive.height / assets.clickPassive.width),
            menu2H * 0.13,
          );
        } else {
          ctx.drawImage(
            assets.clickPassive,
            menu2X + menu2W * 0.4,
            menu2Y + menu2H * 0.47,
            (menu2H * 0.13) /
              (assets.clickPassive.height / assets.clickPassive.width),
            menu2H * 0.13,
          );
          ctx.drawImage(
            assets.tapActive,
            menu2X + menu2W * 0.7,
            menu2Y + menu2H * 0.47,
            (menu2H * 0.13) /
              (assets.clickPassive.height / assets.clickPassive.width),
            menu2H * 0.13,
          );
        }
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
      backX = dx - btnW * 0.55;
      backY = baseY = dy + H * 0.05;
    }
    ctx.drawImage(assets.buttonFrame1, backX + backOffset, backY, btnW, btnH);
    const backImg = assets.backText;
    if (backImg) {
      const textH = btnH * 0.8;
      const textW = textH / (backImg.height / backImg.width);
      let textX = backX + btnW * 0.5;
      const textY = backY + btnH * 0.1;
      if (!layoutIsWide) {
        textX = backX + btnW * 0.55;
      }

      ctx.drawImage(backImg, textX, textY, textW, textH);
    }
  } else if (screen === "make") {
    // スマホ用　　　　PCやタブレットの画面表示はrendererUIで
    const attrs = [
      "des",
      "gen",
      "dis",
      "sup",
    ] as (keyof typeof assets.cardAssets)[];

    if (ratio < 1) {
      const baseX = dx + W * 0.02;
      let baseY = dy + H * 0.2;
      let cardPoolW = W - W * 0.05;
      let cardPoolH = H - H * 0.2;
      const cardAspectRatio =
        assets.cardAssets.des[1].height / assets.cardAssets.des[1].width;
      const cardW = cardPoolW / 3 - cardPoolH * 0.02;
      const cardH = cardW * cardAspectRatio;
      const carddx = cardPoolW / 3;
      const carddy = cardH + carddx - cardW;

      let n = 5;
      if (settingsRef.ui.deviceMode === "touch") n = 1;
      if (settingsRef.ui.scrollY < 0) settingsRef.ui.scrollY = 0;
      if (
        settingsRef.ui.scrollY >
        ((cardW * cardAspectRatio * 35 - cardPoolH) * n) / 5
      )
        settingsRef.ui.scrollY =
          ((cardW * cardAspectRatio * 35 - cardPoolH) * n) / 5;

      for (let a = 0; a < attrs.length; a++) {
        for (let i = 1; i <= 3; i++) {
          const img = assets.cardAssets[attrs[a]][i];
          if (!img || !img.complete) continue;

          const x = baseX + (i - 1) * carddx;
          const y = baseY + a * 2 * carddy - settingsRef.ui.scrollY / n;

          ctx.drawImage(img, x, y, cardW, cardH);
        }
        for (let i = 4; i <= 5; i++) {
          let shiftCard = 0;
          if (settingsRef.ui.isShift) {
            shiftCard = 2;
          }
          const img = assets.cardAssets[attrs[a]][i + shiftCard];
          if (!img || !img.complete) continue;

          const x = baseX + (i - 4) * carddx;
          const y = baseY + (a * 2 + 1) * carddy - settingsRef.ui.scrollY / n;

          ctx.drawImage(img, x, y, cardW, cardH);
        }
      }
    }
    // カードホバー-------------どの画面比でも

    let isPoolWide = true;

    let baseX = dx + W * 0.02;
    let baseY = dy + H * 0.02;

    const deckListW =
      H * 0.95 * (assets.deckList.width / assets.deckList.height);
    let cardPoolW = W - deckListW - W * 0.05;
    let cardPoolH = H - H * 0.2;

    if (!layoutIsWide) {
      baseY = dy + H * 0.2;
      cardPoolW = W - W * 0.05;
    }
    const cardAspectRatio =
      assets.cardAssets.des[1].height / assets.cardAssets.des[1].width;
    if (cardPoolH / 4 / (cardPoolW / 5) < cardAspectRatio) {
      isPoolWide = false;
    }

    let cardH = cardPoolH / 4 - cardPoolH * 0.01;
    let cardW = cardH / cardAspectRatio;
    let carddx = cardPoolW / 5;
    let carddy = cardPoolH / 4;
    if (isPoolWide) {
      cardW = cardPoolW / 5 - cardPoolW * 0.01;
      cardH = cardW * cardAspectRatio;
    }

    if (ratio < 1) {
      const cardW = cardPoolW / 3 - cardPoolH * 0.02;
      const cardH = cardW * cardAspectRatio;
      const carddx = cardPoolW / 3;
      const carddy = cardH + carddx - cardW;

      let n = 5;
      if (settingsRef.ui.deviceMode === "touch") n = 1;
      if (settingsRef.ui.scrollY < 0) settingsRef.ui.scrollY = 0;
      if (
        settingsRef.ui.scrollY >
        ((cardW * cardAspectRatio * 35 - cardPoolH) * n) / 5
      )
        settingsRef.ui.scrollY =
          ((cardW * cardAspectRatio * 35 - cardPoolH) * n) / 5;

      for (let a = 0; a < attrs.length; a++) {
        for (let i = 1; i <= 3; i++) {
          const deck = settingsRef.game.editDeck;
          const count = deck.filter(
            (c: CardID) => c.attr === attrs[a] && c.index === i,
          ).length;

          const isFull = count >= 4;
          if (isFull) {
            ctx.filter = "grayscale(100%)";
            const img = assets.cardAssets[attrs[a]][i];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 1) * carddx;
            const y = baseY + a * 2 * carddy - settingsRef.ui.scrollY / n;
            ctx.drawImage(img, x, y, cardW, cardH);
          } else if (hoverStates.hoverCards[attrs[a]][i - 1]) {
            ctx.filter = "none";
            const img = assets.cardAssets[attrs[a]][i];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 1) * carddx;
            const y = baseY + a * 2 * carddy - settingsRef.ui.scrollY / n;
            ctx.drawImage(
              img,
              x - cardPoolW * 0.005,
              y - cardPoolH * 0.005,
              cardW + cardPoolW * 0.01,
              cardH + cardPoolH * 0.01,
            );
          }
          // const img = assets.cardAssets[attrs[a]][i];
          // if (!img || !img.complete) continue;

          // const x = baseX + (i - 1) * carddx;
          // const y = baseY + a * 2 * carddy - settingsRef.ui.scrollY / n;

          // ctx.drawImage(img, x, y, cardW, cardH);
        }
        for (let i = 4; i <= 5; i++) {
          let shiftCard = 0;
          if (settingsRef.ui.isShift) {
            shiftCard = 2;
          }
          const deck = settingsRef.game.editDeck;
          let count = deck.filter(
            (c: CardID) => c.attr === attrs[a] && c.index === i,
          ).length;
          if (i > 3) {
            count += deck.filter(
              (c: CardID) => c.attr === attrs[a] && c.index === i + 2,
            ).length;
          }

          const isFull = count >= 4;
          if (isFull) {
            ctx.filter = "grayscale(100%)";
            const img = assets.cardAssets[attrs[a]][i + shiftCard];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 4) * carddx;
            const y = baseY + (a * 2 + 1) * carddy - settingsRef.ui.scrollY / n;
            ctx.drawImage(img, x, y, cardW, cardH);
          } else if (hoverStates.hoverCards[attrs[a]][i - 1]) {
            ctx.filter = "none";
            const img = assets.cardAssets[attrs[a]][i + shiftCard];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 4) * carddx;
            const y = baseY + (a * 2 + 1) * carddy - settingsRef.ui.scrollY / n;
            ctx.drawImage(
              img,
              x - cardW * 0.02,
              y - cardH * 0.02,
              cardW + cardW * 0.04,
              cardH + cardH * 0.04,
            );
          }
          // const img = assets.cardAssets[attrs[a]][i];
          // if (!img || !img.complete) continue;
          // const x = baseX + (i - 4) * carddx;
          // const y = baseY + (a * 2 + 1) * carddy - settingsRef.ui.scrollY / n;
          // ctx.drawImage(img, x, y, cardW, cardH);
        }
      }
    } else {
      for (let a = 0; a < attrs.length; a++) {
        for (let i = 1; i <= 5; i++) {
          let shiftCard = 0;
          if (settingsRef.ui.isShift && i > 3) {
            shiftCard = 2;
          }
          const deck = settingsRef.game.editDeck;
          let count = deck.filter(
            (c: CardID) => c.attr === attrs[a] && c.index === i,
          ).length;
          if (i > 3) {
            count += deck.filter(
              (c: CardID) => c.attr === attrs[a] && c.index === i + 2,
            ).length;
          }

          const isFull = count >= 4;
          if (isFull) {
            ctx.filter = "grayscale(100%)";
            const img = assets.cardAssets[attrs[a]][i + shiftCard];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 1) * carddx;
            const y = baseY + a * carddy;
            ctx.drawImage(img, x, y, cardW, cardH);
          } else if (hoverStates.hoverCards[attrs[a]][i - 1]) {
            ctx.filter = "none";
            const img = assets.cardAssets[attrs[a]][i + shiftCard];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 1) * carddx;
            const y = baseY + a * carddy;
            ctx.drawImage(
              img,
              x - cardW * 0.02,
              y - cardH * 0.02,
              cardW + cardW * 0.04,
              cardH + cardH * 0.04,
            );
          } else if (shiftCard == 2) {
            ctx.filter = "none";
            const img = assets.cardAssets[attrs[a]][i + shiftCard];
            if (!img || !img.complete) continue;
            const x = baseX + (i - 1) * carddx;
            const y = baseY + a * carddy;
            ctx.drawImage(img, x, y, cardW, cardH);
          }
        }
      }
    }
    ctx.filter = "none";

    // 戻る
    baseX = dx + W * 0.01;
    baseY = dy + H * 0.1;
    let btnW = H * 0.45;
    const btnH =
      btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);
    const offsetY = H * 0.15;

    if (hoverStates.back) {
      backOffset = Math.min(btnW * 0.1, backOffset + dt * 0.4);
    } else {
      backOffset = Math.max(0, backOffset - dt * 0.6);
    }
    let backX = baseX - H * 0.2;
    let backY = baseY + offsetY * 5 - H * 0.03;
    if (!layoutIsWide) {
      backX = dx - btnW * 0.6;
      backY = baseY = dy + H * 0.05;
    }

    // デッキボタン(スマホ用)
    if (!layoutIsWide) {
      ctx.drawImage(
        assets.buttonFrame1,
        backX + W + H * 0.05,
        backY,
        btnW,
        btnH,
      );
      const btnDeckImg = assets.btnDeck;
      if (btnDeckImg) {
        const textH = btnH * 0.8;
        const textW = textH / (btnDeckImg.height / btnDeckImg.width);
        let textX = backX + W + H * 0.05 + btnW * 0.07;
        const textY = backY + btnH * 0.1;

        ctx.drawImage(btnDeckImg, textX, textY, textW, textH);
      }
    }

    if (layoutIsWide || settingsRef.ui.openDeckList) {
      // デッキリスト下
      let deckListH = H * 0.95;
      let deckListW =
        deckListH * (assets.deckList.width / assets.deckList.height);
      if (deckListW > W) {
        deckListW = W;
        deckListH =
          deckListW / (assets.deckList.width / assets.deckList.height);
      }
      if (effectTimers.deckListClose == 0) {
        ctx.drawImage(
          assets.deckList,
          dx + W - deckListW,
          dy -
            (effectTimers.screenTransition * H) / 200 -
            (effectTimers.deckListOpen * H) / 100,
          deckListW,
          deckListH,
        );
      } else {
        ctx.drawImage(
          assets.deckList,
          dx + W - deckListW,
          dy -
            (effectTimers.screenTransition * H) / 200 -
            ((200 - effectTimers.deckListClose) * H) / 100,
          deckListW,
          deckListH,
        );
      }

      // カードバー^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v
      const baseX = dx + W - deckListW + deckListH * (1 / 0.95) * 0.041; //0.25 0.41
      const baseY = dy;
      const cardBarH = (deckListH * (1 / 0.95) * 1.151) / 20;
      const cardBarW =
        (cardBarH * assets.cardBarAssets.des[1].width) /
        assets.cardBarAssets.des[1].height;
      const cardBardy = cardBarH * 0.8;
      const deck = settingsRef.game.editDeck;

      for (let i = 0; i < deck.length; i++) {
        const card = deck[i];

        const img = assets.cardBarAssets[card.attr][card.index];
        if (!img || !img.complete) continue;

        const x = baseX;
        const y = baseY + i * cardBardy;

        if (effectTimers.deckListClose == 0) {
          if (hoverStates.hoverDeckIndex == i) {
            ctx.drawImage(
              img,
              x - H * 0.015,
              y - (effectTimers.deckListOpen * H) / 100,
              cardBarW,
              cardBarH,
            );
          } else {
            ctx.drawImage(
              img,
              x,
              y - (effectTimers.deckListOpen * H) / 100,
              cardBarW,
              cardBarH,
            );
          }
        } else {
          if (hoverStates.hoverDeckIndex == i) {
            ctx.drawImage(
              img,
              x - H * 0.015,
              y - ((200 - effectTimers.deckListClose) * H) / 100,
              cardBarW,
              cardBarH,
            );
          } else {
            ctx.drawImage(
              img,
              x,
              y - ((200 - effectTimers.deckListClose) * H) / 100,
              cardBarW,
              cardBarH,
            );
          }
        }
      }

      // デッキリスト上

      if (effectTimers.deckListClose == 0) {
        ctx.drawImage(
          assets.deckListBar,
          dx + W - deckListW,
          dy -
            (effectTimers.screenTransition * H) / 200 -
            (effectTimers.deckListOpen * H) / 100,
          deckListW,
          deckListH,
        );
      } else {
        ctx.drawImage(
          assets.deckListBar,
          dx + W - deckListW,
          dy -
            (effectTimers.screenTransition * H) / 200 -
            ((200 - effectTimers.deckListClose) * H) / 100,
          deckListW,
          deckListH,
        );
      }
    }
    // 戻る
    ctx.drawImage(assets.buttonFrame1, backX + backOffset, backY, btnW, btnH);
    const backImg = assets.backText;
    if (backImg) {
      const textH = btnH * 0.8;
      const textW = textH / (backImg.height / backImg.width);
      let textX = backX + btnW * 0.5;
      const textY = backY + btnH * 0.1;
      if (!layoutIsWide) {
        textX = backX + btnW * 0.6;
      }

      ctx.drawImage(backImg, textX, textY, textW, textH);
    }
    // 裏カード
    if (hoverStates.shift) {
      shiftOffset = Math.min(btnW * 0.1, shiftOffset + dt * 0.4);
    } else {
      shiftOffset = Math.max(0, shiftOffset - dt * 0.6);
    }
    const rightX = dx + W - btnW * 0.6;
    const rightY = dy + H * 0.75;
    ctx.drawImage(
      assets.buttonFrame1,
      rightX - shiftOffset,
      rightY,
      btnW,
      btnH,
    );
    const btnShiftImg = assets.btnShift;
    if (btnShiftImg) {
      const textH = btnH * 0.8;
      const textW = textH / (btnShiftImg.height / btnShiftImg.width);
      let textX = rightX + btnW * 0.12;
      const textY = rightY + btnH * 0.1;
      ctx.drawImage(btnShiftImg, textX - shiftOffset, textY, textW, textH);
    }
    // 保存
    if (hoverStates.save) {
      saveOffset = Math.min(btnW * 0.1, saveOffset + dt * 0.4);
    } else {
      saveOffset = Math.max(0, saveOffset - dt * 0.6);
    }
    ctx.drawImage(
      assets.buttonFrame1,
      rightX - saveOffset,
      rightY + btnH * 1.05,
      btnW,
      btnH,
    );
    const btnSaveImg = assets.btnSave;
    if (btnSaveImg) {
      const textH = btnH * 0.8;
      const textW = textH / (btnSaveImg.height / btnSaveImg.width);
      let textX = rightX + btnW * 0.14;
      const textY = rightY + btnH * 1.05 + btnH * 0.1;
      ctx.drawImage(btnSaveImg, textX - saveOffset, textY, textW, textH);
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

import { assets } from "../canvas/assets";

// 共通レイアウト計算
function computeLayout(ratio: number) {
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

  return { W, H, dx, dy, layoutIsWide: ratio > 1.2 };
}

// Start Button

export function isInsideStartButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

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

// Menu Button

export function isInsideMenuButton(
  index: number,
  x: number,
  y: number,
  ratio: number,
) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

  let baseX = dx + W * 0.01;
  let baseY = dy + H * 0.1;
  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);
  let offsetX = H * 0.053;

  if (!layoutIsWide) {
    btnW = H * 0.4;
    baseX = dx + W * 0.5 - btnW / 2;
    baseY = dy + H * 0.2;
    offsetX = 0;
  }

  const offsetY = H * 0.15;
  const btnX = baseX + offsetX * index;
  const btnY = baseY + offsetY * index;

  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}

// Quick Menu Button

export function isInsideQuickMenuButton(
  index: number,
  x: number,
  y: number,
  ratio: number,
) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

  if (layoutIsWide) return false;

  const qBtnW = W * 0.16;
  const qBtnH =
    qBtnW * (assets.quickMenu[0].height / assets.quickMenu[0].width);

  const margin = W * 0.02;
  const totalWidth = qBtnW * 5 + margin * 4;

  const qBaseX = dx + (W - totalWidth) / 2;
  const qBaseY = dy + H * 0.9 - qBtnH;

  const btnX = qBaseX + index * (qBtnW + margin);
  const btnY = qBaseY;

  return x >= btnX && x <= btnX + qBtnW && y >= btnY && y <= btnY + qBtnH;
}

// Back Button

export function isInsideBackButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

  let baseX = dx + W * 0.01;
  let baseY = dy + H * 0.1;
  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);
  const offsetY = H * 0.15;

  let backX = baseX - H * 0.15;
  let backY = baseY + offsetY * 5 - H * 0.03;

  if (!layoutIsWide) {
    backX = dx - btnW / 2;
    backY = dy + H * 0.05;
  }

  return x >= backX && x <= backX + btnW && y >= backY && y <= backY + btnH;
}

// BGM / SE / Device Buttons

function calcMenu2Layout(ratio: number) {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

  let menu2X = 0,
    menu2Y = 0,
    menu2W = 0,
    menu2H = 0;

  if (layoutIsWide) {
    menu2W = dx + W - menu2X - 100;
    menu2H = Math.min(
      H * 0.9,
      menu2W * (assets.gameSettingUI.height / assets.gameSettingUI.width),
    );
    menu2W =
      menu2H / (assets.gameSettingUI.height / assets.gameSettingUI.width);
    menu2X = 500;
    menu2Y = dy + H * 0.05 + H * 0.5 - menu2W / 2;
  } else {
    menu2W = W * 0.9;
    menu2H = Math.min(
      H * 0.7 - W * 0.16,
      menu2W * (assets.gameSettingUI.height / assets.gameSettingUI.width),
    );
    menu2W =
      menu2H / (assets.gameSettingUI.height / assets.gameSettingUI.width);
    menu2X = dx - W * 0.05 + W * 0.5 - menu2H / 2;
    menu2Y = dy - H * 0.05 + H * 0.5 - menu2W / 2;
  }

  return { menu2X, menu2Y, menu2W, menu2H };
}

export function isInsideBgmTrue(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.truePassive.height / assets.truePassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.5;
  const by = menu2Y + menu2H * 0.12;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function isInsideBgmFalse(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.truePassive.height / assets.truePassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.7;
  const by = menu2Y + menu2H * 0.12;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function isInsideSeTrue(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.truePassive.height / assets.truePassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.5;
  const by = menu2Y + menu2H * 0.29;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function isInsideSeFalse(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.truePassive.height / assets.truePassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.7;
  const by = menu2Y + menu2H * 0.29;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function isInsideDeviceMouse(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.clickPassive.height / assets.clickPassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.4;
  const by = menu2Y + menu2H * 0.47;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function isInsideDeviceTouch(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw =
    (menu2H * 0.13) / (assets.clickPassive.height / assets.clickPassive.width);
  const bh = menu2H * 0.13;
  const bx = menu2X + menu2W * 0.7;
  const by = menu2Y + menu2H * 0.47;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

// menu2 Deck Button
export function isInsideMenu2DeckButton(
  index: number,
  x: number,
  y: number,
  ratio: number,
) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);

  const btnX = menu2X + menu2W * (0.2 + index * 0.25);
  const btnY = menu2Y + menu2H * 0.4;

  const btnW = (menu2H * 0.1) / (assets.deckw.height / assets.deckw.width);
  const btnH = menu2H * 0.1;

  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}

// menu2 Deck 編成する Button
export function isInsideOrgButton(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);

  const btnX = menu2X + menu2W * 0.35;
  const btnY = menu2Y + menu2H * 0.8;

  const btnW = menu2W * 0.25;
  const btnH = menu2W * 0.2 * (assets.btnOrg.height / assets.btnOrg.width);

  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}

// make カード
export function detectCardHoverSingle(
  mouseX: number,
  mouseY: number,
  ratio: number,
  attr: keyof typeof assets.cardAssets,
  index: number, // 1〜5
): boolean {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);
  let isPoolWide = true;
  const baseX = dx + W * 0.02;
  const baseY = dy + H * 0.02;
  const deckListW = H * 0.95 * (assets.deckList.width / assets.deckList.height);
  const cardPoolW = W - deckListW - W * 0.05;
  const cardPoolH = H - H * 0.2;
  const cardAspectRatio =
    assets.cardAssets.des[1].height / assets.cardAssets.des[1].width;
  if (layoutIsWide) {
    if (cardPoolH / 4 / (cardPoolW / 5) < cardAspectRatio) {
      isPoolWide = false;
    }
  }
  let cardH = cardPoolH / 4 - cardPoolH * 0.01;
  let cardW = cardH / cardAspectRatio;
  let carddx = cardPoolW / 5;
  let carddy = cardPoolH / 4;
  if (isPoolWide) {
    cardW = cardPoolW / 5 - cardPoolW * 0.01;
    cardH = cardW * cardAspectRatio;
  }
  const attrs = [
    "des",
    "gen",
    "dis",
    "sup",
  ] as (keyof typeof assets.cardAssets)[];
  const a = attrs.indexOf(attr);
  if (a === -1) return false;
  const x = baseX + (index - 1) * carddx;
  const y = baseY + a * carddy;
  return (
    mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH
  );
}

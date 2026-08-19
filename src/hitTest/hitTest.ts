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
    backX = dx - btnW * 0.7;
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
    menu2X = 500;
    menu2W = dx + W - menu2X - 100;
    menu2H = Math.min(
      H * 0.9,
      menu2W * (assets.gameSettingUI.height / assets.gameSettingUI.width),
    );
    menu2W =
      menu2H / (assets.gameSettingUI.height / assets.gameSettingUI.width);
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
  scrollY: number,
  devicemode: "click" | "touch",
): boolean {
  const { W, H, dx, dy, layoutIsWide } = computeLayout(ratio);

  const attrs = [
    "des",
    "gen",
    "dis",
    "sup",
  ] as (keyof typeof assets.cardAssets)[];

  const a = attrs.indexOf(attr);
  if (a === -1 || index < 1 || index > 5) return false;

  const cardAspectRatio =
    assets.cardAssets.des[1].height / assets.cardAssets.des[1].width;

  // ============================================================
  // パターン①
  // layoutIsWide === true
  // rendererUI と同じ 5列 × 4行
  // ============================================================
  if (layoutIsWide) {
    const baseX = dx + W * 0.02;
    const baseY = dy + H * 0.02;

    const deckListW =
      H * 0.95 * (assets.deckList.width / assets.deckList.height);

    const cardPoolW = W - deckListW - W * 0.05;
    const cardPoolH = H - H * 0.2;

    let isPoolWide = true;

    if (cardPoolH / 4 / (cardPoolW / 5) < cardAspectRatio) {
      isPoolWide = false;
    }

    let cardH = cardPoolH / 4 - cardPoolH * 0.01;
    let cardW = cardH / cardAspectRatio;

    const carddx = cardPoolW / 5;
    const carddy = cardPoolH / 4;

    if (isPoolWide) {
      cardW = cardPoolW / 5 - cardPoolW * 0.01;
      cardH = cardW * cardAspectRatio;
    }

    const x = baseX + (index - 1) * carddx;
    const y = baseY + a * carddy;

    return (
      mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH
    );
  }

  // ============================================================
  // パターン②
  // layoutIsWide === false && ratio >= 1
  // rendererUI と同じ 5列 × 4行
  // ただし baseY / cardPoolW が異なる
  // ============================================================
  if (ratio >= 1) {
    const baseX = dx + W * 0.02;
    const baseY = dy + H * 0.2;

    const cardPoolW = W - W * 0.05;
    const cardPoolH = H - H * 0.2;

    let isPoolWide = true;

    if (cardPoolH / 4 / (cardPoolW / 5) < cardAspectRatio) {
      isPoolWide = false;
    }

    let cardH = cardPoolH / 4 - cardPoolH * 0.01;
    let cardW = cardH / cardAspectRatio;

    const carddx = cardPoolW / 5;
    const carddy = cardPoolH / 4;

    if (isPoolWide) {
      cardW = cardPoolW / 5 - cardPoolW * 0.01;
      cardH = cardW * cardAspectRatio;
    }

    const x = baseX + (index - 1) * carddx;
    const y = baseY + a * carddy;

    return (
      mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH
    );
  }

  // ============================================================
  // パターン③
  // ratio < 1
  // rendererEffect と同じ 3列 × 8段 + scrollY
  // ============================================================
  {
    const baseX = dx + W * 0.02;
    const baseY = dy + H * 0.2;

    const cardPoolW = W - W * 0.05;
    const cardPoolH = H - H * 0.2;

    const cardW = cardPoolW / 3 - cardPoolH * 0.02;
    const cardH = cardW * cardAspectRatio;

    const carddx = cardPoolW / 3;
    const carddy = cardH + carddx - cardW;

    // rendererEffect と同じ
    let n = 5;
    if (devicemode == "touch") {
      n = 1;
    }

    // rendererEffect と同じ scrollY の範囲制限
    let actualScrollY = scrollY;

    let x: number;
    let y: number;

    if (index <= 3) {
      // 1〜3
      x = baseX + (index - 1) * carddx;
      y = baseY + a * 2 * carddy - actualScrollY / n;
    } else {
      // 4〜5
      x = baseX + (index - 4) * carddx;
      y = baseY + (a * 2 + 1) * carddy - actualScrollY / n;
    }

    return (
      mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH
    );
  }
}

// Card Bar
export function isInsideDeckBar(
  index: number,
  x: number,
  y: number,
  ratio: number,
) {
  const { W, H, dx, dy } = computeLayout(ratio);
  let deckListH = H * 0.95;
  let deckListW = deckListH * (assets.deckList.width / assets.deckList.height);
  if (deckListW > W) {
    deckListW = W;
    deckListH = deckListW / (assets.deckList.width / assets.deckList.height);
  }
  const baseX = dx + W - deckListW + H * 0.041;
  const baseY = dy;
  const cardBarH = (H * 1.151) / 20;
  const cardBarW =
    (cardBarH * assets.cardBarAssets.des[1].width) /
    assets.cardBarAssets.des[1].height;
  const cardBardy = cardBarH * 0.8;
  const barX = baseX;
  const barY = baseY + index * cardBardy;
  return x >= barX && x <= barX + cardBarW && y >= barY && y <= barY + cardBarH;
}

// deck button スマホ用
export function isInsideDeckButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy } = computeLayout(ratio);

  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);

  const deckX = dx - btnW * 0.6 + W + H * 0.05;
  const deckY = dy + H * 0.05;

  return x >= deckX && x <= deckX + btnW && y >= deckY && y <= deckY + btnH;
}

// 裏カード
export function isInsideShiftButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy } = computeLayout(ratio);

  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);

  const deckX = dx + W - btnW * 0.6;
  const deckY = dy + H * 0.75;

  return x >= deckX && x <= deckX + btnW && y >= deckY && y <= deckY + btnH;
}
// 保存
export function isInsideSaveButton(x: number, y: number, ratio: number) {
  const { W, H, dx, dy } = computeLayout(ratio);

  let btnW = H * 0.45;
  const btnH = btnW * (assets.buttonFrame1.height / assets.buttonFrame1.width);

  const deckX = dx + W - btnW * 0.6;
  const deckY = dy + H * 0.75 + btnH * 1.05;

  return x >= deckX && x <= deckX + btnW && y >= deckY && y <= deckY + btnH;
}

// Menu2 オフライン
//矢印
export function isInsideArrowButton(
  x: number,
  y: number,
  ratio: number,
  i1: number,
  i2: number,
) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);

  const arrowW = menu2H * 0.08;
  const arrowH = menu2H * 0.08;

  for (let i = 0; i < 2; i++) {
    const yPos = menu2Y + menu2H * 0.21 + i * menu2H * 0.13;

    // 右矢印の位置
    const rightX = menu2X + menu2W * 0.8;
    const rightY = yPos;

    if (
      x >= rightX &&
      x <= rightX + arrowW &&
      y >= rightY &&
      y <= rightY + arrowH &&
      i1 == i &&
      i2 == 0
    ) {
      return true;
    }

    // 左矢印の transform を展開した見た目の位置
    const Tx = menu2X + menu2W * 0.8 - arrowW * 0.5 + arrowW;
    const leftX = Tx - (menu2W * 0.3 + arrowW);
    const leftY = yPos;

    if (
      x >= leftX &&
      x <= leftX + arrowW &&
      y >= leftY &&
      y <= leftY + arrowH &&
      i1 == i &&
      i2 == 1
    ) {
      return true;
    }
  }

  return false;
}
// デッキ
export function isInsideGameSettingDeckButton(
  index: number,
  x: number,
  y: number,
  ratio: number,
) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const deckImg = assets.deckw;

  const btnX = menu2X + menu2W * 0.55 + index * menu2W * 0.22;
  const btnY = menu2Y + menu2H * 0.47;
  const btnW = menu2W * 0.1;
  const btnH = menu2W * 0.1 * (deckImg.height / deckImg.width);

  return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
}
// デッキ変更フレーム
export function isInsideChangingDeckFrame(
  x: number,
  y: number,
  ratio: number,
  index: number,
) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bx = menu2X + menu2W * 0.35 + index * menu2W * 0.22;
  const by = menu2Y + menu2H * 0.57;
  const bw = menu2W * 0.5;
  const bh = bw * (assets.uiframe1.height / assets.uiframe1.width);
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
// デッキ変更デッキ
export function isInsideChangingDeckDeck(
  x: number,
  y: number,
  ratio: number,
  index: number,
  index2: number,
) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bx =
    menu2X + menu2W * 0.38 + index * menu2W * 0.22 + index2 * menu2W * 0.11;
  const by = menu2Y + menu2H * 0.59;
  const bw = menu2W * 0.1;
  const bh = bw * (assets.deckw.height / assets.deckw.width);
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
// シフトカード
export function isInsideShiftTrue(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bh = menu2H * 0.13;
  const bw = bh / (assets.truePassive.height / assets.truePassive.width);
  const bx = menu2X + menu2W * 0.47;
  const by = menu2Y + menu2H * 0.58;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
export function isInsideShiftFalse(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bh = menu2H * 0.13;
  const bw = bh / (assets.truePassive.height / assets.truePassive.width);
  const bx = menu2X + menu2W * 0.68;
  const by = menu2Y + menu2H * 0.58;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}
//ゲームスタート
export function isInsideGameSTartButton(x: number, y: number, ratio: number) {
  const { menu2X, menu2Y, menu2W, menu2H } = calcMenu2Layout(ratio);
  const bw = menu2W * 0.5;
  const bh = bw * (assets.gameStart.height / assets.gameStart.width);
  const bx = menu2X + menu2W * 0.5 - bw / 2;
  const by = menu2Y + menu2H * 0.75;
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

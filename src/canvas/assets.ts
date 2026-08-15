// src/canvas/assets.ts
export const assets = {
  titleBg: new Image(),
  title: new Image(),
  btnStart: new Image(),
  btnStartHover: new Image(),
  menuBg: new Image(),
  leftWhite: new Image(),
  rightBlack: new Image(),
  buttonFrame1: new Image(),
  menuText: [] as HTMLImageElement[],
  backText: new Image(),
  quickMenu: [] as HTMLImageElement[],
  gameSettingUI: new Image(),
  settingText: new Image(),
  truePassive: new Image(),
  trueActive: new Image(),
  falsePassive: new Image(),
  falseActive: new Image(),
  clickPassive: new Image(),
  clickActive: new Image(),
  tapPassive: new Image(),
  tapActive: new Image(),
  editText: new Image(),
  deckr: new Image(),
  deckg: new Image(),
  deckb: new Image(),
  decky: new Image(),
  deckw: new Image(),
  deckn: new Image(),
  btnOrg: new Image(),
  btnOrgHover: new Image(),
  makeBg: new Image(),
  deckList: new Image(),
  deckListBar: new Image(),
  btnDeck: new Image(),

  cardAssets: {
    des: [] as HTMLImageElement[],
    gen: [] as HTMLImageElement[],
    dis: [] as HTMLImageElement[],
    sup: [] as HTMLImageElement[],
  },
  cardBarAssets: {
    des: [] as HTMLImageElement[],
    gen: [] as HTMLImageElement[],
    dis: [] as HTMLImageElement[],
    sup: [] as HTMLImageElement[],
  },
};

assets.titleBg.src = "/assets/backgrounds/city_scene.png";
assets.title.src = "/assets/ui/title.png";
assets.btnStart.src = "/assets/button/start.png";
assets.btnStartHover.src = "/assets/button/start_hover.png";
assets.menuBg.src = "/assets/backgrounds/neon_city1.png";
assets.leftWhite.src = "/assets/ui/left_white.png";
assets.rightBlack.src = "/assets/ui/right_black.png";
assets.buttonFrame1.src = "/assets/button/button_frame1.png";
assets.menuText[0] = new Image();
assets.menuText[0].src = "/assets/button/offline.png";
assets.menuText[1] = new Image();
assets.menuText[1].src = "/assets/button/online.png";
assets.menuText[2] = new Image();
assets.menuText[2].src = "/assets/button/help.png";
assets.menuText[3] = new Image();
assets.menuText[3].src = "/assets/button/makedeck.png";
assets.menuText[4] = new Image();
assets.menuText[4].src = "/assets/button/setting.png";
assets.backText.src = "/assets/button/back.png";
assets.quickMenu[0] = new Image();
assets.quickMenu[0].src = "/assets/button/offline_button.png";
assets.quickMenu[1] = new Image();
assets.quickMenu[1].src = "/assets/button/online_button.png";
assets.quickMenu[2] = new Image();
assets.quickMenu[2].src = "/assets/button/help_button.png";
assets.quickMenu[3] = new Image();
assets.quickMenu[3].src = "/assets/button/makedeck_button.png";
assets.quickMenu[4] = new Image();
assets.quickMenu[4].src = "/assets/button/setting_button.png";
assets.gameSettingUI.src = "/assets/ui/gamesetting.png";
assets.settingText.src = "/assets/ui/setting_text.png";
assets.truePassive.src = "/assets/button/true_passive.png";
assets.trueActive.src = "/assets/button/true_active.png";
assets.falsePassive.src = "/assets/button/false_passive.png";
assets.falseActive.src = "/assets/button/false_active.png";
assets.clickPassive.src = "/assets/button/click_passive.png";
assets.clickActive.src = "/assets/button/click_active.png";
assets.tapPassive.src = "/assets/button/tap_passive.png";
assets.tapActive.src = "/assets/button/tap_active.png";
assets.editText.src = "/assets/ui/edit_text.png";
assets.deckr.src = "/assets/cards_token/deckr.png";
assets.deckg.src = "/assets/cards_token/deckg.png";
assets.decky.src = "/assets/cards_token/decky.png";
assets.deckb.src = "/assets/cards_token/deckb.png";
assets.deckw.src = "/assets/cards_token/deckw.png";
assets.deckn.src = "/assets/cards_token/deckn.png";
assets.btnOrg.src = "/assets/button/organize.png";
assets.btnOrgHover.src = "/assets/button/organize_hover.png";
assets.makeBg.src = "/assets/backgrounds/restaurant.png";
assets.deckList.src = "/assets/ui/deck_list.png";
assets.deckListBar.src = "/assets/ui/deck_list_bar.png";
assets.btnDeck.src = "/assets/button/deck.png";

type Attr = keyof typeof assets.cardAssets;

for (const attr of ["des", "gen", "dis", "sup"] as Attr[]) {
  for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = `/assets/cards_token/${attr}/${i}.png`;
    assets.cardAssets[attr][i] = img;
  }
}
type AttrB = keyof typeof assets.cardBarAssets;

for (const attr of ["des", "gen", "dis", "sup"] as AttrB[]) {
  for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = `/assets/cards_token/${attr}/${i}b.png`;
    assets.cardBarAssets[attr][i] = img;
  }
}

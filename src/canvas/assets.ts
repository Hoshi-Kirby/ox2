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

  bgmTitle: new Audio("/assets/bgm/title.mp3"),
  bgmMenu: new Audio("/assets/bgm/main_menu.mp3"),
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

assets.bgmTitle.loop = true;
assets.bgmMenu.loop = true;
assets.bgmTitle.volume = 0.05;
assets.bgmMenu.volume = 0.03;

// const cache: Record<string, HTMLImageElement> = {};

// export function loadImage(path: string): Promise<HTMLImageElement> {
//   return new Promise((resolve) => {
//     if (cache[path]) {
//       resolve(cache[path]);
//       return;
//     }

//     const img = new Image();
//     img.src = path;

//     img.onload = () => {
//       cache[path] = img;
//       resolve(img);
//     };
//   });
// }

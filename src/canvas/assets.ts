// src/canvas/assets.ts

export const assets = {
  titleBg: new Image(),
  title: new Image(),
  btnStart: new Image(),
  btnStartHover: new Image(),
  menuBg: new Image(),
  leftWhite: new Image(),
  buttonFrame1: new Image(),
  menuText: [] as HTMLImageElement[],
  backText: new Image(),
};

assets.titleBg.src = "/assets/backgrounds/city_scene.png";
assets.title.src = "/assets/ui/title.png";
assets.btnStart.src = "/assets/button/start.png";
assets.btnStartHover.src = "/assets/button/start_hover.png";
assets.menuBg.src = "/assets/backgrounds/neon_city1.png";
assets.leftWhite.src = "/assets/ui/left_white.png";
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

export const audioAssets = {
  bgmTitle: new Audio("/assets/bgm/title.mp3"),
  bgmMenu: new Audio("/assets/bgm/main_menu.mp3"),

  seStart: new Audio("/assets/se/decision_tururun.wav"),
};

audioAssets.bgmTitle.loop = true;
audioAssets.bgmMenu.loop = true;

audioAssets.bgmTitle.volume = 0.05;
audioAssets.bgmMenu.volume = 0.03;

audioAssets.seStart.volume = 0.2;

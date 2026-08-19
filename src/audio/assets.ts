function loadBgm(src: string, volume: number): HTMLAudioElement {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = volume;
  return audio;
}

function loadSe(src: string, volume: number): HTMLAudioElement {
  const audio = new Audio(src);
  audio.loop = false;
  audio.volume = volume;
  return audio;
}

export const audioAssets = {
  bgmTitle: loadBgm("/assets/bgm/title.mp3", 0.05),
  bgmMenu: loadBgm("/assets/bgm/main_menu.mp3", 0.03),
  bgmMake: loadBgm("/assets/bgm/make_deck.mp3", 0.04),
  bgmGame: loadBgm("/assets/bgm/game.mp3", 0.03),

  seStart: loadSe("/assets/se/decision_tururun.wav", 0.2),
};

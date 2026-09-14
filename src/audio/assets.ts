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
  seHover: loadSe("/assets/se/cursor_kasha.wav", 0.1),
  seClick: loadSe("/assets/se/decision_ka.wav", 0.2),
  seBack: loadSe("/assets/se/back_futt.wav", 0.2),
  seCardDraw: loadSe("/assets/se/carddraw_pera.wav", 0.2),
  seCardFlip: loadSe("/assets/se/cardflip_pera.wav", 0.2),
  seCardDiscard: loadSe("/assets/se/cardback_syu.wav", 0.2),
  seCardRefresh: loadSe("/assets/se/cardback_syusyu.wav", 0.4),
  seCardSelect: loadSe("/assets/se/cardselect_pisi.wav", 0.2),
  seCardCansel: loadSe("/assets/se/cardcansel_za.wav", 0.4),
  seTokenPut: loadSe("/assets/se/tokenput_bisi.wav", 0.2),
  seTokenRemove: loadSe("/assets/se/tokenremove_hyu-w.wav", 0.2),
  seShot: loadSe("/assets/se/shot_dyukushu.wav", 0.2),
  seCostDown: loadSe("/assets/se/costdown_down.wav", 0.4),
  seCostUp: loadSe("/assets/se/costup_kui-n.wav", 0.2),
  sePageFlip: loadSe("/assets/se/pageflip_pera.wav", 0.5),
  sePause: loadSe("/assets/se/pause_ponnporo.wav", 0.2),
  seKO: loadSe("/assets/se/K.O._ka-n.wav", 0.2),
  seDon: loadSe("/assets/se/disp_don.wav", 0.2),
};

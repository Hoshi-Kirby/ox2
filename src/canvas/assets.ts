// src/canvas/assets.ts
function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

function loadImages(...srcs: string[]): HTMLImageElement[] {
  return srcs.map(loadImage);
}

function loadNumberedImages(
  path: string,
  count: number,
  suffix = "",
): HTMLImageElement[] {
  return Array.from({ length: count }, (_, i) =>
    loadImage(`${path}/${i}${suffix}.png`),
  );
}

export const assets = {
  titleBg: loadImage("/assets/backgrounds/city_scene.png"),
  title: loadImage("/assets/ui/title.png"),
  btnStart: loadImage("/assets/button/start.png"),
  btnStartHover: loadImage("/assets/button/start_hover.png"),
  menuBg: loadImage("/assets/backgrounds/neon_city1.png"),
  leftWhite: loadImage("/assets/ui/left_white.png"),
  rightBlack: loadImage("/assets/ui/right_black.png"),
  buttonFrame1: loadImage("/assets/button/button_frame1.png"),
  menuText: loadImages(
    "/assets/button/offline.png",
    "/assets/button/online.png",
    "/assets/button/help.png",
    "/assets/button/makedeck.png",
    "/assets/button/setting.png",
  ),
  backText: loadImage("/assets/button/back.png"),
  quickMenu: loadImages(
    "/assets/button/offline_button.png",
    "/assets/button/online_button.png",
    "/assets/button/help_button.png",
    "/assets/button/makedeck_button.png",
    "/assets/button/setting_button.png",
  ),
  gameSettingUI: loadImage("/assets/ui/gamesetting.png"),
  settingText: loadImage("/assets/ui/setting_text.png"),
  truePassive: loadImage("/assets/button/true_passive.png"),
  trueActive: loadImage("/assets/button/true_active.png"),
  falsePassive: loadImage("/assets/button/false_passive.png"),
  falseActive: loadImage("/assets/button/false_active.png"),
  clickPassive: loadImage("/assets/button/click_passive.png"),
  clickActive: loadImage("/assets/button/click_active.png"),
  tapPassive: loadImage("/assets/button/tap_passive.png"),
  tapActive: loadImage("/assets/button/tap_active.png"),
  editText: loadImage("/assets/ui/edit_text.png"),
  deckr: loadImage("/assets/cards_token/deckr.png"),
  deckg: loadImage("/assets/cards_token/deckg.png"),
  deckb: loadImage("/assets/cards_token/deckb.png"),
  decky: loadImage("/assets/cards_token/decky.png"),
  deckw: loadImage("/assets/cards_token/deckw.png"),
  deckn: loadImage("/assets/cards_token/deckn.png"),
  btnOrg: loadImage("/assets/button/organize.png"),
  btnOrgHover: loadImage("/assets/button/organize_hover.png"),
  makeBg: loadImage("/assets/backgrounds/restaurant.png"),
  deckList: loadImage("/assets/ui/deck_list.png"),
  deckListBar: loadImage("/assets/ui/deck_list_bar.png"),
  btnDeck: loadImage("/assets/button/deck.png"),
  btnShift: loadImage("/assets/button/shift.png"),
  btnSave: loadImage("/assets/button/save.png"),
  arrow: loadImages(
    "/assets/button/right_arrow.png",
    "/assets/button/right_arrow_hover.png",
    "/assets/button/right_arrow_click.png",
    "/assets/button/right_arrow_hover_click.png",
  ),
  initialHandSize: loadImages(
    "/assets/ui/0mai.png",
    "/assets/ui/3mai.png",
    "/assets/ui/5mai.png",
    "/assets/ui/10mai.png",
  ),
  firstPlayer: loadImages(
    "/assets/ui/o.png",
    "/assets/ui/x.png",
    "/assets/ui/random.png",
  ),
  uiframe1: loadImage("/assets/ui/cyber_frame1.png"),
  gameStart: loadImage("/assets/button/gamestart.png"),
  gameStartHover: loadImage("/assets/button/gamestart_hover.png"),
  gameBg: loadImage("/assets/backgrounds/neon_city.png"),
  ready: loadImage("/assets/ui/ready.png"),
  start: loadImage("/assets/ui/start!.png"),
  gameSet: loadImage("/assets/ui/gameset.png"),
  leftWipe: loadImage("/assets/ui/left_wipe.png"),
  rightWipe: loadImage("/assets/ui/right_wipe.png"),
  centerWipe: loadImage("/assets/ui/center_wipe.png"),
  turnEnd: loadImage("/assets/button/turnend.png"),
  turnEndHover: loadImage("/assets/button/turnend_hover.png"),
  turnEndUI: loadImage("/assets/UI/turnend.png"),
  neonLine: loadImage("/assets/ui/neon_line.png"),
  token: loadImages(
    "/assets/cards_token/token/o.png",
    "/assets/cards_token/token/x.png",
    "/assets/cards_token/token/ox.png",
    "/assets/cards_token/token/o_jump.png",
    "/assets/cards_token/token/x_jump.png",
    "/assets/cards_token/token/not.png",
    "/assets/cards_token/token/not.png",
  ),
  dot: loadImage("/assets/cards_token/token/dot.png"),
  noTurn: loadImage("/assets/ui/no_turn.png"),
  floor: loadImage("/assets/ui/floor.png"),
  floorMini: loadImage("/assets/cards_token/token/floor.png"),
  backCard: loadImages(
    "/assets/cards_token/backr.png",
    "/assets/cards_token/backg.png",
    "/assets/cards_token/backy.png",
    "/assets/cards_token/backb.png",
    "/assets/cards_token/backn.png",
  ),
  pauseBtn: loadImage("/assets/button/pause.png"),
  pause: loadImage("/assets/ui/pause.png"),
  pauseContinue: loadImage("/assets/button/pause_continue.png"),
  pauseRestart: loadImage("/assets/button/pause_restart.png"),
  pauseEnd: loadImage("/assets/button/pause_end.png"),
  pauseLight: loadImage("/assets/button/pause_light.png"),

  resultFrameW: loadImage("/assets/ui/result_frame_w.png"),
  resultFrameH: loadImage("/assets/ui/result_frame_h.png"),
  winner: loadImage("/assets/ui/winner.png"),
  winnerO: loadImage("/assets/ui/winner_o.png"),
  winnerX: loadImage("/assets/ui/winner_x.png"),
  hide: loadImage("/assets/ui/hide.png"),
  show: loadImage("/assets/ui/show.png"),
  end: loadImage("/assets/button/end.png"),
  endHover: loadImage("/assets/button/end_hover.png"),
  onemore: loadImage("/assets/button/onemore.png"),
  onemoreHover: loadImage("/assets/button/onemore_hover.png"),

  cardAssets: {
    des: loadNumberedImages("/assets/cards_token/des", 8),
    gen: loadNumberedImages("/assets/cards_token/gen", 8),
    dis: loadNumberedImages("/assets/cards_token/dis", 8),
    sup: loadNumberedImages("/assets/cards_token/sup", 8),
  },
  cardBarAssets: {
    des: loadNumberedImages("/assets/cards_token/des", 8, "b"),
    gen: loadNumberedImages("/assets/cards_token/gen", 8, "b"),
    dis: loadNumberedImages("/assets/cards_token/dis", 8, "b"),
    sup: loadNumberedImages("/assets/cards_token/sup", 8, "b"),
  },
  cardDescriptionAssets: {
    des: loadNumberedImages("/assets/ui/des", 8),
    gen: loadNumberedImages("/assets/ui/gen", 8),
    dis: loadNumberedImages("/assets/ui/dis", 8),
    sup: loadNumberedImages("/assets/ui/sup", 8),
  },
  costNumber: {
    w: loadNumberedImages("/assets/cards_token/number", 10),
    r: loadNumberedImages("/assets/cards_token/number", 10, "_r"),
    rw: loadNumberedImages("/assets/cards_token/number", 10, "_rw"),
  },
};

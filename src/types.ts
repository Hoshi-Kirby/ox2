export type Screen =
  | "title"
  | "menu"
  | "menuOffline"
  | "menuHelp"
  | "menuDeck"
  | "menuSetting"
  | "help"
  | "game"
  | "make"
  | "result";
export type DeckColor =
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "rainbow"
  | "white";

export type CardID = {
  attr: "des" | "gen" | "dis" | "sup";
  index: number;
};
export type CardAttr = CardID["attr"];
export type CardNum = CardID["index"];

export type Settings = {
  ui: {
    bgmEnabled: boolean;
    seEnabled: boolean;
    deviceMode: "mouse" | "touch";
    deckSelected: number;
    inputLocked: boolean;
    inputLockedSub: boolean;
    scrollY: number;
    openDeckList: boolean;
    isShift: boolean;
    initialHandId: number;
    changingDeck: boolean[];
  };

  game: {
    gameMode: "pvc" | "pvp" | "online";
    initialHand: number;
    firstPlayer: number;
    eventEnabled: boolean;
    shiftCardEnabled: boolean;

    deck0: CardID[];
    deck1: CardID[];
    deck2: CardID[];
    deck3: CardID[];
    editDeck: CardID[];
    deckColor0: DeckColor;
    deckColor1: DeckColor;
    deckColor2: DeckColor;
    deckColor3: DeckColor;
    editDeckColor: DeckColor;
    deckName0: string;
    deckName1: string;
    deckName2: string;
    deckName3: string;
    editDeckName: string;

    selectedDeckP: number[];
  };
};
export type HoverUI = {
  startButton: boolean;
  back: boolean;
  menu: boolean[];
  gameSettingArrow: boolean[][];
  gameDeck: boolean[];
  selectDeck: boolean[];
  menuDeck: boolean[];
  org: boolean;
  hoverCards: {
    des: boolean[];
    gen: boolean[];
    dis: boolean[];
    sup: boolean[];
  };
  hoverDeckIndex: number;
  shift: boolean;
  save: boolean;
  gameStart: boolean;
  turnEnd: boolean;
  hoverHands: number[];
  pauseContinue: boolean;
  pauseRestart: boolean;
  pauseEnd: boolean;
};
export type PressTimers = {
  startButton: number;
  cardPool: number;
  deckBar: number;
  hands: number[];
};

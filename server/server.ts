import { Server } from "boardgame.io/server";
import { createMyGame } from "../src/game/MyGame";
import type { Settings } from "../src/types";

const settings: Settings = {
  ui: {
    bgmEnabled: false,
    seEnabled: false,
    deviceMode: "mouse",
    deckSelected: 0,
    inputLocked: false,
    inputLockedSub: false,
    scrollY: 0,
    openDeckList: false,
    isShift: false,
    initialHandId: 2,
    changingDeck: [false, false],
    isInputActive: false,
    inputCursorPosition: 0,
    helpPage: 1,
  },

  game: {
    initialHand: 6,
    firstPlayer: 2,
    eventEnabled: true,
    shiftCardEnabled: false,
    isCPU: false,
    isOnline: true,

    deck0: [
      { attr: "des", index: 1 },
      { attr: "des", index: 1 },
      { attr: "des", index: 2 },
      { attr: "des", index: 3 },
      { attr: "gen", index: 1 },
      { attr: "gen", index: 1 },
      { attr: "gen", index: 2 },
      { attr: "gen", index: 3 },
      { attr: "gen", index: 4 },
      { attr: "gen", index: 4 },
      { attr: "gen", index: 4 },
      { attr: "dis", index: 1 },
      { attr: "dis", index: 1 },
      { attr: "dis", index: 5 },
      { attr: "dis", index: 5 },
      { attr: "sup", index: 1 },
      { attr: "sup", index: 1 },
      { attr: "sup", index: 2 },
      { attr: "sup", index: 3 },
      { attr: "sup", index: 4 },
    ],

    deck1: [],
    deck2: [],
    deck3: [],
    editDeck: [],

    deckColor0: "rainbow",
    deckColor1: "white",
    deckColor2: "white",
    deckColor3: "white",
    editDeckColor: "white",

    deckName0: "デフォルト",
    deckName1: "デッキ1",
    deckName2: "デッキ2",
    deckName3: "デッキ3",
    editDeckName: "",

    selectedDeckP: [0, 0],
  },
};

const game = createMyGame(settings);

const server = Server({
  games: [game],
  origins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
});

server.run(Number(process.env.PORT ?? 8000));

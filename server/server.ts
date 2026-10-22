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

// 誰も接続していない部屋を定期的に削除する
const ROOM_IDLE_MS = Number(process.env.ROOM_IDLE_MINUTES ?? 30) * 60 * 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

// 部屋が無人になった時刻（サーバー側で観測した時刻）
const emptySince = new Map<string, number>();

async function cleanupIdleRooms() {
  const now = Date.now();
  const matchIDs = await server.db.listMatches({ gameName: game.name });

  for (const matchID of matchIDs) {
    const { metadata } = await server.db.fetch(matchID, { metadata: true });
    if (!metadata) continue;

    const someoneConnected = Object.values(metadata.players).some(
      (player) => player.isConnected,
    );
    if (someoneConnected) {
      emptySince.delete(matchID);
      continue;
    }

    // 初めて無人を確認した時点から計測する（一時的な切断で消さないため）
    const since = emptySince.get(matchID) ?? now;
    emptySince.set(matchID, since);

    const lastActive = Math.max(since, metadata.updatedAt);
    if (now - lastActive >= ROOM_IDLE_MS) {
      await server.db.wipe(matchID);
      emptySince.delete(matchID);
      console.log("無人の部屋を削除:", matchID);
    }
  }

  // 既に存在しない部屋の記録を掃除
  for (const matchID of emptySince.keys()) {
    if (!matchIDs.includes(matchID)) emptySince.delete(matchID);
  }
}

setInterval(() => {
  cleanupIdleRooms().catch((error) => {
    console.error("部屋の削除処理に失敗:", error);
  });
}, CLEANUP_INTERVAL_MS);

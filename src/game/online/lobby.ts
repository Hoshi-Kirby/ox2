import { LobbyClient } from "boardgame.io/client";

const lobbyClient = new LobbyClient({
  server: "https://ox2.pinopinopino.com",
});

export async function createOnlineRoom() {
  const { matchID } = await lobbyClient.createMatch("ox2", {
    numPlayers: 2,
    unlisted: true,
  });

  return matchID;
}

export async function joinOnlineRoom(matchID: string) {
  const match = await lobbyClient.getMatch("ox2", matchID);

  const player0 = match.players.find((player) => player.id === 0);
  const player1 = match.players.find((player) => player.id === 1);

  let playerID: string | null = null;
  if (!player0?.name) {
    playerID = "0";
  } else if (!player1?.name) {
    playerID = "1";
  }

  if (playerID !== null) {
    const { playerCredentials } = await lobbyClient.joinMatch("ox2", matchID, {
      playerID,
      playerName: "Player",
    });
    const room = {
      matchID,
      playerID,
      playerCredentials,
    };
    localStorage.setItem(`ox2-room-${matchID}`, JSON.stringify(room));
    return room;
  }

  const saved = localStorage.getItem(`ox2-room-${matchID}`);

  if (saved) {
    const room = JSON.parse(saved);

    console.log("保存済みの参加情報:", room);

    const myPlayer = room.playerID === "0" ? player0 : player1;

    if (myPlayer?.isConnected === false) {
      console.log("自分の席が離席中。再接続します:", room);

      return room;
    }
  }

  throw new Error("この部屋は満員です");
}

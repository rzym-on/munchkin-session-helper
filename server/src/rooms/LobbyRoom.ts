import "dotenv/config.js";
import { Room, Client } from "colyseus";
import { LobbyState } from "./schema/LobbyState";

export class LobbyRoom extends Room<LobbyState> {

  onCreate (options: any) {
    this.maxClients = parseInt(process.env.LOBBY_PLAYER_LIMIT, 10);

    this.setState(new LobbyState());

    this.presence.subscribe("movePlayer", (resp:any) => {
      if (this.roomId !== resp.fromRoomId) return;

      const client = this.clients.find((client) => client.id === resp.clientId);

      if (!client) {
        console.log(`Cannot find player: ${resp.clientId} in lobby: ${resp.fromRoomId}`);
        return;
      }

      console.log('Moving watcher to game session: ', resp.toRoomId);

      client.send('switchRoom', {
        toRoomId: resp.toRoomId,
        spectatorName: resp.spectatorName
      });
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, `players in lobby:+ ${this.clients.length}`);
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, `players in lobby:- ${this.clients.length}`);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

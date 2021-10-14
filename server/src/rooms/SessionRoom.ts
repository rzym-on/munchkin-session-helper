import { Room, Client } from "colyseus";
import { Player } from "./schema/Player";
import { SessionState } from "./schema/SessionState";
import { Spectator } from "./schema/Spectator";

export class SessionRoom extends Room<SessionState> {

  onCreate (options: any) {
    this.patchRate = 2000;

    this.setState(new SessionState());

    this.onMessage("addSpectator", (client, { spectatorName, connectionString }) => {
      const [sessionId, id] = connectionString.split(" ");
      this.presence.publish("movePlayer", {
        spectatorName,
        fromRoomId: id,
        toRoomId: this.roomId,
        clientId: sessionId
      });
    });

    this.onMessage("addPlayer", (client, player:unknown) => {
      const newPlayer = new Player(player);
      this.state.players.push(newPlayer);
    });

    this.onMessage("kickSpectator", (client, spectatorId:string) => {
      const spectator = this.clients.find((client) => client.id === spectatorId);
      if (spectator) {
        spectator.leave();
      } else {
        console.log('Spectator not found', spectator.id);
      }
    });

    this.onMessage("setSpectatorName", (client, spectatorName:string) => {
      const spectator = new Spectator(client.id, spectatorName);
      this.state.spectators.set(client.id, spectator);
    });

    this.onMessage("changeGender", (client, playerName:string) => {
      const player = this.state.players.find((player) => player.name === playerName);
      if (!player) return;

      player.isWoman = !player.isWoman;
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    if (this.state.spectators.get(client.sessionId)) {
      this.state.spectators.delete(client.sessionId);
    } else {
      await this.allowReconnection(client, 20);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

import "dotenv/config.js";
import { Room, Client } from "colyseus";
import { Player } from "./schema/Player";
import { SessionState } from "./schema/SessionState";
import { Spectator } from "./schema/Spectator";

export class SessionRoom extends Room<SessionState> {
  idx:number = 0; // Id's for players created in room

  gameMaster:string = '';

  get index() {
    this.idx += 1;
    return this.idx;
  }

  isGameMaster(client:Client):boolean {
    let isGameMaster = client.id === this.gameMaster;
    if (!isGameMaster) console.log("You're not a game master!");
    return isGameMaster;
  }

  onCreate (options: any) {
    this.patchRate = 2000;

    this.maxClients = parseInt(process.env.SESSION_PLAYER_LIMIT, 10);

    this.setState(new SessionState());

    this.onMessage("addSpectator", (client, { spectatorName, connectionString }) => {
      if (!this.isGameMaster(client)) return;

      console.log('ADDING SPECTATOR');
      
      const [sessionId, id] = connectionString.split(" ");
      this.presence.publish("movePlayer", {
        spectatorName,
        fromRoomId: id,
        toRoomId: this.roomId,
        clientId: sessionId
      });
    });

    this.onMessage("addPlayer", (client, player:Player) => {
      if (!this.isGameMaster(client)) return;

      const newPlayer = new Player(this.index, player);
      this.state.players.push(newPlayer);
    });

    this.onMessage("updatePlayer", (client, player:Player) => {
      if (!this.isGameMaster(client)) return;
      const currPlayer = this.state.players.find(p => p.id === player.id);
      currPlayer?.update(player);
    });

    this.onMessage("removePlayer", (client, player:Player) => {
      if (!this.isGameMaster(client)) return;
      const idx = this.state.players.findIndex(p => p.id === player.id);
      this.state.players.splice(idx, 1);
    });

    this.onMessage("kickSpectator", (client, spectatorId:string) => {
      if (!this.isGameMaster(client)) return;

      const spectator = this.clients.find((client) => client.id === spectatorId);
      this.state.spectators.delete(spectatorId);
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

    this.onMessage("changeSex", (client, playerId:number) => {
      if (!this.isGameMaster(client)) return;

      const player = this.state.players.find((x) => x.id === playerId);
      if (!player) return;

      player.isWoman = !player.isWoman;
    });

    this.onMessage("nextTurn", (client) => {
      if (!this.isGameMaster(client)) return;

      let currPlayerId = this.state.currPlayerId;
      if (!currPlayerId) {
        if (this.state.players.length === 0) return;
        this.state.currPlayerId = this.state.players[0].id;
      } else {
        const currPlayer = this.state.players.find(x => x.id === currPlayerId);
        currPlayerId = this.state.players.indexOf(currPlayer);
        const nextIdx = currPlayerId + 1
        this.state.currPlayerId = this.state.players.length === nextIdx
          ? this.state.players[0].id
          : this.state.players[nextIdx].id;
      }
    });

    this.onMessage("prevTurn", (client) => {
      if (!this.isGameMaster(client)) return;

      let currPlayerId = this.state.currPlayerId;
      if (!currPlayerId) {
        if (this.state.players.length === 0) return;
        this.state.currPlayerId = this.state.players[this.state.players.length-1].id;
      } else {
        const currPlayer = this.state.players.find(x => x.id === currPlayerId);
        currPlayerId = this.state.players.indexOf(currPlayer);
        const prevIdx = currPlayerId - 1
        this.state.currPlayerId = prevIdx < 0
          ? this.state.players[this.state.players.length-1].id
          : this.state.players[prevIdx].id;
      }
    });

    this.onMessage("changeCurrentTurn", (client, playerId:number) => {
      if (!this.isGameMaster(client)) return;

      const selectedPlayer = this.state.players.find(x => x.id === playerId);

      if (!selectedPlayer) return

      this.state.currPlayerId = selectedPlayer.id;
    });

    this.onMessage("changeFontSize", (client:Client, {spectatorId, fontSize}:{spectatorId:string, fontSize:number}) => {
      if (!this.isGameMaster(client)) return;

      const roomClient = this.clients.find((cl) => cl.id === spectatorId);
      const spectator = this.state.spectators.get(spectatorId);
      if (!roomClient || !spectator) return;
      spectator.fontSize = fontSize;
    });
  }

  onJoin (client: Client, options: any) {
    if (!this.gameMaster) {
      this.gameMaster = client.id;
      this.state.gameMaster = client.id;
      console.log('YOU ARE A GAME MASTER: ', this.gameMaster);
    }
    console.log(client.sessionId, "joined!");
  }

  async onLeave (client: Client, consented: boolean) {
    const spectator = this.state.spectators.get(client.sessionId);
    if (spectator) {
      await this.waitForSpectator(client);
    }

    if (this.isGameMaster(client)) {
      await this.waitForGameMaster(client);
    }

    if (consented) return;
    
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  async waitForSpectator(client:Client) {
    const spectator = this.state.spectators.get(client.sessionId);
    spectator.connected = false;

    try {  
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60);
  
      // client returned! let's re-activate it.
      spectator.connected = true;
  
    } catch (e) {
      // 20 seconds expired. let's remove the client.
      this.state.spectators.delete(client.sessionId);
      console.log(client.sessionId, "left!");
    }
  }

  async waitForGameMaster(client:Client) {
    this.state.gameMasterConnected = false;

    try {  
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60);
  
      // client returned! let's re-activate it.
      this.state.gameMasterConnected = true;
  
    } catch (e) {
      console.log("Game master left! Disposing room...");
      this.disconnect();
    }
  }

}

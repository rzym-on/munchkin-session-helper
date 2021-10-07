import { Room, Client } from "colyseus";
import { SessionState } from "./schema/SessionState";
import { Schema } from "@colyseus/schema";

export class SessionRoom extends Room<SessionState> {

  onCreate (options: any) {
    this.setState(new SessionState());

    this.onMessage("addWatcher", (client, message:{clientId:string}) => {
      const [sessionId, id] = message.clientId.split(" ");
      this.presence.publish("movePlayer", {
        fromRoomId: id,
        toRoomId: this.roomId,
        clientId: sessionId
      });
    });

    this.onMessage("type", (client, message) => {
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    await this.allowReconnection(client, 50);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

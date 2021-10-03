import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
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

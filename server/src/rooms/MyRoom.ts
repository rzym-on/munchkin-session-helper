import { Room, Client, Server } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.presence.subscribe("movePlayer", (resp:any) => {
      if (this.roomId === resp.fromRoomId) {
        const client = this.clients.find((client) => client.id === resp.clientId);

        console.log('SENDING NEW CLIENT');

        client.send('switchRoom', {
          toRoomId: resp.toRoomId
        });
      }
    });

    this.onMessage("type", (client, message) => {
    });

    this.onMessage("addWatcher", (client, message:{clientId:string}) => {
      const [sessionId, id] = message.clientId.split(" ");
      this.presence.publish("movePlayer", {
        fromRoomId: id,
        toRoomId: this.roomId,
        clientId: sessionId
      });
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

import { createServer } from "http";
import { Server } from "colyseus";
import { MyRoom } from "./rooms/MyRoom";
import { WebSocketTransport } from "@colyseus/ws-transport";

const server = createServer(); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});

// register your room handlers
gameServer.define('my_room', MyRoom);
gameServer.define('lobby', MyRoom);

// make it available to receive connections
gameServer.listen(2567);
console.log(`Listening on ws://localhost:2567`);
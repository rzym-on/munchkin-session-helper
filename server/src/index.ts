import { createServer } from "http";
import { Server } from "colyseus";
import { SessionRoom } from "./rooms/SessionRoom";
import { LobbyRoom } from "./rooms/LobbyRoom";
import { WebSocketTransport } from "@colyseus/ws-transport";

const server = createServer();

const gameServer = new Server({
  transport: new WebSocketTransport({
      server
  })
});

// register your room handlers
gameServer.define('session_room', SessionRoom);
gameServer.define('lobby_room', LobbyRoom);

// make it available to receive connections
gameServer.listen(2567);
console.log(`Listening on ws://localhost:2567`);
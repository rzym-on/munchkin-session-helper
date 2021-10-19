import "dotenv/config.js";
import { createServer } from "http";
import { LocalPresence, Server } from "colyseus";
import { SessionRoom } from "./rooms/SessionRoom";
import { LobbyRoom } from "./rooms/LobbyRoom";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { lobbyRoomCreated, lobbyRoomDisposed, sessionRoomCreated, sessionRoomDisposed } from "./rooms/events/sessionEvents";

const server = createServer();
const pres = new LocalPresence();
const webSocket = new WebSocketTransport({ server });
const port = parseInt(process.env.PORT, 10);

pres.keys['session_curr'] = 0;
pres.keys['session_limit'] = process.env.SESSION_LIMIT;
pres.keys['lobby_curr'] = 0;
pres.keys['lobby_limit'] = process.env.LOBBY_LIMIT;

const gameServer = new Server({
  presence: pres,
  transport: webSocket,
});

gameServer
  .define('lobby_room', LobbyRoom)
  .on("create", lobbyRoomCreated)
  .on("dispose", lobbyRoomDisposed);
gameServer
  .define('session_room', SessionRoom)
  .on("create", sessionRoomCreated)
  .on("dispose", sessionRoomDisposed);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
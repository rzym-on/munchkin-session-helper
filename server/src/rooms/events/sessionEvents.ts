import { Room } from "@colyseus/core";

export function sessionRoomCreated (room:Room):void {
  room.presence.incr('session_curr');

  if (room.presence.get('session_curr') > room.presence.get('session_limit')) {
    console.log('LIMIT REACHED');
    room.disconnect();
  } 
}

export function sessionRoomDisposed (room:Room):void {
  room.presence.decr('session_curr');
}

export function lobbyRoomCreated (room:Room):void {
  room.presence.incr('lobby_curr');

  if (room.presence.get('lobby_curr') > room.presence.get('lobby_limit')) {
    console.log('LIMIT REACHED');
    room.disconnect();
  } 
}

export function lobbyRoomDisposed (room:Room):void {
  room.presence.decr('lobby_curr');
}
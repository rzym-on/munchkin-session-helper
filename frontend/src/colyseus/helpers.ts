import { Room, RoomAvailable, Client } from 'colyseus.js';
import { SessionStorage } from 'quasar';

export interface JoinOrReconnect {
  reconnected: boolean,
  roomName: string,
  userName: string,
  availableRooms: RoomAvailable[],
  connectedRoom: Room | undefined,
}

export async function joinOrReconnect(
  isSignedIn:boolean,
  room:Room | undefined,
  client:Client,
  roomToConnect:string,
):Promise<JoinOrReconnect> {
  let reconnected = true;
  let roomName = '';
  let userName = '';
  let availableRooms: RoomAvailable[] = [];
  let connectedRoom: Room | undefined;
  const roomId:string = SessionStorage.getItem('roomId') || '';
  const sessionId:string = SessionStorage.getItem('sessionId') || '';

  if (isSignedIn && !!room) {
    reconnected = true;

    SessionStorage.set('roomId', room.id);
    SessionStorage.set('sessionId', room.sessionId);

    roomName = room.name;
    userName = room.sessionId;

    connectedRoom = room;
    try {
      availableRooms = await client.getAvailableRooms();
    } catch (e) {
      console.log('RECONNECT ERROR', e);
    }
  } else if (!!roomId && !!sessionId) {
    try {
      connectedRoom = await client.reconnect(roomId, sessionId);
    } catch (e) {
      SessionStorage.remove('roomId');
      SessionStorage.remove('sessionId');
      connectedRoom = await client.joinOrCreate(roomToConnect);
    }
  } else {
    try {
      connectedRoom = await client.joinOrCreate(roomToConnect);
    } catch (e) {
      console.log('JOIN ERROR', e);
    }
  }

  return {
    reconnected,
    roomName,
    userName,
    availableRooms,
    connectedRoom,
  };
}

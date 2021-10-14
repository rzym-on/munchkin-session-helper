import { Room, Client } from 'colyseus.js';
import { SessionStorage } from 'quasar';

export async function createOrReconnect(
  client:Client,
  roomName:string,
):Promise<Room | undefined> {
  let connectedRoom: Room | undefined;
  const roomId:string = SessionStorage.getItem('roomId') || '';
  const sessionId:string = SessionStorage.getItem('sessionId') || '';

  if (!!roomId && !!sessionId) {
    try {
      connectedRoom = await client.reconnect(roomId, sessionId);
      if (connectedRoom && connectedRoom.name !== roomName) {
        connectedRoom.leave();
        connectedRoom = await client.joinOrCreate(roomName);
      }
    } catch (e) {
      SessionStorage.remove('roomId');
      SessionStorage.remove('sessionId');
      connectedRoom = await client.create(roomName);
    }
  } else {
    try {
      connectedRoom = await client.create(roomName);
    } catch (e) {
      console.log('JOIN ERROR', e);
    }
  }

  if (connectedRoom) {
    SessionStorage.set('roomId', connectedRoom.id);
    SessionStorage.set('sessionId', connectedRoom.sessionId);
  }

  return connectedRoom;
}

export async function switchRoom(
  roomToLeave:Room,
  client:Client,
  newRoomId:string,
):Promise<Room | undefined> {
  console.log('SWITCHING ROOM');
  if (roomToLeave) roomToLeave.leave();

  const switchedRoom = await client.joinById(newRoomId);

  if (switchedRoom) {
    SessionStorage.set('roomId', switchedRoom.id);
    SessionStorage.set('sessionId', switchedRoom.sessionId);
  }

  return switchedRoom;
}

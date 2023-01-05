import { Room, Client } from 'colyseus.js';
import { SessionStorage, Notify } from 'quasar';

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
    } catch (e) { // Probably the room is no longer available
      SessionStorage.remove('roomId');
      SessionStorage.remove('sessionId');
      connectedRoom = await client.create(roomName);
    }
  } else {
    try {
      connectedRoom = await client.create(roomName);
    } catch (e) {
      Notify.create({
        color: 'negative',
        textColor: 'white',
        icon: 'mdi-alert-circle',
        message: (e as Error)?.message || 'Connection problem',
      });
    }
  }

  if (connectedRoom) {
    SessionStorage.set('roomId', connectedRoom.id);
    SessionStorage.set('sessionId', connectedRoom.sessionId);
  }

  return connectedRoom;
}

export async function reconnect(client:Client, roomName:string):Promise<Room | undefined> {
  let connectedRoom: Room | undefined;
  const roomId:string = SessionStorage.getItem('roomId') || '';
  const sessionId:string = SessionStorage.getItem('sessionId') || '';

  if (!!roomId && !!sessionId) {
    try {
      connectedRoom = await client.reconnect(roomId, sessionId);
    } catch (e) { // Probably the room is no longer available
      SessionStorage.remove('roomId');
      SessionStorage.remove('sessionId');
    }
  }

  return connectedRoom;
}

export async function switchRoom(
  roomToLeave:Room,
  client:Client,
  newRoomId:string,
):Promise<Room | undefined> {
  if (roomToLeave) roomToLeave.leave();

  const switchedRoom = await client.joinById(newRoomId);

  if (switchedRoom) {
    SessionStorage.set('roomId', switchedRoom.id);
    SessionStorage.set('sessionId', switchedRoom.sessionId);
  }

  return switchedRoom;
}

import { Client, Room } from 'colyseus.js';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { useConfig } from 'src/boot/appConfig';
import { createOrReconnect, switchRoom } from 'src/colyseus/helpers';
import { SessionStorage } from 'quasar';
import { Player } from 'src/colyseus/schema/Player';

export interface UserState {
  loading: boolean;
  // client: Client | undefined;
  room: Room | undefined;
}

interface SwitchRoom {
  toRoomId:string,
  spectatorName:string
}

export const useUserStore = defineStore('user', () => {
  let client:Client | undefined;
  const state = reactive<UserState>({
    loading: false,
    room: undefined,
  });

  function leaveRoom() {
    SessionStorage.remove('roomId');
    SessionStorage.remove('sessionId');
    state.room = undefined;
  }

  function initConnection() {
    const { url } = useConfig();
    if (client) return;
    client = new Client(url);
  }

  async function joinLobby() {
    initConnection();
    if (!client) return;
    const lobbyRoom = await createOrReconnect(client, 'lobby_room');
    if (!lobbyRoom) return;

    lobbyRoom.onLeave(() => leaveRoom());
    lobbyRoom.onMessage('switchRoom', async (message:SwitchRoom) => {
      if (!client) return;
      const sessionRoom = await switchRoom(lobbyRoom, client, message.toRoomId);

      if (!sessionRoom) return;
      state.room = sessionRoom;

      sessionRoom.send('setSpectatorName', message.spectatorName);
      sessionRoom.onLeave(() => {
        leaveRoom();
        joinLobby();
      });
    });

    state.room = lobbyRoom;
  }

  async function joinCreateSessionRoom() {
    initConnection();
    if (!client) return;
    const connectedRoom = await createOrReconnect(client, 'session_room');
    if (!connectedRoom) return;
    state.room = connectedRoom;
  }

  function serverMsg(message:string, data:unknown) {
    if (!state.room) return;
    state.room.send(message, data);
  }

  function updatePlayer(player:Player) {
    serverMsg('updatePlayer', player);
  }

  function addSpectator(spectatorName:string, connectionString:string) {
    serverMsg('addSpectator', {
      spectatorName,
      connectionString,
    });
  }

  return {
    state,
    joinLobby,
    joinCreateSessionRoom,
    serverMsg,
    updatePlayer,
    addSpectator,
    isConnectedToRoom: computed(() => !!state.room),
    roomName: computed(() => state.room?.id || ''),
    isInLobby: computed(() => !!state.room && state.room.name === 'lobby_room'),
    isInSession: computed(() => !!state.room && state.room.name === 'session_room'),
    getUserId: computed(() => state.room?.sessionId || ''),
    connectionString: computed(() => `${state.room?.sessionId} ${state.room?.id}` || ''),
  };
});

import { Client, Room } from 'colyseus.js';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { useConfig } from 'src/boot/appConfig';
import { createOrReconnect, reconnect, switchRoom } from 'src/colyseus/helpers';
import { SessionStorage } from 'quasar';
import { Player } from 'src/colyseus/schema/Player';
import { useRoomStore } from './roomStore';

export interface UserState {
  loading: boolean;
  // client: Client | undefined;
  room: Room | undefined;
  fontSize: number;
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
    fontSize: 19,
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

  const isInSession = computed(() => !!state.room && state.room.name === 'session_room');

  async function joinLobby() {
    initConnection();
    if (!client) return;
    const lobbyRoom = await createOrReconnect(client, 'lobby_room');
    if (!lobbyRoom) return;

    lobbyRoom.onLeave(() => leaveRoom());
    lobbyRoom.onMessage('switchRoom', async (message:SwitchRoom) => {
      if (!client || isInSession.value) return;
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

  async function tryReconnectSessionRoom():Promise<boolean> {
    initConnection();
    if (!client) return false;
    const connectedRoom = await reconnect(client, 'session_room');
    state.room = connectedRoom;
    return !!connectedRoom;
  }

  async function joinCreateSessionRoom() {
    initConnection();
    if (!client) return;
    const connectedRoom = await createOrReconnect(client, 'session_room');
    if (!connectedRoom) return;
    state.room = connectedRoom;
  }

  function serverMsg(message:string, data:unknown|undefined = undefined) {
    if (!state.room) return;
    if (data) {
      state.room.send(message, data);
    } else {
      state.room.send(message);
    }
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

  const roomStore = useRoomStore();

  function updatePlayerCommand(command:string) {
    if (!roomStore.currentPlayer?.id) return;
    const currentPlayer = roomStore.getById(roomStore.currentPlayer?.id);
    if (!currentPlayer) return;

    switch (command) {
      case 'lvlUp':
        currentPlayer.lvl += 1;
        break;
      case 'lvlDown':
        currentPlayer.lvl -= currentPlayer.lvl === 0 ? 0 : 1;
        break;
      case 'gearUp':
        currentPlayer.gear += 1;
        break;
      case 'gearDown':
        currentPlayer.gear -= currentPlayer.gear === 0 ? 0 : 1;
        break;
      case 'changeSex':
        currentPlayer.isWoman = !currentPlayer.isWoman;
        break;
      default:
        //
    }

    updatePlayer(currentPlayer as Player);
  }

  function textSize(multiplier = 1) {
    return { fontSize: `${state.fontSize * multiplier}px` };
  }

  return {
    state,
    client,
    joinLobby,
    joinCreateSessionRoom,
    tryReconnectSessionRoom,
    serverMsg,
    updatePlayer,
    updatePlayerCommand,
    addSpectator,
    isInSession,
    textSize,
    isConnectedToRoom: computed(() => !!state.room),
    roomName: computed(() => state.room?.id || ''),
    isInLobby: computed(() => !!state.room && state.room.name === 'lobby_room'),
    getUserId: computed(() => state.room?.sessionId || ''),
    connectionString: computed(() => `${state.room?.sessionId} ${state.room?.id}` || ''),
    amIGameMaster: computed(() => roomStore.state.gameMaster === state.room?.sessionId),
  };
});

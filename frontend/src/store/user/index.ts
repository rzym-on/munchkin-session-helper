import { SessionStorage } from 'quasar';
import { Room, Client } from 'colyseus.js';
import { UserStoreState } from './types';
import { createOrReconnect, switchRoom } from '@/colyseus/helpers';

export default {
  namespaced: true,
  state: <UserStoreState> {
    loading: false,
    client: undefined,
    room: undefined,
  },
  actions: {
    addPlayer({ state }: {state:UserStoreState}, player:unknown):void {
      if (!state.room) return;
      state.room.send('addPlayer', player);
    },
    async joinLobby(
      { state, commit, dispatch }:
      {
        state:UserStoreState,
        commit:CallableFunction,
        dispatch:CallableFunction
      },
    ):Promise<void> {
      commit('initClient');
      if (!state.client) return;
      const connectedRoom = await createOrReconnect(state.client, 'lobby_room');

      if (!connectedRoom) return;

      connectedRoom.onLeave(() => commit('leaveRoom'));

      connectedRoom.onMessage('switchRoom', async (message: {toRoomId:string, spectatorName:string}) => {
        if (!state.client) return;
        const switchedRoom = await switchRoom(connectedRoom, state.client, message.toRoomId);
        if (switchedRoom) {
          commit('initRoom', switchedRoom);
          switchedRoom.send('setSpectatorName', message.spectatorName);
          switchedRoom.onLeave(() => {
            commit('leaveRoom');
            dispatch('joinLobby');
          });
        }
      });

      commit('initRoom', connectedRoom);
    },
    async joinCreateSessionRoom(
      { state, commit }: {state:UserStoreState, commit:CallableFunction},
    ):Promise<Room<any> | undefined> {
      commit('initClient');
      if (!state.client) return undefined;
      const connectedRoom = await createOrReconnect(state.client, 'session_room');
      if (!connectedRoom) return undefined;
      commit('initRoom', connectedRoom);
      return connectedRoom;
    },
    kickSpectator({ state }, spectatorId:string):void {
      if (!state.room) return;
      state.room.send('kickSpectator', spectatorId);
    },
    async changeGender({ state, commit }, playerName:string):Promise<void> {
      if (!state.room) return;
      await state.room.send('changeGender', playerName);
    },
  },
  mutations: {
    initRoom(state:UserStoreState, room:Room):void {
      state.room = room;
    },
    leaveRoom(state:UserStoreState):void {
      SessionStorage.remove('roomId');
      SessionStorage.remove('sessionId');
      state.room = undefined;
    },
    initClient(state: UserStoreState): void {
      if (state.client) return;
      state.client = new Client('ws://localhost:2567');
    },
  },
  getters: {
    isConnectedToRoom: (state:UserStoreState):boolean => !!state.room,
    getRoomName: (state:UserStoreState):string => state.room?.id || '',
    getRoomType: (state:UserStoreState):string => state.room?.name || '',
    getUserId: (state:UserStoreState):string => state.room?.sessionId || '',
    connectionString: (state:UserStoreState):string => `${state.room?.sessionId} ${state.room?.id}` || '',
  },
};

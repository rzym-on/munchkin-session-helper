import axios from 'axios';
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
    async joinLobby(
      { state, commit, dispatch }:
      {
        state:UserStoreState,
        commit:CallableFunction,
        dispatch:CallableFunction
      },
    ):Promise<void> {
      await dispatch('initServerConnection');
      if (!state.client) return;
      const lobbyRoom = await createOrReconnect(state.client, 'lobby_room');

      if (!lobbyRoom) return;

      lobbyRoom.onLeave(() => commit('leaveRoom'));

      lobbyRoom.onMessage('switchRoom', async (message: {toRoomId:string, spectatorName:string}) => {
        if (!state.client) return;
        const sessionRoom = await switchRoom(lobbyRoom, state.client, message.toRoomId);

        if (!sessionRoom) return;

        commit('initRoom', sessionRoom);
        sessionRoom.send('setSpectatorName', message.spectatorName);
        sessionRoom.onLeave(() => {
          commit('leaveRoom');
          dispatch('joinLobby');
        });
      });

      commit('initRoom', lobbyRoom);
    },
    async joinCreateSessionRoom(
      { state, commit, dispatch }:
      {
        state:UserStoreState,
        commit:CallableFunction,
        dispatch:CallableFunction
      },
    ):Promise<Room<any> | undefined> {
      await dispatch('initServerConnection');
      if (!state.client) return undefined;
      const connectedRoom = await createOrReconnect(state.client, 'session_room');
      if (!connectedRoom) return undefined;
      commit('initRoom', connectedRoom);
      return connectedRoom;
    },
    async initServerConnection({ commit }: {commit:CallableFunction}):Promise<void> {
      const { data } = await axios.get<any>('/server-info.json');
      commit('initClient', data.url);
    },
    addPlayer({ state }: {state:UserStoreState}, player:unknown):void {
      if (!state.room) return;
      state.room.send('addPlayer', player);
    },
    kickSpectator({ state }, spectatorId:string):void {
      if (!state.room) return;
      state.room.send('kickSpectator', spectatorId);
    },
    changeGender({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('changeGender', playerId);
    },
    nextTurn({ state }):void {
      if (!state.room) return;
      state.room.send('nextTurn');
    },
    prevTurn({ state }):void {
      if (!state.room) return;
      state.room.send('prevTurn');
    },
    changeCurrentTurn({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('changeCurrentTurn', playerId);
    },
    lvlUp({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('lvlUp', playerId);
    },
    lvlDown({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('lvlDown', playerId);
    },
    gearUp({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('gearUp', playerId);
    },
    gearDown({ state }, playerId:number):void {
      if (!state.room) return;
      state.room.send('gearDown', playerId);
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
    initClient(state: UserStoreState, url:string): void {
      if (state.client) return;
      state.client = new Client(url);
    },
  },
  getters: {
    getRoom: (state:UserStoreState):Room|undefined => state.room,
    isConnectedToRoom: (state:UserStoreState):boolean => !!state.room,
    getRoomName: (state:UserStoreState):string => state.room?.id || '',
    isInLobby: (state:UserStoreState):boolean => !!state.room && state.room.name === 'lobby_room',
    isInSession: (state:UserStoreState):boolean => !!state.room && state.room.name === 'session_room',
    getUserId: (state:UserStoreState):string => state.room?.sessionId || '',
    connectionString: (state:UserStoreState):string => `${state.room?.sessionId} ${state.room?.id}` || '',
  },
};

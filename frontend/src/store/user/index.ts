import { Room } from 'colyseus.js';
import { PlayerState } from '@/colyseus/schema/PlayerState';
import { UserStoreState } from './types';

export default {
  namespaced: true,
  state: <UserStoreState> {
    room: undefined,
  },
  actions: {
    addPlayer({ state }: {state:UserStoreState}, playerName:string):void {
      if (!state.room) return;
      state.room.send('addPlayer', playerName);
    },
  },
  mutations: {
    initRoom(state:UserStoreState, room:Room):void {
      state.room = room;
    },
  },
  getters: {
    getRoomName: (state:UserStoreState):string => state.room?.name || '',
    getUserId: (state:UserStoreState):string => state.room?.sessionId || '',
  },
};

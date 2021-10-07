import { Room } from 'colyseus.js';
import { UserStoreState } from './types';

export default {
  namespaced: true,
  state: <UserStoreState> {
    room: undefined,
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

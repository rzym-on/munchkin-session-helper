import { Room } from 'colyseus.js';
import { UserStoreState } from './types';

export default {
  namespaced: true,
  state: <UserStoreState> {
    isSignedIn: false,
    room: undefined,
  },
  mutations: {
    initRoom(state:UserStoreState, room:Room):void {
      state.room = room;
      state.isSignedIn = true;
    },
  },
};

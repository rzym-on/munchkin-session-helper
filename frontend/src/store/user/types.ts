import { Room } from 'colyseus.js';

export interface UserStoreState {
  room: Room | undefined;
}

export interface UserStoreMutations {
  initRoom(room:Room):void
}

export interface UserStoreGetters {
  getRoomName: string,
  getUserId: string,
}
export interface UserStore {
  namespaced: boolean,
  state: UserStoreState,
  mutations: UserStoreMutations,
  getters: UserStoreGetters,
}

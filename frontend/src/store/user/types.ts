import { Client, Room } from 'colyseus.js';

export interface UserStoreState {
  loading: boolean;
  client: Client | undefined;
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

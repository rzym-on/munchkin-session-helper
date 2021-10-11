import { Client } from 'colyseus.js';
import { PlayerState } from '@/colyseus/schema/PlayerState';

export interface RoomStoreState {
  players: PlayerState[],
  spectators: Client[]
}

export interface RoomStoreMutations {
  addPlayer(state:RoomStoreState, player:PlayerState):void,
}

export interface RoomStore {
  namespaced: boolean,
  state: RoomStoreState,
  mutations: RoomStoreMutations,
}

import { Player } from '@/colyseus/schema/Player';
import { Spectator } from '@/colyseus/schema/Spectator';

export interface RoomStoreState {
  loading: boolean,
  players: Player[],
  currPlayerId: number | null,
  spectators: Map<string, Spectator>,
}

export interface RoomStoreMutations {
  addPlayer(state:RoomStoreState, player:Player):void,
}

export interface RoomStore {
  namespaced: boolean,
  state: RoomStoreState,
  mutations: RoomStoreMutations,
}

import { Room } from 'colyseus.js';
import { DataChange } from '@colyseus/schema';
import { RoomStoreState } from './types';
import { SessionState } from '@/colyseus/schema/SessionState';
import { PlayerState } from '@/colyseus/schema/PlayerState';

export default {
  namespaced: true,
  state: <RoomStoreState> {
    players: [],
    spectators: [],
  },
  actions: {
    initStateChanges({ commit }, room:Room):void {
      const roomState:SessionState = room.state;

      roomState.players.onAdd = (player:PlayerState, key) => {
        player.onChange = (changes) => {
          commit('updatePlayer', { player, changes });
        };

        player.onRemove = () => commit('removePlayer', player);

        commit('addPlayer', player);
      };
    },
  },
  mutations: {
    addPlayer(state:RoomStoreState, player:PlayerState):void {
      state.players.push(player);
    },
    updatePlayer(
      state:RoomStoreState,
      { player, changes }:{ player: PlayerState, changes: DataChange<unknown>[] },
    ):void {
      const currentPlayer = state.players.find((x) => x.name === player.name);
      if (!currentPlayer) return;
      changes.forEach((change) => {
        currentPlayer[change.field] = change.value;
      });
    },
    removePlayer(state:RoomStoreState, player:PlayerState):void {
      const playerIdx = state.players.findIndex((x) => x.name === player.name);
      state.players.splice(playerIdx, 1);
    },
  },
  getters: {
    anyPlayers: (state:RoomStoreState):boolean => state.players.length > 0,
    getAllPlayers: (state:RoomStoreState):PlayerState[] => state.players,
    getNames: (state:RoomStoreState):string[] => state.players.map((x) => x.name),
  },
};

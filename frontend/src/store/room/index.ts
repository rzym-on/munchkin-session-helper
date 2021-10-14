import { Room } from 'colyseus.js';
import { DataChange } from '@colyseus/schema';
import { RoomStoreState } from './types';
import { SessionState } from '@/colyseus/schema/SessionState';
import { Player } from '@/colyseus/schema/Player';
import { Spectator } from '@/colyseus/schema/Spectator';

export default {
  namespaced: true,
  state: <RoomStoreState> {
    loading: false,
    players: [],
    spectators: new Map(),
  },
  actions: {
    async initStateChanges({ commit }, room:Room):Promise<void> {
      const roomState:SessionState = room.state;

      roomState.players.onAdd = (player:Player, key) => {
        player.onChange = (changes) => {
          commit('loading', true);
          commit('updatePlayer', { player, changes });
          // We need to force DOM to slightly change it's structure to update changes
          setTimeout(() => { commit('loading', false); }, 100);
        };

        player.onRemove = () => commit('removePlayer', player);

        commit('addPlayer', player);
      };

      roomState.spectators.onAdd = (spectator:Spectator, key) => {
        commit('addSpectator', spectator);

        spectator.onRemove = () => commit('removeSpectator', spectator);
      };
    },
  },
  mutations: {
    addPlayer(state:RoomStoreState, player:Player):void {
      state.players.push(player);
    },
    addSpectator(state:RoomStoreState, spectator:Spectator):void {
      state.spectators.set(spectator.clientId, spectator);
    },
    updatePlayer(
      state:RoomStoreState,
      { player, changes }:{ player: Player, changes: DataChange<unknown>[] },
    ):void {
      const currentPlayer = state.players.find((x) => x.name === player.name);
      if (!currentPlayer) return;
      changes.forEach((change) => {
        currentPlayer[change.field] = change.value;
      });
    },
    removePlayer(state:RoomStoreState, player:Player):void {
      const playerIdx = state.players.findIndex((x) => x.name === player.name);
      state.players.splice(playerIdx, 1);
    },
    removeSpectator(state:RoomStoreState, spectator:Spectator):void {
      state.spectators.delete(spectator.clientId);
    },
    loading(state: RoomStoreState, value:boolean): void {
      state.loading = value;
    },
  },
  getters: {
    anyPlayers: (state:RoomStoreState):boolean => state.players.length > 0,
    getAllPlayers: (state:RoomStoreState):Player[] => state.players,
    getPlayerByName: (state: RoomStoreState) => function (name:string): Player | undefined {
      return state.players.find((x) => x.name === name);
    },
    getAllSpectators: (state:RoomStoreState):Spectator[] => {
      const spectators:Spectator[] = [];
      state.spectators.forEach((value, key) => spectators.push(value));
      return spectators;
    },
    getNames: (state:RoomStoreState):string[] => state.players.map((x) => x.name),
    isLoading: (state:RoomStoreState):boolean => state.loading,
  },
};

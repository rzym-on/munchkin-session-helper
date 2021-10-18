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
    currPlayerId: null,
    spectators: new Map(),
  },
  actions: {
    async initStateChanges({ commit }, room:Room):Promise<void> {
      const roomState:SessionState = room.state;
      commit('clearLocalState');

      roomState.players.onAdd = (player:Player) => {
        player.onChange = (changes) => {
          commit('loading', true);
          commit('updatePlayer', { player, changes });
          // We need to force DOM to slightly change it's structure to update changes
          setTimeout(() => { commit('loading', false); }, 50);
        };

        player.onRemove = () => commit('removePlayer', player);

        commit('addPlayer', player);
      };

      roomState.listen('currPlayerId', (val) => {
        commit('nextPlayer', val);
      });

      roomState.spectators.onAdd = (spectator:Spectator) => {
        commit('addSpectator', spectator);

        spectator.onRemove = () => commit('removeSpectator', spectator);
      };

      roomState.triggerAll();
    },
  },
  mutations: {
    clearLocalState(state:RoomStoreState):void {
      state.loading = false;
      state.players = [];
      state.spectators = new Map();
      state.currPlayerId = null;
    },
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
    nextPlayer(state:RoomStoreState, id:number) {
      state.currPlayerId = id;
    },
    loading(state: RoomStoreState, value:boolean): void {
      state.loading = value;
    },
  },
  getters: {
    anyPlayers: (state:RoomStoreState):boolean => state.players.length > 0,
    getAllPlayers: (state:RoomStoreState):Player[] => state.players,
    getPlayerByName: (state: RoomStoreState) => (name: string):Player|undefined => state.players.find((x) => x.name === name),
    getAllSpectators: (state:RoomStoreState):Spectator[] => {
      const spectators:Spectator[] = [];
      state.spectators.forEach((value) => spectators.push(value));
      return spectators;
    },
    getNames: (state:RoomStoreState):string[] => state.players.map((x) => x.name),
    isLoading: (state:RoomStoreState):boolean => state.loading,
    currentPlayer: (state:RoomStoreState):Player|undefined => state.players.find((x) => x.id === state.currPlayerId),
    currentPlayerName: (_, getters):string => getters.currentPlayer?.name || '',
    currentPlayerGender: (_, getters):string => (getters.currentPlayer?.isWoman ? 'female' : 'male'),
    prevPlayerName: (state:RoomStoreState, getters):string => {
      const currPlayerId = state.players.indexOf(getters.currentPlayer);
      const prevIdx = currPlayerId - 1;
      const prevPlayer = prevIdx < 0
        ? state.players[state.players.length - 1]
        : state.players[prevIdx];

      return prevPlayer?.name || '';
    },
    nextPlayerName: (state:RoomStoreState, getters):string => {
      const currPlayerId = state.players.indexOf(getters.currentPlayer);
      const nextIdx = currPlayerId + 1;
      const nextPlayer = state.players.length === nextIdx
        ? state.players[0]
        : state.players[nextIdx];

      return nextPlayer?.name || '';
    },
  },
};

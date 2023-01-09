import { QTableColumn } from 'quasar';
import { Room } from 'colyseus.js';
import { defineStore } from 'pinia';
import { Player } from 'src/colyseus/schema/Player';
import { SessionState } from 'src/colyseus/schema/SessionState';
import { computed, reactive } from 'vue';
import { ModelInfoColumn } from 'src/types/quasar-table';
import { Spectator } from 'src/colyseus/schema/Spectator';
import { useUserStore } from './userStore';

export const useRoomStore = defineStore('room', () => {
  const state = reactive({
    loading: false,
    players: [] as Player[],
    currPlayerId: 0,
    spectators: new Map<string, Spectator>(),
    gameMaster: '',
  });

  const userStore = useUserStore();

  function clearLocalState() {
    state.loading = false;
    state.players = [];
    state.spectators = new Map<string, Spectator>();
    state.currPlayerId = 0;
  }

  function addPlayerEvent(player:Player) {
    state.players.push({ ...player } as Player);
    player.onRemove = () => {
      const playerIdx = state.players.findIndex((x) => x.name === player.name);
      state.players.splice(playerIdx, 1);
    };

    player.onChange = (_) => {
      const idx = state.players.findIndex((x) => x.id === player.id);
      state.players.splice(idx, 1, { ...player } as Player);
    };
    player.onRemove = () => {
      const playerIdx = state.players.findIndex((x) => x.name === player.name);
      state.players.splice(playerIdx, 1);
    };
  }

  function addSpectatorEvent(spectator:Spectator) {
    state.spectators.set(spectator.clientId, spectator);

    spectator.onChange = (changes) => {
      if (userStore.state.room?.sessionId === spectator.clientId) {
        const fontSize = changes.find((x) => x.field === 'fontSize')?.value;
        if (fontSize) {
          userStore.state.fontSize = fontSize;
        }
      }
    };

    spectator.onRemove = () => {
      state.spectators.delete(spectator.clientId);
    };
  }

  async function initStateChanges(room:Room) {
    const roomState:SessionState = room.state;
    clearLocalState();

    room.onLeave(() => {
      window.location.reload();
    });

    roomState.players.onAdd = addPlayerEvent;
    if (roomState.players.length !== state.players.length) {
      roomState.players.forEach((player) => addPlayerEvent(player));
    }

    state.currPlayerId = roomState.currPlayerId;
    roomState.listen('currPlayerId', (id:number) => {
      state.currPlayerId = id;
    });

    roomState.spectators.onAdd = addSpectatorEvent;
    if (roomState.spectators.size !== state.spectators.size) {
      roomState.spectators.forEach((spectator) => addSpectatorEvent(spectator));
    }

    state.gameMaster = roomState.gameMaster;
    roomState.listen('gameMaster', (newVal:string, _:string) => {
      state.gameMaster = newVal;
    });
  }

  function getById(id:number) {
    return state.players.find((x) => x.id === id);
  }

  const currentPlayer = computed(() => getById(state.currPlayerId));

  return {
    state,
    initStateChanges,
    getById,

    // getters
    spectators: computed(() => {
      const spectators:Spectator[] = [];
      state.spectators.forEach((value) => spectators.push(value));
      return spectators;
    }),
    anyPlayers: computed(() => state.players.length > 0),
    getNames: computed(() => state.players.map((x) => x.name)),
    currentPlayer,
    currentPlayerName: computed(() => currentPlayer.value?.name || ''),
    currentPlayerGender: computed(() => (currentPlayer.value?.isWoman ? 'female' : 'male')),
    prevPlayerName: computed(() => {
      const currPlayerId = state.players.indexOf(currentPlayer.value as Player);
      const prevIdx = currPlayerId - 1;
      const prevPlayer = prevIdx < 0
        ? state.players[state.players.length - 1]
        : state.players[prevIdx];

      return prevPlayer?.name || '';
    }),
    nextPlayerName: computed(() => {
      const currPlayerId = state.players.indexOf(currentPlayer.value as Player);
      const nextIdx = currPlayerId + 1;
      const nextPlayer = state.players.length === nextIdx
        ? state.players[0]
        : state.players[nextIdx];

      return nextPlayer?.name || '';
    }),
  };
});

export const playerColumns = (fontSize = 15):QTableColumn<ModelInfoColumn<Player>>[] => [
  {
    name: 'showInfo', label: '', field: 'showInfo', align: 'left', style: 'width: 100px',
  },
  {
    name: 'color', align: 'left', label: 'Color', field: 'color',
  },
  {
    name: 'isWoman', align: 'left', label: 'Gender', field: 'isWoman', style: `font-size: ${fontSize}px`,
  },
  {
    name: 'lvl', align: 'left', label: 'Level', field: 'lvl', style: `font-size: ${fontSize}px`,
  },
  {
    name: 'gear', align: 'left', label: 'Gear', field: 'gear', style: `font-size: ${fontSize}px`,
  },
  {
    name: 'name', align: 'left', label: 'Name', field: 'name', style: `font-size: ${fontSize}px`,
  },
];

export const spectatorColumns = ():QTableColumn<ModelInfoColumn<Spectator>>[] => [
  {
    name: 'showInfo', label: '', field: 'showInfo', align: 'left', style: 'width: 100px',
  },
  {
    name: 'fontSize', align: 'center', label: 'Text size', field: 'fontSize',
  },
  {
    name: 'name', align: 'left', label: 'Name', field: 'name',
  },
];

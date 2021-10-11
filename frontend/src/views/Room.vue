<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Hello fellow in: {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator inset />

      <!-- PLAYERS -->
      <q-card-section>
        <q-table
          dense
          title="Players"
          :rows="players"
          :columns="playerCols"
          row-key="roomId"
          color="amber"
        />
      </q-card-section>
    </q-card>

    <edit-player v-model="addPlayerDialog"></edit-player>

    <!-- FAB BUTTONS -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="purple" icon="add" direction="up">
        <q-fab-action
          external-label
          label-position="left"
          color="secondary"
          icon="person_add"
          label="Add player"
          @click="addPlayerDialog = true"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Client } from 'colyseus.js';
import { QTable } from 'quasar';
import {
  useMutation, useState, useGetter, useAction,
} from '@/store/helpers/useModules';
import { createOrReconnect } from '@/colyseus/helpers';
import EditPlayer from '@/components/dialog/EditPlayer.vue';
import { PlayerState } from '@/colyseus/schema/PlayerState';

@Options({
  components: { EditPlayer },
})

export default class Home extends Vue {
  client: Client = new Client('ws://localhost:2567');

  userName:string = useGetter('user', 'getUserId');

  roomName:string = useGetter('user', 'getRoomName');

  players:PlayerState[] = useGetter('room', 'getAllPlayers');

  playerCols: QTable['columns'] = [
    {
      name: 'name', label: 'Name', field: 'name', align: 'left',
    },
    {
      name: 'lvl', label: 'Level', field: 'lvl', align: 'left',
    },
    {
      name: 'gear', label: 'Gear', field: 'gear', align: 'left',
    },
  ];

  addPlayerDialog = false;

  created(): void {
    const room = useState('user', 'room');

    if (room) return;

    createOrReconnect(this.client, 'session_room').then((connectedRoom) => {
      if (!connectedRoom) return;
      useMutation('user', 'initRoom')(connectedRoom);
      useAction('room', 'initStateChanges')(connectedRoom);
    });
  }
}
</script>
<style lang="scss" scoped>
.body--dark {
  .my-card {
    background: #424242;
  }
}
</style>

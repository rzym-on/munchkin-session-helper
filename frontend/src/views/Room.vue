<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Hello fellow in: {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator inset />

      <!-- ROOMS AVAILABLE -->
      <q-card-section>
        <q-table
          dense
          title="Available rooms"
          :rows="availableRooms"
          :columns="columns"
          row-key="roomId"
          color="amber"
        />
      </q-card-section>

      <!-- ROOM MESSAGES -->
      <q-card-section>
        <q-table
          dense
          title="Room messages"
          :rows="messages"
          :columns="messageCols"
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
import { useStore } from 'vuex';
import { Vue, Options } from 'vue-class-component';
import { Room, RoomAvailable, Client } from 'colyseus.js';
import { QTable } from 'quasar';
import { useMutation, useState, useGetter } from '@/store/helpers/useModules';
import { createOrReconnect } from '@/colyseus/helpers';
import EditPlayer from '@/components/dialog/EditPlayer.vue';

@Options({
  components: { EditPlayer },
})

export default class Home extends Vue {
  client: Client = new Client('ws://localhost:2567');

  availableRooms: RoomAvailable[] = [];

  messages: any[] = [];

  userName:string = useGetter('user', 'getUserId');

  roomName:string = useGetter('user', 'getRoomName');

  columns: QTable['columns'] = [
    {
      name: 'roomId', label: 'Room ID', field: 'roomId', align: 'left',
    },
    {
      name: 'roomName', label: 'Room Name', field: 'name', align: 'left',
    },
    {
      name: 'roomClients', label: 'Clients', field: 'clients', align: 'left',
    },
  ];

  messageCols: QTable['columns'] = [
    {
      name: 'title', label: 'Title', field: 'title', align: 'left',
    },
    {
      name: 'desc', label: 'Description', field: 'desc', align: 'left',
    },
  ];

  addPlayerDialog = false;

  created(): void {
    const room = useState('user', 'room');

    if (room) return;

    createOrReconnect(this.client, 'session_room').then((connectedRoom) => {
      if (connectedRoom) this.initRoomData(connectedRoom);
    });
  }

  initRoomData(room: Room): void {
    useMutation('user', 'initRoom')(room);

    room.onMessage('message', (message) => this.receiveMessage(message));

    this.client.getAvailableRooms().then((rooms) => {
      this.availableRooms = rooms;
    }).catch((e) => { console.log('CANNOT FETCH ROOMS', e); });
  }

  receiveMessage(message: any): void {
    this.messages.push(message);
    console.log('NEW MESSAGE', message);
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

<template>
  <div class="home">
    <q-card class="my-card">
      <q-card-section>
        <div v-if="!reconnected" class="text-h6">Hello fellow in: {{ roomName }}</div>
        <div v-else class="text-h6">Welcome back!: {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator inset />

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
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Room, RoomAvailable, Client } from 'colyseus.js';
import { QTable, SessionStorage } from 'quasar';
import { useMutations, useState } from '@/store/helpers/useModules';
import { UserStoreState, UserStoreMutations } from '@/store/user/types';
import { joinOrReconnect } from '@/colyseus/helpers';

export default class Home extends Vue {
  client: Client = new Client('ws://localhost:2567');

  availableRooms: RoomAvailable[] = [];

  messages: any[] = [];

  userName = '';

  roomName = '';

  room: Room | undefined = undefined;

  reconnected = false;

  userStoreMutations: UserStoreMutations = useMutations('user', ['initRoom']);

  userStoreState: UserStoreState = useState('user', ['room', 'isSignedIn'])

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

  created(): void {
    const { room, isSignedIn } = this.userStoreState;

    joinOrReconnect(isSignedIn, room, this.client, 'my_room').then((resp) => {
      this.reconnected = resp.reconnected;
      if (resp.connectedRoom) this.initRoomData(resp.connectedRoom);
    });
  }

  initRoomData(room: Room): void {
    const { initRoom } = this.userStoreMutations;
    initRoom(room);

    SessionStorage.set('roomId', room.id);
    SessionStorage.set('sessionId', room.sessionId);

    this.roomName = room.name;
    this.userName = room.sessionId;

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

<template>
  <div class="home">
    <q-card dark class="bg-grey-9 my-card">
      <q-card-section>
        <div v-if="!reconnected" class="text-h6">Hello fellow in: {{ roomName }}</div>
        <div v-else class="text-h6">Welcome back!: {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-table
          dense
          title="Available rooms"
          :rows="availableRooms"
          :columns="columns"
          row-key="roomId"
          dark
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
          dark
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
    const roomId:string = SessionStorage.getItem('roomId') || '';
    const sessionId:string = SessionStorage.getItem('sessionId') || '';
    const { room, isSignedIn } = this.userStoreState;

    if (isSignedIn && !!room) {
      this.reconnected = true;

      SessionStorage.set('roomId', room.id);
      SessionStorage.set('sessionId', room.sessionId);

      this.roomName = room.name;
      this.userName = room.sessionId;

      this.client.getAvailableRooms().then((rooms: RoomAvailable[]) => {
        this.availableRooms = rooms;
      }).catch((e) => { console.log('CANNOT FETCH ROOMS', e); });
    } else if (!!roomId && !!sessionId) {
      this.client.reconnect(roomId, sessionId).then((connectedRoom) => {
        this.reconnected = true;
        this.initRoomData(connectedRoom);
      }).catch((e) => {
        console.log('RECONNECT ERROR', e);
        this.client.joinOrCreate('my_room').then((connectedRoom) => {
          this.reconnected = false;
          this.initRoomData(connectedRoom);
        }).catch((er) => {
          console.log('JOIN ERROR', er);
        });
      });
    } else {
      this.client.joinOrCreate('my_room').then((connectedRoom) => {
        this.reconnected = false;
        this.initRoomData(connectedRoom);
      }).catch((e) => {
        console.log('JOIN ERROR', e);
      });
    }
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

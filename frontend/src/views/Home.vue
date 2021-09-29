<template>
  <div class="home">
    <q-card dark class="bg-grey-9 my-card">
      <q-card-section>
        <div class="text-h6">Hello fellow in room {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-table
          dense
          title="Available rooms"
          :rows="availableRooms.value"
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
import { Options, Vue } from 'vue-class-component';
import { Ref, ref } from 'vue';
import * as Colyseus from 'colyseus.js';
import { QTable } from 'quasar';

@Options({})
export default class Home extends Vue {
  client: Colyseus.Client = new Colyseus.Client('ws://localhost:2567');

  availableRooms: Ref<Colyseus.RoomAvailable[]> = ref([]);

  messages: any[] = [];

  userName = '';

  roomName = '';

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
    this.client.joinOrCreate('my_room').then((room) => {
      this.roomName = room.name;
      this.userName = room.sessionId;

      console.log(room);

      room.onStateChange((state) => this.stateChange(state));
      room.onMessage('message', (message) => this.receiveMessage(message));
    }).catch((e) => {
      console.log('JOIN ERROR', e);
    });

    this.client.getAvailableRooms().then((rooms) => {
      this.availableRooms.value = rooms;
      console.log(this.availableRooms.value);
    }).catch((e) => { console.log('CANNOT FETCH ROOMS', e); });
  }

  stateChange(state: any): void {
    this.roomName = '';
    console.log('CHANGED', state);
  }

  receiveMessage(message: any): void {
    this.messages.push(message);
    console.log('NEW MESSAGE', message);
  }
}
</script>

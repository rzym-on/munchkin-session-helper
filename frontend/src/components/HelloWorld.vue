<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>User name in room: {{ userName }}</p>
    <p>Room name: {{ roomName }}</p>
    <h3>Available rooms</h3>
    <table>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Players</th>
      </tr>
      <tr v-for="room in availableRooms.value" :key="room.name">
        <td>{{room.roomId}}</td>
        <td>{{room.name}}</td>
        <td>{{room.clients}}</td>
      </tr>
    </table>

    <h3>Messages from the room</h3>
    <table>
      <tr>
        <th>Title</th>
        <th>Description</th>
      </tr>
      <tr v-for="message in messages" :key="message.title">
        <td>{{message.title}}</td>
        <td>{{message.desc}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Ref, ref } from 'vue';
import * as Colyseus from 'colyseus.js';

@Options({
  props: {
    msg: String,
  },
})
export default class HelloWorld extends Vue {
  msg!: string;

  client: Colyseus.Client = new Colyseus.Client('ws://localhost:2567');

  availableRooms: Ref<Colyseus.RoomAvailable[]> = ref([]);

  messages: any[] = [];

  userName = '';

  roomName = '';

  created(): void {
    this.client.joinOrCreate('my_room').then((room) => {
      this.roomName = room.name;
      this.userName = room.sessionId;

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

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

table {
  padding-top: 10px;
  margin: auto;
}

td, th {
  padding: 0px 2px 0px 2px;
  border: 1px grey solid;
}
</style>

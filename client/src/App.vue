<script lang="ts">
import * as Colyseus from "colyseus.js"

export default {
  data: () => ({
    client: <Colyseus.Client> null,
    availableRooms: <Colyseus.RoomAvailable[]> []
  }),
  created() {
    this.client = new Colyseus.Client('ws://localhost:2567');

    debugger;

    this.client.joinOrCreate('my_room').then(room => {
    console.log(room.sessionId, 'joined', room.name);
    // client.getAvailableRooms().then(rooms => {
    //   availableRooms = ref(rooms)
    // }).catch(e => { console.log("CANNOT FETCH ROOMS", e) });
  }).catch(e => {
    console.log("JOIN ERROR", e);
  });
  }
}

</script>

<template>
  <table>
    <tr><th>roomId</th><th>players</th></tr>
    <tr v-for="room in availableRooms">
      <td>{{room.roomId}}</td>
      <td>{{room.clients}}</td>
    </tr>
  </table>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

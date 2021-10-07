<template>
  <q-layout>
    <q-page-container>
      <q-page class="window-height window-width">
        <div class="row window-height items-center justify-center">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="my-card">
              <q-card-section v-if="!switched">
                <div class="text-h3 center">Your QR code is here</div>
              </q-card-section>

              <q-card-section v-if="!switched" class="center" style="background-color: white">
                <qrcode-vue v-if="!!clientId" :value="clientId" :size="size" level="H" />
              </q-card-section>
              <q-card-section v-if="switched" class="center">
                <div class="text-h3 center">You joined room: {{ userStoreState.room.name }}!</div>
              </q-card-section>

              <q-card-section v-if="!switched" class="center">
                Scan this code from "game master device" to watch game session here
              </q-card-section>

              <q-separator inset />
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Client } from 'colyseus.js';
import QrcodeVue from 'qrcode.vue';
import { createOrReconnect, switchRoom } from '@/colyseus/helpers';
import { useMutation, useState } from '@/store/helpers/useModules';
import { UserStoreState, UserStoreMutations } from '@/store/user/types';

@Options({
  components: {
    QrcodeVue,
  },
})
export default class Watch extends Vue {
  client: Client = new Client('ws://localhost:2567');

  switched = false;

  clientId= '';

  size = 360;

  created():void {
    const room:UserStoreState['room'] = useState('user', 'room');
    const initRoom:UserStoreMutations['initRoom'] = useMutation('user', 'initRoom');

    if (room) return;

    createOrReconnect(this.client, 'lobby_room').then((connectedRoom) => {
      if (connectedRoom) {
        initRoom(connectedRoom);
        this.clientId = `${connectedRoom.sessionId} ${connectedRoom.id}`;

        connectedRoom.onMessage('switchRoom', (message: {toRoomId:string}) => {
          switchRoom(connectedRoom, this.client, message.toRoomId).then((switchedRoom) => {
            if (switchedRoom) initRoom(switchedRoom);
          });
        });
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.center {
  text-align: center;
}
</style>

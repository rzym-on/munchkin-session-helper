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
import { SessionStorage } from 'quasar';
import QrcodeVue from 'qrcode.vue';
import { joinOrReconnect } from '@/colyseus/helpers';
import { useMutations, useState } from '@/store/helpers/useModules';
import { UserStoreState, UserStoreMutations } from '@/store/user/types';

@Options({
  components: {
    QrcodeVue,
  },
})
export default class Watch extends Vue {
  client: Client = new Client('ws://localhost:2567');

  reconnected = false;

  switched = false;

  userStoreMutations: UserStoreMutations = useMutations('user', ['initRoom']);

  userStoreState: UserStoreState = useState('user', ['room', 'isSignedIn']);

  clientId= '';

  size = 360;

  created():void {
    const { room, isSignedIn } = this.userStoreState;
    const { initRoom } = this.userStoreMutations;

    joinOrReconnect(isSignedIn, room, this.client, 'lobby').then((resp) => {
      this.reconnected = resp.reconnected;
      if (resp.connectedRoom) {
        initRoom(resp.connectedRoom);
        this.clientId = `${resp.connectedRoom.sessionId} ${resp.connectedRoom.id}`;
        SessionStorage.set('roomId', resp.connectedRoom.id);
        SessionStorage.set('sessionId', resp.connectedRoom.sessionId);

        resp.connectedRoom.onMessage('switchRoom', (message: {toRoomId:string}) => {
          console.log('SWITCHING ROOM');
          if (resp.connectedRoom) {
            resp.connectedRoom.leave();
            this.client.joinById(message.toRoomId).then((connectedRoom) => {
              this.switched = true;
              SessionStorage.set('roomId', connectedRoom.id);
              SessionStorage.set('sessionId', connectedRoom.sessionId);
              initRoom(connectedRoom);
            });
          }
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

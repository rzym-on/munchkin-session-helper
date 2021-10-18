<template>
  <q-layout>
    <q-page-container>
      <q-page class="window-height window-width">
        <div class="row window-height items-center justify-center">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="my-card">
              <q-card-section v-if="isInLobby">
                <div class="text-h3 center">Your QR code is here</div>
              </q-card-section>

              <q-card-section v-if="isInLobby" class="center" style="background-color: white">
                <qrcode-vue
                  v-if="!!connectionString"
                  :value="connectionString"
                  :size="size"
                  level="H"
                />
              </q-card-section>
              <q-card-section v-if="!isInLobby" class="center">
                <div class="text-h3 center">
                  Hi {{clientInSessionId}} You joined room: {{ connectedRoomName }}!
                </div>
              </q-card-section>

              <q-card-section v-if="isInLobby" class="center">
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
import { watch } from 'vue';
import { Vue, Options } from 'vue-class-component';
import QrcodeVue from 'qrcode.vue';
import { useGetter, useAction } from '@/store/helpers/useModules';

@Options({
  components: {
    QrcodeVue,
  },
})
export default class Watch extends Vue {
  connectedRoomName:string = useGetter('user', 'getRoomName');

  clientInSessionId = useGetter('user', 'getUserId');

  size = 360;

  isInSession:boolean = useGetter('user', 'isInSession');

  isInLobby:boolean = useGetter('user', 'isInLobby');

  get isConnectedToRoom():boolean {
    return useGetter('user', 'isConnectedToRoom').value;
  }

  get connectionString():boolean {
    return useGetter('user', 'connectionString').value;
  }

  created():void {
    if (this.isConnectedToRoom) return;
    useAction('user', 'joinLobby')();

    watch(
      () => this.isInSession,
      (val) => {
        if (!val) return;
        this.$router.push({ name: 'Spectate' });
      },
    );
  }
}
</script>
<style lang="scss" scoped>
.center {
  text-align: center;
}
</style>

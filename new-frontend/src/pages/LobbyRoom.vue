<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="row justify-evenly items-center">
        <div class="col-12 col-md-5">
          <q-card>
            <q-card-section class="text-center">
              <div class="text-h4">
                So here we are as a spectator
              </div>
              <p>
                You're now in the lobby room.
                This is your unique QR Code. Game master need to scan it, to
                add you to game session. Make sure to increase the brightness of the screen,
                so the QR Code will be visible.
              </p>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="row justify-center">
                <div class="col-12">
                  <qrcode-vue
                    v-if="!!userStore.connectionString"
                    :value="userStore.connectionString"
                    :size="360"
                    level="H"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-actions>
              <q-space />
              <q-btn
                outline
                label="Leave lobby"
                :to="{ name: 'StartPage' }"
              />
              <q-space />
            </q-card-actions>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
userStore.joinLobby();
</script>
<style scoped lang="scss">
.q-card {
  box-shadow: none;
  border-radius: 20px;
  border: 2px solid $background;

  .body--light & {
    border: 2px solid $dark;
  }
}
</style>

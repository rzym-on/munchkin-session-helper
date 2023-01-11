<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="row justify-evenly items-center">
        <div class="col-12 col-md-5">
          <q-card>
            <q-card-section class="text-center">
              <div class="text-h4">
                {{ $t('lobbyRoom.title') }}
              </div>
              <p>
                {{ $t('lobbyRoom.description') }}
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
                :label="$t('lobbyRoom.leaveLobbyButton')"
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
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
userStore.joinLobby().then(() => {
  // eslint-disable-next-line no-console
  console.log(userStore.connectionString);
});

watch(() => userStore.isInSession, (neVal, _) => {
  router.push({ name: 'SpectateSession' });
});
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

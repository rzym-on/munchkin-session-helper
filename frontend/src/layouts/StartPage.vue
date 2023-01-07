<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="row justify-evenly items-center">
        <div class="col-12 col-md-5">
          <q-card>
            <q-card-section class="text-center">
              <div class="text-h4">
                Hello fellow
              </div>
              <p>
                I'm here to help you manage your munchkin game session.
                First tell me who you are
              </p>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="row justify-center">
                <div class="col-5">
                  <div class="row">
                    <div class="col-12 q-pb-sm">
                      <q-btn
                        color="warning"
                        text-color="dark"
                        :to="{ name: 'PrepareSession' }"
                      >
                        Game master
                      </q-btn>
                    </div>
                    <div class="col-12">
                      Choose if you're the chosen one to manage
                      stats of the munchkin session.
                    </div>
                  </div>
                </div>
                <q-separator
                  vertical
                  color="grey"
                  class="q-mx-md"
                />
                <div class="col-5">
                  <div class="row">
                    <div class="col-12 q-pb-sm">
                      <q-btn
                        color="info"
                        text-color="dark"
                        :to="{ name: 'LobbyRoom' }"
                      >
                        Spectator
                      </q-btn>
                    </div>
                    <div class="col-12">
                      Choose if you're the spectator of the session.
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';

const q = useQuasar();
q.dark.set(true);

const userStore = useUserStore();
userStore.state.room?.leave();
</script>
<style scoped lang="scss">
.q-card {
  box-shadow: none;
  border: 2px solid $background;
  border-radius: 20px;
}
</style>

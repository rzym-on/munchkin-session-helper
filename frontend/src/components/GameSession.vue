<template>
  <div
    class="row"
  >
    <div
      class="col-12 col-md-6"
      v-if="roomStore.anyPlayers"
    >
      <q-card style="min-height: 45vh">
        <q-card-section class="center">
          <div class="heading">
            <q-icon
              size="xl"
              class="rotate-180"
              name="double_arrow"
              style="display: block"
              :style="{ color: roomStore.currentPlayer?.color }"
            />
            <div class="text-h2 medieval">
              <b>{{ roomStore.currentPlayerName }}</b>
            </div>
            <q-icon
              size="xl"
              name="double_arrow"
              style="display: block"
              :style="{ color: roomStore.currentPlayer?.color }"
            />
          </div>
          <q-separator spaced="sm" />
          <div class="row">
            <div class="col-2">
              <q-btn
                v-if="userStore.amIGameMaster"
                size="md"
                class="custom-outline rotate-content-left"
                @click="userStore.serverMsg('prevTurn')"
              >
                <span class="content">{{ roomStore.prevPlayerName }}</span>
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn
                v-if="userStore.amIGameMaster"
                dense
                round
                class="top-bot-margin custom-outline"
                size="lg"
                icon="expand_less"
                @click="userStore.updatePlayerCommand('lvlUp')"
              />
              <div class="text-h2 medieval">
                <b>{{ roomStore.currentPlayer?.lvl }}</b>
              </div>
              <div class="text-h4 medieval">
                LVL
              </div>
              <q-btn
                v-if="userStore.amIGameMaster"
                dense
                round
                class="top-bot-margin custom-outline"
                size="lg"
                icon="expand_more"
                @click="userStore.updatePlayerCommand('lvlDown')"
              />
            </div>
            <div class="col-2 column items-center justify-center">
              <q-btn
                size="xl"
                round
                class="custom-outline"
                :disable="!userStore.amIGameMaster"
                :loading="roomStore.state.loading"
                :icon="roomStore.currentPlayer?.isWoman ? 'female' : 'male'"
                @click="userStore.updatePlayerCommand('changeGender')"
              >
                <!-- To disable spinner while loading -->
                <template #loading />
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn
                dense
                round
                v-if="userStore.amIGameMaster"
                :disable="!userStore.amIGameMaster"
                class="top-bot-margin custom-outline"
                size="lg"
                icon="expand_less"
                @click="userStore.updatePlayerCommand('gearUp')"
              />
              <div class="text-h2 medieval">
                <b>{{ roomStore.currentPlayer?.gear }}</b>
              </div>
              <div class="text-h4 medieval">
                GEAR
              </div>
              <q-btn
                dense
                round
                v-if="userStore.amIGameMaster"
                class="top-bot-margin custom-outline"
                size="lg"
                icon="expand_more"
                @click="userStore.updatePlayerCommand('gearDown')"
              />
            </div>
            <div class="col-2">
              <q-btn
                v-if="userStore.amIGameMaster"
                size="md"
                class="custom-outline rotate-content-right"
                @click="userStore.serverMsg('nextTurn')"
              >
                <span class="content">{{ roomStore.nextPlayerName }}</span>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-6 pad">
      <q-table
        title="Players"
        :rows="roomStore.state.players"
        :columns="playerColumns()"
        row-key="id"
        :loading="roomStore.state.loading"
        style="height: 50vh"
        :rows-per-page-options="[0]"
        @row-click="rowClick"
      >
        <template #loading />
        <template #body-cell-color="props">
          <q-td :props="props">
            <div>
              <span
                class="dot"
                :style="'background-color: '+props.value"
              />
            </div>
          </q-td>
        </template>
        <template #body-cell-isWoman="props">
          <q-td :props="props">
            <div>
              <q-icon
                size="md"
                flat
                :name="props.value ? 'female' : 'male'"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Player } from 'src/colyseus/schema/Player';
import { useRoomStore, playerColumns } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const roomStore = useRoomStore();
if (!roomStore.currentPlayer && userStore.amIGameMaster) userStore.serverMsg('nextTurn');

function rowClick(e:Event, player:Player) {
  userStore.serverMsg('changeCurrentTurn', player.id);
}
</script>
<style scoped lang="scss">
.medieval {
  font-family: 'MedievalSharp', cursive;
}
.heading {
  display: flex;
  align-items: center;
  justify-content: center;
}
.top-bot-margin {
  margin-top: 10px;
  margin-bottom: 10px;
}
.center {
  text-align: center;
}

.rotate-content-left {
  width: 100%;
  height: 100%;
  span.content {
    transform: rotate(270deg);
    font-size: 1.5rem;
  }
}

.rotate-content-right {
  width: 100%;
  height: 100%;
  span.content {
    transform: rotate(90deg);
    font-size: 1.5rem;
  }
}

</style>

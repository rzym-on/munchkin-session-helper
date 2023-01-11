<template>
  <div
    class="row"
  >
    <div
      class="col-12 col-md-6"
      v-if="roomStore.anyPlayers"
    >
      <q-card>
        <q-card-section class="center">
          <div class="heading">
            <q-icon
              size="xl"
              class="rotate-180"
              name="double_arrow"
              style="display: block"
              :style="{ color: roomStore.currentPlayer?.color, ...userStore.textSize(2.7)}"
            />
            <div
              class="text-h2 medieval"
              :style="userStore.textSize(2.7)"
            >
              <b>{{ roomStore.currentPlayerName }}</b>
            </div>
            <q-icon
              size="xl"
              name="double_arrow"
              style="display: block"
              :style="{ color: roomStore.currentPlayer?.color, ...userStore.textSize(2.7) }"
            />
          </div>
          <q-separator spaced="sm" />
          <div class="row items-center justify-center">
            <div class="col-5">
              <q-btn
                v-if="userStore.amIGameMaster"
                dense
                round
                class="top-bot-margin custom-outline"
                size="lg"
                icon="expand_less"
                @click="userStore.updatePlayerCommand('lvlUp')"
              />
              <div
                class="text-h2 medieval"
                :style="{...userStore.textSize(4), padding: `${userStore.state.fontSize*0.8}px`}"
              >
                <b>{{ roomStore.currentPlayer?.lvl }}</b>
              </div>
              <div
                class="text-h4 medieval"
                :style="userStore.textSize(1.5)"
              >
                {{ $t('gameSession.lvl') }}
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
                :style="userStore.textSize(1.1)"
                :disable="!userStore.amIGameMaster"
                :loading="roomStore.state.loading"
                :icon="roomStore.currentPlayer?.isWoman ? 'female' : 'male'"
                @click="userStore.updatePlayerCommand('changeSex')"
              >
                <!-- To disable spinner while loading -->
                <template #loading />
              </q-btn>
            </div>
            <div class="col-5">
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
              <div
                class="text-h2 medieval"
                :style="{...userStore.textSize(4), padding: `${userStore.state.fontSize*0.8}px`}"
              >
                <b>{{ roomStore.currentPlayer?.gear }}</b>
              </div>
              <div
                class="text-h4 medieval"
                :style="userStore.textSize(1.5)"
              >
                {{ $t('gameSession.gear') }}
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
          </div>
          <div
            class="row top-bot-margin justify-evenly"
            v-if="userStore.amIGameMaster"
          >
            <div class="col-5">
              <q-btn
                size="md"
                class="custom-outline button-max-width"
                @click="userStore.serverMsg('prevTurn')"
              >
                <span>
                  {{ roomStore.prevPlayerName }}
                  <q-icon
                    size="md"
                    class="rotate-180"
                    name="double_arrow"
                    style="display: block"
                  />
                </span>
              </q-btn>
            </div>
            <div class="col-5">
              <q-btn
                size="md"
                class="custom-outline button-max-width"
                @click="userStore.serverMsg('nextTurn')"
              >
                <span>
                  {{ roomStore.nextPlayerName }}
                  <q-icon
                    size="md"
                    name="double_arrow"
                    style="display: block"
                  />
                </span>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-6 pad">
      <q-table
        :title="$t('playerTable.title')"
        :rows="roomStore.state.players"
        :columns="playerColumns(userStore.state.fontSize)"
        row-key="id"
        :loading="roomStore.state.loading"
        style="height: 50vh"
        :rows-per-page-options="[0]"
        @row-click="rowClick"
        hide-pagination
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

.button-max-width {
  width: 100%;
}

</style>

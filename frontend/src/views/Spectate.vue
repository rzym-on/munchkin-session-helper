<template>
  <q-layout style="min-height: 100%">
    <div class="row">
      <div class="col-12 col-md-5 pad">
        <q-card style="min-height: 50vh">
          <q-card-section class="center">
            <div class="heading">
              <q-icon
                size="xl"
                class="rotate-180"
                name="double_arrow"
                style="display: block"
                v-bind:style="{ color: currentPlayer?.color }"
              />
              <div class="text-h2 medieval"><b>{{currentPlayerName}}</b></div>
              <q-icon
              size="xl"
                name="double_arrow"
                style="display: block"
                v-bind:style="{ color: currentPlayer?.color }"
              />
            </div>
            <q-separator spaced="lg" />
            <div class="row">
              <div class="col-5">
                <div class="text-h2 medieval"><b>{{currentPlayer?.lvl}}</b></div>
                <div class="text-h4 medieval">LVL</div>
              </div>
              <div class="col-2 column items-center justify-center">
                <q-btn
                  size="xl"
                  round
                  flat
                  :loading="loading"
                  :icon="currentPlayer?.isWoman ? 'female' : 'male'"
                  @click.prevent
                >
                  <!-- To disable spinner while loading -->
                  <template v-slot:loading></template>
                </q-btn>
              </div>
              <div class="col-5">
                <div class="text-h2 medieval"><b>{{currentPlayer?.gear}}</b></div>
                <div class="text-h4 medieval">GEAR</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-7 pad">
        <q-card>
          <!-- PLAYERS -->
          <q-table
            title="Players"
            :rows="players"
            :columns="playerCols"
            row-key="id"
            color="amber"
            :loading="loading"
            style="height: 50vh"
            :rows-per-page-options="[0]"
          >
          <template v-slot:loading></template>
          <template v-slot:body-cell-color="props">
            <q-td :props="props">
              <div>
                <span class="dot" :style="'background-color: '+props.value"></span>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-isWoman="props">
            <q-td :props="props">
              <div>
                <q-icon
                  size="md"
                  flat
                  :name="props.value ? 'female' : 'male'"
                ></q-icon>
              </div>
            </q-td>
          </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-layout>
</template>
<script lang="ts">
import { watch } from 'vue';
import { Vue, Options } from 'vue-class-component';
import { Room } from 'colyseus.js';
import { QTable, useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { Player } from '@/colyseus/schema/Player';
import { useAction, useGetter } from '@/store/helpers/useModules';

@Options({})
export default class Spectate extends Vue {
  q:QVueGlobals = useQuasar();

  players:Player[] = useGetter('room', 'getAllPlayers');

  loading:boolean = useGetter('room', 'isLoading');

  isInSession:boolean = useGetter('user', 'isInSession');

  room:Room|undefined = useGetter('user', 'getRoom');

  currentPlayer:string = useGetter('room', 'currentPlayer');

  currentPlayerName:string = useGetter('room', 'currentPlayerName');

  playerCols: QTable['columns'] = [
    {
      name: 'color', label: 'Color', field: 'color', align: 'center', style: 'width: 30px',
    },
    {
      name: 'isWoman', label: 'Gender', field: 'isWoman', align: 'center', style: 'width: 30px',
    },
    {
      name: 'lvl', label: 'Level', field: 'lvl', align: 'center', style: 'width: 30px',
    },
    {
      name: 'gear', label: 'Gear', field: 'gear', align: 'center', style: 'width: 30px',
    },
    {
      name: 'name', label: 'Name', field: 'name', align: 'left',
    },
  ];

  created(): void {
    if (this.room) useAction('room', 'initStateChanges')(this.room);

    watch(
      () => this.isInSession,
      (val) => {
        if (val) return;
        this.$router.push({ name: 'Watch' });
      },
      { immediate: true },
    );
  }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

.pad {
  padding: 5px 5px 5px 5px;
}
.center {
  text-align: center;
}
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
}
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
</style>

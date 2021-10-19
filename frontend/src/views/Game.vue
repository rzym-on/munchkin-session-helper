<template>
  <q-layout style="min-height: 100%">
    <div class="row">
      <div class="col-12 col-md-5 pad">
        <q-card style="min-height: 45vh">
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
            <q-separator spaced="sm" />
            <div class="row">
              <div class="col-5">
                <q-btn
                  dense round
                  class="top-bot-margin"
                  size="lg"
                  icon="expand_less"
                  @click="lvlUp"
                />
                <div class="text-h2 medieval"><b>{{currentPlayer?.lvl}}</b></div>
                <div class="text-h4 medieval">LVL</div>
                <q-btn
                  dense round
                  class="top-bot-margin"
                  size="lg"
                  icon="expand_more"
                  @click="lvlDown"
                />
              </div>
              <div class="col-2 column items-center justify-center">
                <q-btn
                  size="xl"
                  round
                  :loading="loading"
                  :icon="currentPlayer?.isWoman ? 'female' : 'male'"
                  @click="changeGender"
                >
                  <!-- To disable spinner while loading -->
                  <template v-slot:loading></template>
                </q-btn>
              </div>
              <div class="col-5">
                <q-btn
                  dense round
                  class="top-bot-margin"
                  size="lg"
                  icon="expand_less"
                  @click="gearUp"
                />
                <div class="text-h2 medieval"><b>{{currentPlayer?.gear}}</b></div>
                <div class="text-h4 medieval">GEAR</div>
                <q-btn
                  dense round
                  class="top-bot-margin"
                  size="lg"
                  icon="expand_more"
                  @click="gearDown"
                />
              </div>
            </div>
            <div class="row justify-center top-bot-margin">
              <div class="col-6">
                <q-btn size="md" icon="undo" :label="prevPlayerName" @click="prevTurn" />
              </div>
              <div class="col-6">
                <q-btn size="md" :label="nextPlayerName" @click="nextTurn" icon-right="redo" />
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
            style="height: 100%"
            :rows-per-page-options="[0]"
            @row-click="rowClick"
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
import { Vue, Options } from 'vue-class-component';
import { QTable, useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { Player } from '@/colyseus/schema/Player';
import { useAction, useGetter } from '@/store/helpers/useModules';

@Options({})
export default class Game extends Vue {
  q:QVueGlobals = useQuasar();

  players:Player[] = useGetter('room', 'getAllPlayers');

  loading:boolean = useGetter('room', 'isLoading');

  currentPlayer:Player|undefined = useGetter('room', 'currentPlayer');

  currentPlayerName:string = useGetter('room', 'currentPlayerName');

  nextPlayerName:string = useGetter('room', 'nextPlayerName');

  prevPlayerName:string = useGetter('room', 'prevPlayerName');

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
    const isConnectedToRoom = useGetter('user', 'isConnectedToRoom').value;

    if (!isConnectedToRoom) {
      useAction('user', 'joinCreateSessionRoom')().then((room) => {
        if (!room) return;
        useAction('room', 'initStateChanges')(room).then(() => {
          this.checkPlayers();
        });
      });
    } else {
      this.checkPlayers();
      if (!this.currentPlayer) this.nextTurn();
    }
  }

  checkPlayers():void {
    const anyPlayers = useGetter('room', 'anyPlayers').value;
    if (anyPlayers) return;
    this.$router.push({ name: 'Room' });
    this.q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'check',
      message: 'You didn\'t created any players yet, we cannot start the game',
    });
  }

  rowClick(e:Event, row:Player):void { useAction('user', 'changeCurrentTurn')(row.id); }

  changeGender():void { useAction('user', 'changeGender')(this.currentPlayer?.id); }

  lvlUp():void { useAction('user', 'lvlUp')(this.currentPlayer?.id); }

  lvlDown():void { useAction('user', 'lvlDown')(this.currentPlayer?.id); }

  gearUp():void { useAction('user', 'gearUp')(this.currentPlayer?.id); }

  gearDown():void { useAction('user', 'gearDown')(this.currentPlayer?.id); }

  nextTurn():void { useAction('user', 'nextTurn')(); }

  prevTurn():void { useAction('user', 'prevTurn')(); }
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

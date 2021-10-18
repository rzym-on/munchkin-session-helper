<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Hello fellow in: {{ roomName }}</div>
        <div class="text-subtitle2">Your ID: {{ userName }}</div>
      </q-card-section>

      <q-separator inset />

      <!-- PLAYERS -->
      <q-card-section>
        <q-table
          dense
          title="Players"
          :rows="players"
          :columns="playerCols"
          row-key="id"
          color="amber"
          :loading="loading"
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
              <q-btn
                size="md"
                flat
                :icon="props.value ? 'female' : 'male'"
                @click="changeGender(props.key)"
              ></q-btn>
            </div>
          </q-td>
        </template>
        </q-table>
      </q-card-section>

      <q-card-section>
        <q-table
          dense
          title="Spectators"
          :rows="spectators"
          :columns="spectatorCols"
          row-key="clientId"
          color="amber"
          :rows-per-page-options="[0]"
        >
        <template v-slot:body-cell-kick="props">
          <q-td :props="props">
            <div>
              <q-btn size="md" flat icon="logout" @click="kickSpec(props.key)" />
            </div>
          </q-td>
        </template>
        </q-table>
      </q-card-section>
    </q-card>

    <edit-player v-model="addPlayerDialog"></edit-player>
    <add-spectator-dialog v-model="addSpectatorDialog"></add-spectator-dialog>

    <!-- FAB BUTTONS -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="purple" icon="add" direction="up">
        <q-fab-action
          external-label
          label-position="left"
          color="secondary"
          icon="person_add"
          label="Add player"
          @click="addPlayerDialog = true"
        />
        <q-fab-action
          external-label
          label-position="left"
          color="primary"
          icon="person_search"
          label="Add spectator"
          @click="addSpectatorDialog = true"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { QTable, useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { useGetter, useAction } from '@/store/helpers/useModules';
import EditPlayer from '@/components/dialog/EditPlayer.vue';
import AddSpectatorDialog from '@/components/dialog/AddSpectatorDialog.vue';
import { Player } from '@/colyseus/schema/Player';
import { Spectator } from '@/colyseus/schema/Spectator';

@Options({
  components: { EditPlayer, AddSpectatorDialog },
})
export default class Home extends Vue {
  q:QVueGlobals = useQuasar();

  anyPlayers:boolean = useGetter('room', 'anyPlayers');

  players:Player[] = useGetter('room', 'getAllPlayers');

  currentPlayerName:Player | undefined = useGetter('room', 'currentPlayerName');

  spectators:Spectator[] = useGetter('room', 'getAllSpectators');

  isConnectedToRoom:boolean = useGetter('user', 'isConnectedToRoom');

  userName:string = useGetter('user', 'getUserId');

  roomName:string = useGetter('user', 'getRoomName');

  loading:boolean = useGetter('room', 'isLoading');

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

  spectatorCols: QTable['columns'] = [
    {
      name: 'id', label: 'Id', field: 'clientId', align: 'left', style: 'width: 50px',
    },
    {
      name: 'name', label: 'Name', field: 'name', align: 'left',
    },
    {
      name: 'kick', label: 'Kick', field: 'kick', align: 'center',
    },
  ];

  addPlayerDialog = false;

  addSpectatorDialog = false;

  created(): void {
    if (this.isConnectedToRoom) return;
    useAction('user', 'joinCreateSessionRoom')().then((room) => {
      if (!room) return;
      useAction('room', 'initStateChanges')(room);
    });
  }

  kickSpec(clientId:string):void {
    useAction('user', 'kickSpectator')(clientId);

    this.q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'check',
      message: `Spectator ${clientId} left`,
    });
  }

  changeGender(playerId:number):void {
    useAction('user', 'changeGender')(playerId);
  }
}
</script>
<style lang="scss" scoped>
.body--dark {
  .my-card {
    background: #424242;
  }
}

.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
}
</style>

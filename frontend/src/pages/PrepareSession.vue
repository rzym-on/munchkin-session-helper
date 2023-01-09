<template>
  <q-page
    class="row"
    style="align-content:flex-start"
  >
    <div class="col-12 col-md-8 text-center">
      <q-table
        dense
        title="Players"
        :rows="roomStore.state.players"
        :columns="playerColumns()"
        row-key="id"
        color="amber"
        :loading="roomStore.state.loading"
        :rows-per-page-options="[0]"
      >
        <template #no-data />
        <template #body-cell-showInfo="props">
          <q-td :props="props">
            <q-btn
              size="sm"
              dense
              flat
              round
              icon="mdi-pencil"
              title="Edit player"
              @click="playerDialog.showEditDialog(props.row.id)"
            />
          </q-td>
        </template>
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
              <q-btn
                size="md"
                flat
                :icon="props.value ? 'female' : 'male'"
                @click="changeGender(props.row.id)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="col-12 col-md-4 text-center">
      <q-table
        dense
        title="Spectators"
        :rows="roomStore.spectators"
        :columns="spectatorColumns()"
        row-key="clientId"
        color="amber"
        :rows-per-page-options="[0]"
      >
        <template #no-data />
        <template #body-cell-showInfo="props">
          <q-td :props="props">
            <q-btn
              size="lg"
              flat
              icon="mdi-logout"
              title="Kick spectator"
              @click="kickSpectator(props.key)"
            />
            <q-btn
              size="lg"
              flat
              icon="mdi-plus"
              title="Increase font size"
              @click="changeFont(props.key, 2)"
              :disabled="props.row.fontSize >= font.limit.max"
            />
            <q-btn
              size="lg"
              flat
              icon="mdi-minus"
              title="Decrease font size"
              @click="changeFont(props.key, -2)"
              :disabled="props.row.fontSize <= font.limit.min"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>

  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-fab
      color="primary"
      icon="add"
      direction="up"
    >
      <q-fab-action
        external-label
        label-position="left"
        color="secondary"
        icon="person_add"
        label="Add player"
        @click="playerDialog.showEditDialog(-1)"
      />
      <q-fab-action
        external-label
        label-position="left"
        color="primary"
        icon="person_search"
        label="Add spectator"
        @click="spectatorDialog.isVisible.value = true"
      />
    </q-fab>
  </q-page-sticky>

  <EditPlayerDialog
    v-if="playerDialog.isVisible.value"
    v-model="playerDialog.isVisible.value"
    :player-id="playerDialog.modelId.value"
  />
  <AddSpectatorDialog
    v-if="spectatorDialog.isVisible.value"
    v-model="spectatorDialog.isVisible.value"
  />
</template>
<script setup lang="ts">
import { Room } from 'colyseus.js';
import { useQuasar } from 'quasar';
import LoadingMaskVue from 'src/components/loading/LoadingMask.vue';
import { useRoomStore, playerColumns, spectatorColumns } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';
import { defineAsyncComponent } from 'vue';
import editDialogCmp from 'src/cmp/editDialogCmp';
import { Player } from 'src/colyseus/schema/Player';
import useFontSize from 'src/cmp/useFontSize';

const EditPlayerDialog = defineAsyncComponent({
  loader: () => import('src/components/dialog/EditPlayerDialog.vue'),
  loadingComponent: LoadingMaskVue,
});
const AddSpectatorDialog = defineAsyncComponent({
  loader: () => import('src/components/dialog/AddSpectatorDialog.vue'),
  loadingComponent: LoadingMaskVue,
});

const q = useQuasar();
const playerDialog = editDialogCmp();
const spectatorDialog = editDialogCmp();
const roomStore = useRoomStore();
const userStore = useUserStore();
const font = useFontSize(15, 50);

if (!userStore.isInSession) {
  userStore.joinCreateSessionRoom().then(() => {
    if (!userStore.state.room) return;
    roomStore.initStateChanges(userStore.state.room as Room);
  });
}

function changeGender(playerId:number) {
  const player = roomStore.getById(playerId);
  if (!player) return;
  player.isWoman = !player.isWoman;
  userStore.updatePlayer(player as Player);
}

function kickSpectator(clientId:string) {
  userStore.serverMsg('kickSpectator', clientId);

  q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'check',
    message: `Spectator ${clientId} left`,
  });
}
function changeFont(clientId:string, amount:number) {
  const spectator = roomStore.state.spectators.get(clientId);
  if (!spectator) return;
  spectator.fontSize += amount;
  userStore.serverMsg('changeFontSize', {
    spectatorId: clientId,
    fontSize: spectator.fontSize,
  });
}

</script>
<style scoped lang="scss">
</style>

<template>
  <q-dialog
    v-model="dialogVisible"
    transition-show="jump-up"
    transition-hide="jump-up"
  >
    <q-card class="base-dialog">
      <q-bar>
        <strong>{{ props.playerId === -1 ? 'Add' : 'Edit' }}Player</strong>
        <q-space />
        <q-btn
          dense
          flat
          icon="mdi-close"
          v-close-popup
        >
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section
        style="max-height: 80vh"
        class="scroll"
      >
        <q-form
          greedy
          ref="form"
        >
          <div class="q-px-xs">
            <div class="row justify-center">
              <div class="col-md-12 col-12 q-ma-sm">
                <q-input
                  dense
                  outlined
                  hide-bottom-space
                  v-model="player.name"
                  label="Player name *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </div>
              <div class="col-md-6 col-12">
                <div class="row">
                  <div class="col-2 text-center q-pt-xs">
                    <span
                      class="dot"
                      :style="'background-color: '+player.color"
                    />
                  </div>
                  <div class="col-10">
                    <q-input
                      outlined
                      dense
                      hide-bottom-space
                      v-model="player.color"
                      :rules="['anyColor']"
                      label="Player color *"
                    >
                      <template #append>
                        <q-icon
                          name="colorize"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-color
                              default-view="palette"
                              format-model="hex"
                              v-model="player.color"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-12">
                <div class="row justify-center items-center">
                  <q-radio
                    v-model="isWoman"
                    :val="1"
                    label="Woman"
                  />
                  <q-radio
                    v-model="isWoman"
                    :val="0"
                    label="Man"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <slot name="left_buttons" />
        <q-space />
        <q-btn
          color="positive"
          label="Save"
          @click="onSubmit"
        />
        <q-btn
          v-if="props.playerId !== -1"
          color="warning"
          text-color="dark"
          label="Delete"
          @click="deletePlayer"
        />
        <q-btn
          color="primary"
          label="Cancel"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { QForm, useQuasar } from 'quasar';
import DialogVisible from 'src/cmp/dialogCmp';
import { Player } from 'src/colyseus/schema/Player';
import { useRoomStore } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';
import { Ref, ref } from 'vue';

const emits = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean,
  playerId: number
}>();

const q = useQuasar();
const dialogVisible = DialogVisible();
const form = ref() as Ref<QForm>;
const player = ref(new Player());
player.value.color = '#ffffff';
const isWoman = ref(0);
const userStore = useUserStore();
const roomStore = useRoomStore();

if (props.playerId !== -1) {
  const storePlayer = roomStore.getById(props.playerId);
  player.value = { ...storePlayer } as Player;
}

function deletePlayer() {
  userStore.serverMsg('removePlayer', { ...player.value });
  q.notify({
    color: 'green-4',
    textColor: 'dark',
    icon: 'check',
    message: `Player ${player.value.name} deleted from session`,
  });
  dialogVisible.value = false;
}

function onSubmit() {
  player.value.isWoman = Boolean(isWoman.value);
  if (props.playerId === -1) {
    userStore.serverMsg('addPlayer', { ...player.value });
  } else {
    userStore.serverMsg('updatePlayer', { ...player.value });
  }

  q.notify({
    color: 'green-4',
    textColor: 'dark',
    icon: 'check',
    message: `Added player: ${player.value.name}`,
  });
  dialogVisible.value = false;
}

</script>
<style lang="scss">
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;

  .body--light & {
    border: 1px solid grey;
  }
}
</style>

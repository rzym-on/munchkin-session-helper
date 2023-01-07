<template>
  <q-dialog
    v-model="dialogVisible"
    transition-show="jump-up"
    transition-hide="jump-up"
  >
    <q-card class="base-dialog">
      <q-bar>
        <strong>Add spectator</strong>
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
        v-if="!showQrScanner && !enterByString"
        style="max-height: 80vh"
        class="scroll"
      >
        <q-form
          greedy
          ref="form"
          @submit.prevent="onSubmit(true)"
        >
          <div class="q-px-xs">
            <div class="row justify-center">
              <div class="col-md-12 col-12 q-ma-sm">
                <q-input
                  dense
                  outlined
                  v-model="spectatorName"
                  label="Type your own name for this spectator"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions
        align="right"
        v-if="!showQrScanner && !enterByString"
      >
        <q-btn
          label="Scan QR Code"
          type="submit"
          color="primary"
          @click="onSubmit(true)"
        />
        <q-btn
          label="connection string"
          type="submit"
          color="primary"
          @click="onSubmit()"
        />
      </q-card-actions>

      <q-card-section v-if="enterByString">
        <q-form
          greedy
          ref="connectionStringForm"
          @submit.prevent="onSubmit(true)"
        >
          <div class="q-px-xs">
            <div class="row justify-center">
              <div class="col-md-12 col-12 q-ma-sm">
                <q-input
                  dense
                  outlined
                  v-model="connectionString"
                  label="Paste connection string from spectator"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </div>
              <q-btn
                label="Add"
                color="primary"
                @click="addByString"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="showQrScanner">
        Use camera to scan for QR Code on spectator monitor, to add them to your session
      </q-card-section>

      <q-card-section v-if="showQrScanner">
        <qrcode-stream @decode="onDecode" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';
import DialogVisible from 'src/cmp/dialogCmp';
import { QForm, useQuasar } from 'quasar';
import { Ref, ref } from 'vue';
import { QrcodeStream } from 'qrcode-reader-vue3';

defineEmits(['update:modelValue']);
defineProps<{
  modelValue: boolean
}>();

const q = useQuasar();
const userStore = useUserStore();
const dialogVisible = DialogVisible();
const showQrScanner = ref(false);
const enterByString = ref(false);
const spectatorName = ref('');
const connectionString = ref('');
const form = ref(null) as Ref<QForm | null>;
const connectionStringForm = ref(null) as Ref<QForm | null>;

async function onSubmit(qrCode = false) {
  const isValid = await form.value?.validate();
  if (!isValid) return;
  if (qrCode) {
    showQrScanner.value = true;
  } else {
    enterByString.value = true;
  }
}

function onDecode(url:string) {
  userStore.addSpectator(spectatorName.value, url);
  dialogVisible.value = false;
  q.notify({
    color: 'green-4',
    textColor: 'dark',
    icon: 'check',
    message: `Added ${spectatorName.value}`,
  });
}

async function addByString() {
  const isValid = await connectionStringForm.value?.validate();
  if (!isValid) return;
  userStore.addSpectator(spectatorName.value, connectionString.value);
  dialogVisible.value = false;
  q.notify({
    color: 'green-4',
    textColor: 'dark',
    icon: 'check',
    message: `Added ${spectatorName.value}`,
  });
}
</script>
<style lang="scss"></style>

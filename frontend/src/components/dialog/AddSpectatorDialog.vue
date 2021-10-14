<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 700px">
      <q-card-section>
        <div class="text-h6">Add new spectator</div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="showQrScanner">
        Use camera to scan for QR Code on spectator monitor, to add them to your session
      </q-card-section>

      <q-card-section v-if="showQrScanner" style="max-height: 50vh" class="scroll">
        <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
      </q-card-section>

      <q-card-section v-if="!showQrScanner" style="max-height: 50vh" class="scroll">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
        <q-separator />

        <div class="row">
          <div class="col-md-12 col-12">
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
        <q-card-actions align="right">
          <q-btn label="Scan QR Code" type="submit" color="primary"/>
        </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { Options } from 'vue-class-component';
import BaseDialog from '@/helpers/BaseDialog';
import { useState } from '@/store/helpers/useModules';

@Options({ name: 'add-spectator-dialog' })
export default class AddSpectatorDialog extends BaseDialog {
  spectatorName = '';

  showQrScanner = false;

  q:QVueGlobals = useQuasar();

  onDecode = (url:string):void => {
    const room = useState('user', 'room');

    room.send('addSpectator', {
      spectatorName: this.spectatorName,
      connectionString: url,
    });

    this.q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: 'Added new spectator',
    });

    this.closeDialog();
  }

  beforeClose = () => {
    this.spectatorName = '';
    this.showQrScanner = false;
  }

  onInit = (promise:Promise<any>):void => {
    promise
      .then(console.log)
      .catch(console.error);
  }

  onSubmit():void {
    this.showQrScanner = true;
  }
}
</script>

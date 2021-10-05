<template>
  <q-page>
    <div>
      <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
    </div>
  </q-page>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { useState } from '@/store/helpers/useModules';
import { UserStoreState } from '@/store/user/types';

export default class AddViewer extends Vue {
  userStoreState: UserStoreState = useState('user', ['room', 'isSignedIn'])

  onDecode = (url:string):void => {
    const { room } = this.userStoreState;
    if (room) {
      room.send('addWatcher', {
        clientId: url,
      });
    } else {
      console.log('Youre not in any room :S');
    }
    console.log('DECODED', url);
  }

  onInit = (promise:Promise<any>):void => {
    promise
      .then(console.log)
      .catch(console.error);
  }
}
</script>

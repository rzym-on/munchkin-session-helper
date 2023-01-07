<template>
  <q-page>
    <GameSession />
  </q-page>
</template>
<script setup lang="ts">
import { Room } from 'colyseus.js';
import GameSession from 'src/components/GameSession.vue';
import { useRoomStore } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const roomStore = useRoomStore();
if (!userStore.isInSession) {
  userStore.joinCreateSessionRoom().then(() => {
    if (!userStore.state.room) return;
    roomStore.initStateChanges(userStore.state.room as Room);
  });
}
</script>
<style scoped lang="scss">
</style>

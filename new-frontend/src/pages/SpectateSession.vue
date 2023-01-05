<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page
        style="align-content:flex-start"
      >
        <GameSession />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { Room } from 'colyseus.js';
import GameSession from 'src/components/GameSession.vue';
import { useRoomStore } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const roomStore = useRoomStore();
watch(() => userStore.isInSession, async (isInSession) => {
  if (!isInSession) {
    const isConnected = await userStore.tryReconnectSessionRoom();
    if (!isConnected) {
      router.push({ name: 'LobbyRoom' });
    }
  }
  roomStore.initStateChanges(userStore.state.room as Room);
}, { immediate: true });

</script>
<style lang="scss"></style>

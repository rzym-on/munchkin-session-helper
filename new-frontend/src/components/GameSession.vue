<template>
  <div class="row">
    <div class="col-12">
      Siema
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoomStore } from 'src/stores/roomStore';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const roomStore = useRoomStore();
</script>
<style lang="scss"></style>

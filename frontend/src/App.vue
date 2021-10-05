<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';

export default class App extends Vue {
  quasar: QVueGlobals = useQuasar();

  created():void {
    this.quasar.dark.set(true);
  }
}
</script>

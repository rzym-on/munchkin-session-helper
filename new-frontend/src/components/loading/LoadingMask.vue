<template><div /></template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';

export default {
  setup() {
    const q = useQuasar();
    q.loading.show({
      group: 'component-loading',
    });
    onBeforeUnmount(() => {
      q.loading.hide('component-loading');
    });
  },
};
</script>

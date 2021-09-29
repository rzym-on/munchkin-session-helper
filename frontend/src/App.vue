<template>
  <q-layout view="lHh Lpr lFf">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <q-icon name="videogame_asset"  style="font-size: 2rem;"/>
          </q-avatar>
          GrandMajster
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable to="/">
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item active clickable to="/about">
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section>
              About
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    const $q = useQuasar();
    $q.dark.set(true);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>

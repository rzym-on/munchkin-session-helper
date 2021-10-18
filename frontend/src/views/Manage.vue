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

        <q-btn dense flat round icon="dark_mode" @click="switchDark" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable exact to="/manage">
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Room
            </q-item-section>
          </q-item>
          <q-item clickable to="/game">
            <q-item-section avatar>
              <q-icon name="sports" />
            </q-item-section>

            <q-item-section>
              Game
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';

export default class Manage extends Vue {
  leftDrawerOpen = false;

  darkMode = true;

  quasar: QVueGlobals = useQuasar();

  created():void {
    this.quasar.dark.set(this.darkMode);
  }

  switchDark():void {
    this.darkMode = !this.darkMode;
    this.quasar.dark.set(this.darkMode);
  }

  toggleLeftDrawer():void {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}
</script>

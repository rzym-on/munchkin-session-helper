<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Munchkin game helper
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="dark_mode"
          @click="switchDark"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list
          padding
          class="menu-list"
        >
          <q-item
            clickable
            exact
            :to="{name: 'PrepareSession'}"
          >
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Prepare game
            </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{name: 'RunSession'}"
          >
            <q-item-section avatar>
              <q-icon name="sports" />
            </q-item-section>

            <q-item-section>
              Run game
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
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const q = useQuasar();

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const darkMode = ref(true);
q.dark.set(darkMode.value);
function switchDark() {
  darkMode.value = !darkMode.value;
  q.dark.set(darkMode.value);
}
</script>
<style lang="scss"></style>

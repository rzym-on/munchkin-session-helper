<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page
        class="row justify-center items-center"
        style="align-content: center;"
      >
        <div
          class="col-12"
          style="text-align: center;"
        >
          <q-btn
            outline
            class="q-mx-md"
            @click="changeLang"
          >
            {{ locale === 'pl-PL' ? 'English' : 'Polski' }}
          </q-btn>
        </div>
        <div class="col-12 col-md-5">
          <q-card>
            <q-card-section class="text-center">
              <div class="text-h4">
                {{ $t('startPage.title') }}
              </div>
              <p>
                {{ $t('startPage.subTitle') }}
              </p>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="row justify-center">
                <div class="col-5">
                  <div class="row">
                    <div class="col-12 q-pb-sm">
                      <q-btn
                        color="warning"
                        text-color="dark"
                        :to="{ name: 'PrepareSession' }"
                      >
                        {{ $t('startPage.gameMasterButton') }}
                      </q-btn>
                    </div>
                    <div class="col-12">
                      {{ $t('startPage.gameMasterDesc') }}
                    </div>
                  </div>
                </div>
                <q-separator
                  vertical
                  color="grey"
                  class="q-mx-md"
                />
                <div class="col-5">
                  <div class="row">
                    <div class="col-12 q-pb-sm">
                      <q-btn
                        color="info"
                        text-color="dark"
                        :to="{ name: 'LobbyRoom' }"
                      >
                        {{ $t('startPage.spectatorButton') }}
                      </q-btn>
                    </div>
                    <div class="col-12">
                      {{ $t('startPage.spectatorDesc') }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { LocalStorage, useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const q = useQuasar();
q.dark.set(true);
const { locale } = useI18n({ useScope: 'global' });

const userStore = useUserStore();
userStore.state.room?.leave();

function changeLang() {
  router.push(`/${locale.value === 'pl-PL' ? 'en-US' : 'pl-PL'}`);
}

locale.value = q.lang.getLocale();

if (route.params.locale) {
  locale.value = route.params.locale;
  LocalStorage.set('locale', locale.value);
} else {
  const localLocale = LocalStorage.getItem<string>('locale');
  if (localLocale) locale.value = localLocale;
}

const stopWatch = watch(() => route.params.locale, (newVal, oldVal) => {
  if (oldVal === newVal || !newVal) return;
  stopWatch();
  window.location.reload();
});
</script>
<style scoped lang="scss">
.q-card {
  box-shadow: none;
  border: 2px solid $background;
  border-radius: 20px;
}
</style>

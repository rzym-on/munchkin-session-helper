import { createApp } from 'vue';
import { Quasar } from 'quasar';
import VueQrcodeReader from 'vue3-qrcode-reader';
import App from './App.vue';
import router from './router';
import store from './store';
import quasarUserOptions from './quasar-user-options';

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(VueQrcodeReader)
  .mount('#app');

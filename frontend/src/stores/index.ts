import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(/* async */(/* { ssrContext } */) => {
  const pinia = createPinia();
  // pinia.use(SomePiniaPlugin)
  return pinia;
});

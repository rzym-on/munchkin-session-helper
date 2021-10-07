import { createStore } from 'vuex';
import type { Store } from 'vuex';
import userStore from './user';
import { UserStore } from './user/types';

export interface GrandStore {
  modules: {
    user: UserStore
  }
}

export default createStore({
  modules: {
    user: userStore,
  },
}) as Store<GrandStore>;

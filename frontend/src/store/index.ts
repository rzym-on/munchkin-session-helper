import { createStore } from 'vuex';
import type { Store } from 'vuex';
import userStore from './user';
import roomStore from './room';
import { GrandStore } from './types';

export default createStore({
  modules: {
    user: userStore,
    room: roomStore,
  },
}) as Store<GrandStore>;

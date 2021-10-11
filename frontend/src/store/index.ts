import { createStore } from 'vuex';
import type { Store } from 'vuex';
import userStore from './user';
import roomStore from './room';
import { UserStore } from './user/types';
import { RoomStore } from './room/types';

export interface GrandStore {
  modules: {
    user: UserStore,
    room: RoomStore
  }
}

export default createStore({
  modules: {
    user: userStore,
    room: roomStore,
  },
}) as Store<GrandStore>;

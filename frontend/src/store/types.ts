import { RoomStore } from './room/types';
import { UserStore } from './user/types';

export interface GrandStore {
  modules: {
    user: UserStore,
    room: RoomStore
  }
}

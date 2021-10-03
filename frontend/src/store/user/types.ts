import { Room } from 'colyseus.js';

export interface UserStoreState {
  isSignedIn: boolean;
  room: Room | undefined;
}

export interface UserStoreMutations {
  initRoom(room:Room):void
}

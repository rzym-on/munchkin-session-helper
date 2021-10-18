// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'
import { Spectator } from './Spectator'

export class SessionState extends Schema {
    @type([ Player ]) public players: ArraySchema<Player> = new ArraySchema<Player>();
    @type("number") public currPlayerId!: number;
    @type({ map: Spectator }) public spectators: MapSchema<Spectator> = new MapSchema<Spectator>();
}

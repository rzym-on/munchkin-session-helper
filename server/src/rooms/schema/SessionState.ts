import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player";
import { Spectator } from "./Spectator";

export class SessionState extends Schema {
  @type([Player]) players = new ArraySchema<Player>();
  @type("number") currPlayerId:number;
  @type({ map: Spectator }) spectators = new MapSchema<Spectator>();
}
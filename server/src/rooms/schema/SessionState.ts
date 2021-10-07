import { Schema, ArraySchema, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";

export class SessionState extends Schema {
  @type([PlayerState]) players = new ArraySchema<PlayerState>();
}
import { Schema, type } from "@colyseus/schema";

export class Spectator extends Schema {
  @type("string") clientId: string;
  @type("string") name: string;

  constructor(clientId:string, name:string) {
    super();
    this.clientId = clientId;
    this.name = name;
  }
}
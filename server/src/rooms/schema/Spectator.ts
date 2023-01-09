import { Schema, type } from "@colyseus/schema";

export class Spectator extends Schema {
  @type("string") clientId: string;
  @type("boolean") connected = true;
  @type("string") name: string;
  @type("number") fontSize: number;

  constructor(clientId:string, name:string) {
    super();
    this.clientId = clientId;
    this.name = name;
    this.fontSize = 19;
  }
}
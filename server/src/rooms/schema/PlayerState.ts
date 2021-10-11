import { Schema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  @type("string") name: string;
  @type("number") lvl: number;
  @type("number") gear: number;

  constructor(name:string) {
    super()
    this.name = name;
    this.lvl = 0;
    this.gear = 0;
  }
}
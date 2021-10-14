import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string;
  @type("number") lvl: number;
  @type("number") gear: number;
  @type("boolean") isWoman: boolean;
  @type("string") color: string;

  constructor(player:any) {
    super();
    this.name = player.name;
    this.isWoman = player.isWoman;
    this.color = player.color;
    this.lvl = 0;
    this.gear = 0;
  }
}
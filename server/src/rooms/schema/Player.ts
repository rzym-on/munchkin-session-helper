import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") id: number;
  @type("string") name: string;
  @type("number") lvl: number;
  @type("number") gear: number;
  @type("boolean") isWoman: boolean;
  @type("string") color: string;

  constructor(id:number, player:any) {
    super();
    this.id = id;
    this.name = player.name;
    this.isWoman = player.isWoman;
    this.color = player.color;
    this.lvl = 0;
    this.gear = 0;
  }
}
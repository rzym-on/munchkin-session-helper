// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Player extends Schema {
    @type("number") public id!: number;
    @type("string") public name!: string;
    @type("number") public lvl!: number;
    @type("number") public gear!: number;
    @type("boolean") public isWoman!: boolean;
    @type("string") public color!: string;
}

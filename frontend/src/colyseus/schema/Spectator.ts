// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Spectator extends Schema {
    @type("string") public clientId!: string;
    @type("boolean") public connected!: boolean;
    @type("string") public name!: string;
    @type("number") public fontSize!: number;
}

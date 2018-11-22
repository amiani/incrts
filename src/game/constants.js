import { ProtoAssembler, ProtoCrucible, ProtoGenerator } from './pieces/prototypes'
export const TICKRATE = 100
export const ASSMODS = 4
export const CRUCIBLEMODS = 3
export const GENMODS = 2
export const BOARDANGLE = Math.PI/4
export const MODHEIGHT = 132 / (
  ASSMODS*Math.cos(BOARDANGLE)
  + CRUCIBLEMODS*Math.cos(BOARDANGLE/2)
  + GENMODS
)
console.log('modheight: ', MODHEIGHT)

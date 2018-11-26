import { ProtoAssembler, ProtoCrucible, ProtoGenerator } from './pieces/prototypes'
export const TICKRATE = 100
export const ASSMODS = 4.25
export const CRUCIBLEMODS = 3.25
export const GENMODS = 2.25
export const BOARDANGLE = Math.PI/4
export const MODHEIGHT = 125 / (
  ASSMODS*Math.cos(BOARDANGLE)
  + CRUCIBLEMODS*Math.cos(BOARDANGLE/2)
  + GENMODS
)

import { ProtoAssembler, ProtoCrucible, ProtoPreaccelerator } from './pieces/prototypes'
export const TICKRATE = 100
export const ASSHEIGHT = 3.25
export const ASSMODS = 2
export const ACCHEIGHT = 3.25
export const ACCMODS = 1
export const BOARDANGLE = Math.PI/4
export const BOARDDIST = 50
const ratio = 1000/(1000-BOARDDIST)
export const MODHEIGHT = ratio*10
  /*
export const MODHEIGHT = ratio*90 / (
  ASSHEIGHT
  + ASSMODS*Math.cos(BOARDANGLE/3)
  + ACCMODS*Math.cos(2*BOARDANGLE/3)
  + ACCHEIGHT*Math.cos(BOARDANGLE)
)
*/
  /*
export const BOARDDIST = (
  ASSMODS*MODHEIGHT*Math.sin(BOARDANGLE/3)
  + ACCMODS*MODHEIGHT*Math.sin(2*BOARDANGLE/3)
  + ACCHEIGHT*MODHEIGHT*Math.sin(BOARDANGLE)
)
*/
export const PERSPECTIVE = 100
export const TOPROWDIST = (-90/6)*(1+BOARDDIST/PERSPECTIVE)

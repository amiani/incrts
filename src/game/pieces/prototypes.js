import uuidv4 from 'uuid/v4'
import { ProtoDeviceMod } from './mods/prototypes.js'
import { ASSMODS, ACCMODS, MODHEIGHT } from '../constants'

export function ProtoAssembler() {
  this.id = uuidv4()
  this.type = 'assemblers'
  this.name = 'assembler'
  this.cost = { credits: 50, fabric: 50 }
  this.mods = []
  this.status = true
  this.baseDrain = 1
  this.drain = 1
  this.speed = { value: 1, min: 0, max: 50 }
  this.harm = { value: 1, min: 0, max: 10 }
  this.oscillator = {
    position: { x: 20, y: 80 },
    velocity: { x: 0, y: 0 },
    sync: 50
  }
}
ProtoAssembler.mods = ASSMODS
ProtoAssembler.height = 3.25*MODHEIGHT
export const appWidth = 420
ProtoAssembler.width = appWidth

export function ProtoCrucible() {
  this.id = uuidv4()
  this.type = 'crucibles'
  this.name = 'crucible'
  this.cost = { credits: 50, fabric: 50 }
  this.mods = []
  this.baseDrain = 1
  this.drain = 1
  this.speed = 1
}
//ProtoCrucible.mods = CRUCIBLEMODS
ProtoCrucible.height = 3.25*MODHEIGHT
ProtoCrucible.width = appWidth

export function ProtoPreaccelerator() {
  this.id = uuidv4()
  this.type = 'preaccelerators'
  this.name = 'preaccelerator'
  this.cost = { credits: 50, fabric: 50 }
  this.baseOutput = 1
  this.output = 1
  this.capacity = 10
  this.fillRate = 5
  this.velocity = 5
}
ProtoPreaccelerator.width = appWidth
ProtoPreaccelerator.mods = ACCMODS
ProtoPreaccelerator.height = 3.25*MODHEIGHT

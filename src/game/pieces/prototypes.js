import uuidv4 from 'uuid/v4'
import { ProtoDeviceMod } from './mods/prototypes.js'
import { ASSMODS, CRUCIBLEMODS, GENMODS, MODHEIGHT } from '../constants'

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
  this.sync = 0
}
ProtoAssembler.mods = ASSMODS
ProtoAssembler.height = 4.25*MODHEIGHT
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
ProtoCrucible.mods = CRUCIBLEMODS
ProtoCrucible.height = 3.25*MODHEIGHT
ProtoCrucible.width = appWidth

export function ProtoGenerator() {
  this.id = uuidv4()
  this.type = 'generators'
  this.name = 'generator'
  this.cost = { credits: 50, fabric: 50 }
  this.baseOutput = 1
  this.output = 1
}
ProtoGenerator.width = appWidth
ProtoGenerator.mods = GENMODS
ProtoGenerator.height = 2.25*MODHEIGHT

export function ProtoPort() {
  this.id = uuidv4()
  this.type = 'ports'
  this.name = 'port'
  this.cost = { credits: 100, fabric: 50 }
  this.destination = null
}
ProtoPort.width = 350
ProtoPort.height = 150

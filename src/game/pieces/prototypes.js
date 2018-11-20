import uuidv4 from 'uuid/v4'
import { ProtoDeviceMod } from './mods/prototypes.js'
import { hardware, device } from '../components/procedures'
import { ProtoTank } from './units'

export function ProtoAssembler() {
  this.id = uuidv4()
  this.type = 'assemblers'
  this.name = 'assembler'
  this.cost = { credits: 50, fabric: 50 }
  this.baseProcedures = [new ProtoTank(this.id)]
  this.procedures = [new ProtoTank(this.id)]
  this.mods = []
  this.status = true
  this.baseDrain = 1
  this.drain = 1
}
ProtoAssembler.height = 300
ProtoAssembler.width = 200

export function ProtoCrucible() {
  this.id = uuidv4()
  this.type = 'crucibles'
  this.name = 'crucible'
  this.cost = { credits: 50, fabric: 50 }
  this.mods = []
  this.baseProcedures = [hardware, device]
  this.procedures = [hardware, device]
  this.baseDrain = 1
  this.drain = 1
}
ProtoCrucible.width = 200
ProtoCrucible.height = 250

export function ProtoGenerator() {
  this.id = uuidv4()
  this.type = 'generators'
  this.name = 'generator'
  this.cost = { credits: 50, fabric: 50 }
  this.baseOutput = 1
  this.output = 1
}
ProtoGenerator.width = 200
ProtoGenerator.height = 200

export function ProtoPort() {
  this.id = uuidv4()
  this.type = 'ports'
  this.name = 'port'
  this.cost = { credits: 100, fabric: 50 }
  this.destination = null
}
ProtoPort.width = 350
ProtoPort.height = 150

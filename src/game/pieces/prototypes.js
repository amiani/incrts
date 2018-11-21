import uuidv4 from 'uuid/v4'
import { ProtoDeviceMod } from './mods/prototypes.js'
import procedures from '../components/procedures'
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
ProtoAssembler.width = 250
ProtoAssembler.height = 400

export function ProtoCrucible() {
  this.id = uuidv4()
  this.type = 'crucibles'
  this.name = 'crucible'
  this.cost = { credits: 50, fabric: 50 }
  this.mods = []
  this.baseProcedures = [procedures.hardware, procedures.device]
  this.procedures = [procedures.hardware, procedures.device]
  this.baseDrain = 1
  this.drain = 1
}
ProtoCrucible.width = 250
ProtoCrucible.height = 300

export function ProtoGenerator() {
  this.id = uuidv4()
  this.type = 'generators'
  this.name = 'generator'
  this.cost = { credits: 50, fabric: 50 }
  this.baseOutput = 1
  this.output = 1
}
ProtoGenerator.width = 250
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

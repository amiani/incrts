import uuidv4 from 'uuid/v4'
import { ProtoDeviceMod } from './mods/prototypes.js'
import { hardware, device } from '../components/recipes'
import { ProtoTank } from './units'

export function ProtoFactory() {
  this.id = uuidv4()
  this.type = 'factories'
  this.name = 'factory'
  this.cost = { credits: 50, fabric: 50 }
  this.drain = 1
  this.recipes = [new ProtoTank(this.id)]
  this.mods = []
  this.status = true
  this.computed = {}
}
ProtoFactory.height = 300
ProtoFactory.width = 200

export function ProtoAssembler() {
  this.id = uuidv4()
  this.type = 'assemblers'
  this.name = 'assembler'
  this.cost = { credits: 50, fabric: 50 }
  this.mods = []
  this.recipes = [hardware, device]
  this.drain = 1
  this.computed = {}
}
ProtoAssembler.width = 200
ProtoAssembler.height = 250

export function ProtoGenerator() {
  this.id = uuidv4()
  this.type = 'generators'
  this.name = 'generator'
  this.cost = { credits: 50, fabric: 50 }
  this.output = 1
  this.computed = {}
}
ProtoGenerator.width = 200
ProtoGenerator.height = 200

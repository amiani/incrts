import uuidv4 from 'uuid/v4'

export function ProtoClock(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.type = 'mods'
  this.name = 'Clock'
  this.icon = 'clock.png'
  this.version = 1
  this.controlName = 'ClockBack'
}

export function ProtoDeviceMod(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.type = 'mods'
  this.name = 'Device Mod'
  this.icon = 'devicemod.png'
  this.version = 1
  this.cost = { fabric: 50 }
  this.drain = 0
  this.status = true
  this.controlName = 'DeviceModControl'
  this.procedures = []
}

import uuidv4 from 'uuid/v4'

export function ProtoQueue(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.progress = 0
  this.maxLength = 2
  this.procedures = []
  this.buildRate = 1
  this.currProc = 0
}

export function ProtoStack(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.procedures = {}
  this.progress = 0
}

export function ProtoBuffer(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.capacity = 10
  this.units = { tanks: [], }
  this.maxRate = 5
  this.unitCounts = {}
}

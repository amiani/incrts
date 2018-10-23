import uuidv4 from 'uuid/v4'

export function ProtoBuildQueue(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.progress = 0
  this.maxLength = 2
  this.items = []
  this.loop = true
  this.buildRate = 1
}

export function ProtoHangar(ownerId, isSource) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.capacity = 10
  this.isSource = isSource
  this.demand = { tanks: 0 }
  this.units = { tanks: [], }
}

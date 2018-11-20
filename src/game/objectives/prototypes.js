import uuidv4 from 'uuid/v4'

export function ProtoOrder(orderNumber, want, deadline) {
  this.id = uuidv4()
  this.want = want
  this.units = {}
  this.deadline = deadline
  this.customer = 'Zagreb Corp.'
  this.orderNumber = orderNumber
}

export function ProtoBattlefield(bufferId) {
  this.id = uuidv4()
  this.component = 'Battlefield'
  this.bufferId = bufferId
  this.enroute = []
}

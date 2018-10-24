import uuidv4 from 'uuid/v4'

export function ProtoOrder(want, deadline) {
  this.id = uuidv4()
  this.want = want
  this.units = {}
  this.deadline = deadline
}

export function ProtoBattlefield(hangarId) {
  this.id = uuidv4()
  this.component = 'Battlefield'
  this.hangarId = hangarId
  this.enroute = []
}